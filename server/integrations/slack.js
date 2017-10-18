import SlackBot from 'slackbots'
import config from 'config'
const token = config.get('slack.token')
const name = config.get('slack.name')

const currency = number =>
  number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })

const percentage = (str) => `%${Number.parseFloat(str).toFixed(2)}`

class Bot {
  /**
    @param token Slackbot Token
    @param name Name of the user
    https://my.slack.com/services/new/bot
  */
  constructor (token, name) {
    console.warn('SLCK: Initializing slackbot integration')
    //  Initialize SlackBot
    this.Bot = new SlackBot({ token, name })
      .on('start', () => console.log('SLCK: Initializing SlackBot'))
      .on('open', () => console.log('SLCK: Open for real-time messaging'))
      .on('message', data => console.log(`SLCK: Posting ${data.type} / ${Object.keys(data).slice(1)}`))
      .on('error', err => console.error('SLCK:', err))
      .on('close', err => console.error('SLCK: Fatal:', err))

    //  Bot avatar
    this.icon_emoji = ':calcifer:'
    //  Channels & Users to mention in announcements
    this.channel = config.has('prod') ? 'general' : 'test'
  }

  announceProposal (proposal) {
    try {
      const { icon_emoji } = this
      const { year, number, title, category, uac, organization, body, contacts, asked } = proposal
      const contact = contacts.find(contact => contact.role === 'primary')
      const message = 'A new proposal has been published!'
      const params = {
        icon_emoji,
        attachments: [{
          title: `${year}-${number}: ${title} ${uac ? '(UAC)' : ''}`,
          title_link: `https://uwstf.org/proposal/${year}/${number}/`,
          fields: [
            { title: 'Asked', value: currency(asked), short: true },
            { title: 'Organization', value: organization, short: true },
            { title: 'Category', value: category, short: true },
            { title: 'Primary Contact', value: `${contact.name} (${contact.netID})`, short: true }
          ],
          text: body.overview.abstract,
          color: 'warning'
        }
        ]
      }
      this.Bot.postMessageToChannel(this.channel, message, params)
    } catch (err) {
      console.error(err)
    }
  }

  announceSupplemental (manifest, proposal) {
    try {
      const { total, body } = manifest
      const { year, number, title, uac, asked, received } = proposal
      const message = 'A new supplemental request was received!'
      const { icon_emoji } = this
      const params = {
        icon_emoji,
        attachments: [{
          title: `${year}-${number}: ${title} ${uac ? '(UAC)' : ''}`,
          title_link: `https://uwstf.org/proposal/${year}/${number}/`,
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

  announceOverexpenditure (report, manifest) {
    //  NOTE: We do this with manifest data, NOT proposal data (e,g, received) because the logic is tied to individual awards. (e.g. a report can be made for an intiial award, then a supplement).
    try {
      const { year, number, title, uac } = manifest.proposal
      const awarded = manifest.total
      const reported = report.total
      const { icon_emoji } = this
      const message = `WARNING: An overexpenditure was just reported!`
      const params = {
        icon_emoji,
        attachments: [{
          title: `${year}-${number}: ${title} ${uac ? '(UAC)' : ''}`,
          title_link: `https://uwstf.org/proposal/${year}/${number}/`,
          fields: [
            { title: 'Awarded', value: currency(awarded), short: true },
            { title: 'Reported', value: currency(reported), short: true },
            { title: 'Overexpenditure', value: currency(reported - awarded), short: true },
            { title: 'Overexpended', value: percentage(reported / awarded), short: true }
          ],
          color: 'danger'
        }
        ]
      }
      this.Bot.postMessageToChannel(this.channel, message, params)
    } catch (err) {
      console.error(err)
    }
  }
}

//  https://k94n.com/es6-modules-single-instance-pattern
// let Slack = new Bot('<bot-api-key>', 'Calcifer')
let Slack = new Bot(token, name)
export default Slack
