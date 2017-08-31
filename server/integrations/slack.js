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

  announceNewProposal (proposal) {
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
        color: this.color
      }
      ]
    }
    this.post('general', message, params)
  }
}
//  https://k94n.com/es6-modules-single-instance-pattern
// let Slack = new Bot('xoxb-235361904727-5DyC1qvmDuYMAPq0KtkrAaWN', 'Calcifer')
let Slack = new Bot(token, name)
export default Slack
