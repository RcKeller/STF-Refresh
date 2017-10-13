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
    //  FIXME: Despite this being a documented implementation, it freezes async processes and the server will not build
    //  Initialize crash reporting upon node process termination
    // if (process.env.NODE_ENV === 'production') this.initializeCrashReporting()

    //  Bot avatar
    this.icon_emoji = ':calcifer:'
    //  Channels & Users to mention in announcements
    this.channel = config.has('prod') ? 'general' : 'test'
    this.developer = 'stfcweb'
    this.proposalOfficer = 'stfagent'
    this.financeManager = 'techfee'
    this.chair = 'stfchair'
  }

  //  https://strongloop.com/strongblog/robust-node-applications-error-handling/
  initializeCrashReporting () {
    process
      .on('uncaughtException', (err) => this.crashReport(err))
      .catch(err => console.error(err))
  }

  crashReport (err) {
    const message = 'WARNING: The STF Webapp experienced a fatal crash'
    const { icon_emoji } = this
    const params = {
      icon_emoji,
      attachments: [{
        title: `${new Date().toLocaleString()}`,
        text: err,
        color: 'warning'
      }
      ]
    }
    this.Bot.postMessageToUser(this.developer, message, params)
  }

  announceProposal (proposal) {
    try {
      const { year, number, title, category, uac, organization, body, contacts, asked } = proposal
      const contact = contacts.find(contact => contact.role === 'primary')
      const message = 'A new proposal has been published!'
      const { icon_emoji } = this
      const params = {
        icon_emoji,
        attachments: [{
          title: `${year}-${number}: ${title} ${uac ? '(UAC)' : ''}`,
          title_link: `https://uwstf.org/proposal/${year}/${number}/`,
          fields: [
            { title: 'Asked', value: asked, short: true },
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
          pretext: `@${this.proposalOfficer}`,
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
        }
        ]
      }
      this.Bot.postMessageToChannel(this.channel, message, params)
    } catch (err) {
      console.error(err)
    }
  }

  announcePartial (manifest, proposal) {
    try {
      const { total } = manifest
      const { year, number, title, uac, asked } = proposal
      const message = 'New partial (or "alternate") budget!'
      const { icon_emoji } = this
      const params = {
        attachments: [{
          icon_emoji,
          pretext: `@${this.proposalOfficer}`,
          title: `${year}-${number}: ${title} ${uac ? '(UAC)' : ''}`,
          title_link: `https://uwstf.org/proposal/${year}/${number}/`,
          fields: [
            { title: 'Original Ask', value: currency(asked), short: true },
            { title: 'Revised Ask', value: currency(total), short: true },
            { title: '% of Original', value: percentage(total / asked), short: true }
          ],
          color: 'good'
        }
        ]
      }
      this.Bot.postMessageToChannel(this.channel, message, params)
    } catch (err) {
      console.error(err)
    }
  }

  announceOverexpenditure (report, manifest) {
    //  NOTE: We do this with manifest data, NOT proposal data (e,g, received) because the logic is tied to individual awards. (e.g. a report can be made for an intiial award, then a supplement).
    try {
      console.log(manifest, report)
      const { year, number, title, uac } = manifest.proposal
      const awarded = manifest.total
      const reported = report.total
      const message = `WARNING: An overexpenditure was just reported!`
      const { icon_emoji } = this
      const params = {
        icon_emoji,
        attachments: [{
          pretext: `@${this.financeManager}`,
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
