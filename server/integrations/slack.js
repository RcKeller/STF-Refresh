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
    this.Bot = new SlackBot({ token, name })
    this.color = '#4b2e83'
  }
  post (channel, message, params) {
    this.Bot.postMessageToChannel(channel, message, params)
  }

  announceProposal (proposal) {
    const { year, number, title, category, uac, organization, body, contacts, asked } = proposal
    const contact = contacts.find(contact => contact.role === 'primary')
    const message = 'A new proposal has been published!'
    const params = {
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
    this.post('test', message, params)
  }

  announceSupplemental (manifest, proposal) {
    const { total, body } = manifest
    const { year, number, title, uac, asked, received } = proposal
    const message = 'A new supplemental request was received!'
    const params = {
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
      }
      ]
    }
    this.post('test', message, params)
  }

  announcePartial (manifest, proposal) {
    const { total } = manifest
    const { year, number, title, uac, asked } = proposal
    const message = 'New partial (or "alternate") budget!'
    const params = {
      attachments: [{
        title: `${year}-${number}: ${title} ${uac ? '(UAC)' : ''}`,
        title_link: `https://uwstf.org/proposal/${year}/${number}/`,
        fields: [
          { title: 'Original Ask', value: currency(asked), short: true },
          { title: 'Revised Ask', value: currency(total), short: true },
          { title: '% of Original Ask', value: percentage(total / asked), short: true }
        ],
        color: 'good'
      }
      ]
    }
    this.post('test', message, params)
  }

  announceOverexpenditure (report, manifest) {
    // const { year, number, title, category, uac, organization, body, contacts, asked } = proposal
    // const contact = contacts.find(contact => contact.role === 'budget')
    // const message = `${author.name} just reported an overexpenditure!`
    // const params = {
    //   as_user: true,
    //   attachments: [{
    //     title: `${year}-${number}: ${title} ${uac ? '(UAC)' : ''}`,
    //     title_link: `https://uwstf.org/proposal/${year}/${number}/`,
    //     fields: [
    //       { title: 'received', value: asked, short: true },
    //       { title: 'Organization', value: organization, short: true },
    //       { title: 'Category', value: category, short: true },
    //       { title: 'Primary Contact', value: `${contact.name} (${contact.netID})`, short: true }
    //     ],
    //     text: body.overview.abstract,
    //     color: this.color
    //   }
    //   ]
    // }
    // this.post('test', message, params)
  }
}
//  https://k94n.com/es6-modules-single-instance-pattern
// let Slack = new Bot('xoxb-235361904727-5DyC1qvmDuYMAPq0KtkrAaWN', 'Calcifer')
let Slack = new Bot(token, name)
export default Slack
