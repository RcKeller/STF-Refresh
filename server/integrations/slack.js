import SlackBot from 'slackbots'
import config from 'config'
const token = config.get('slack.token')
const name = config.get('slack.name')

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
      // as_user: true,
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
        color: 'good'
      }
      ]
    }
    this.post('test', message, params)
  }

  announceSupplemental (manifest, proposal) {
    console.log(manifest, proposal)
    const { total, body } = manifest
    const { year, number, title, uac, asked, received } = proposal
    const increase = `%#{Number.parseInt(total / received)}`
    const message = 'A new supplemental request was received!'
    const params = {
      // as_user: true,
      attachments: [{
        title: `${year}-${number}: ${title} ${uac ? '(UAC)' : ''}`,
        title_link: `https://uwstf.org/proposal/${year}/${number}/`,
        fields: [
          { title: 'Asked', value: asked, short: true },
          { title: 'Received', value: received, short: true },
          { title: 'Supplement', value: total, short: true },
          { title: '% Increase', value: increase, short: true }
        ],
        text: `
          ${manifest.title}
          ${body}
        `,
        color: 'good'
      }
      ]
    }
    this.post('test', message, params)
  }

  announcePartial (manifest) {
    console.log(manifest)
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
