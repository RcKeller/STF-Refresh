import SlackBot from 'slackbots'
import { Proposal } from '../db/models'
import config from 'config'

export const currency = (number = 0) => `$${Number.parseInt(number).toLocaleString('en-US')}`

const percentage = (expected, actual) => {
  let percent = Number.parseInt((actual / expected) * 100)
  if (Number.isNaN(percentage)) percent = 0
  return `${percent}%`
}

class Bot {
  // Slackbot websocket events
  start = () => console.log('SLCK: Initializing SlackBot')
  open = () => console.log('SLCK: Open for real-time messaging')
  message = (data) => console.log(`SLCK: Posting ${data.type} / ${Object.keys(data).slice(1)}`)
  error = (err) => console.error('SLCK:', err)
  close = (err) => console.error('SLCK: Fatal:', err)
  //  Bot avatar (Howl's Moving Castle)
  icon_emoji = ':calcifer:' // eslint-disable-line

  /**
    @param token Slackbot Token
    @param name Name of the user
    @param channel Channel the bot resides in
    https://my.slack.com/services/new/bot
  */
  constructor (token, name, channel) {
    this.channel = channel
    this.Bot = new SlackBot({ token, name })
      .on('start', this.start)
      .on('open', this.open)
      .on('message', this.message)
      .on('error', this.error)
      .on('close', this.close)
  }

  async announceProposal ({ year, number }) {
    const { icon_emoji } = this
    try {
      let proposal = await Proposal
        .findOne({ year, number })
        .populate({ path: 'body', select: 'overview.abstract' })
      const { title, category, uac, organization, body, asked } = proposal
      const message = 'A new proposal has been published!'
      const params = {
        icon_emoji,
        attachments: [{
          title: `${year}-${number}: ${title} ${uac ? '(UAC)' : ''}`,
          title_link: `https://uwstf.org/proposals/${year}/${number}/`,
          fields: [
            { title: 'Asked', value: currency(asked), short: true },
            { title: 'Organization', value: organization, short: true },
            { title: 'Category', value: category, short: true }
          ],
          text: body && body.overview
            ? body.overview.abstract
            : 'Preview text not available',
          color: 'warning'
        }
        ]
      }
      this.Bot.postMessageToChannel(this.channel, message, params)
    } catch (err) {
      console.error(err)
    }
  }

  async announceSupplemental (manifest, proposal) {
    const { icon_emoji } = this
    const { total, body } = manifest
    const { year, number, title, uac, asked, received } = proposal
    try {
      const message = 'A new supplemental request was received!'
      const params = {
        icon_emoji,
        attachments: [{
          title: `${year}-${number}: ${title} ${uac ? '(UAC)' : ''}`,
          title_link: `https://uwstf.org/proposals/${year}/${number}/`,
          fields: [
            { title: 'Original Ask', value: currency(asked), short: true },
            { title: 'Awarded', value: currency(received), short: true },
            { title: 'Supplement', value: currency(total), short: true },
            { title: '% of Award', value: percentage(total / received), short: true }
          ],
          text: `
            ${manifest.title}
            ${body}
          `,
          color: 'warning'
        }]
      }
      this.Bot.postMessageToChannel(this.channel, message, params)
    } catch (err) {
      console.error(err)
    }
  }
}

const token = config.get('slack.token')
const name = config.get('slack.name')
const channel = config.has('prod') ? 'general' : 'test'

//  https://k94n.com/es6-modules-single-instance-pattern
const Slack = new Bot(token, name, channel)
export default Slack
