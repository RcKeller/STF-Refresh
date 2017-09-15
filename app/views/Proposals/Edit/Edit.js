import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'
// import { redirectUnaffiliated } from '../../../util/selectors'

import Introduction from './Introduction/Introduction'
import Contacts from './Contacts/Contacts'
import ProjectPlan from './ProjectPlan/ProjectPlan'
import Budget from './Budget/Budget'
import Signatures from './Signatures/Signatures'
import Publish from './Publish/Publish'

import { Icon, Spin, Tabs, message } from 'antd'
const TabPane = Tabs.TabPane

const colors = {
  green: '#00a854',
  gold: '#85754d'
}

import styles from './Edit.css'
@compose(
  connect(state => ({
    //  Loads async, don't use specific selectors.
    proposal: state.db.proposal,
    user: state.user
  })),
  connectRequest(props => api.get('proposal', {
    id: props.params.id,
    join: ['contacts', 'body', 'manifests'],
    force: true
  }))
)
class Edit extends React.Component {
  static propTypes = {
    router: PropTypes.object,
    api: PropTypes.object,
    proposal: PropTypes.object,
    user: PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = {
      valid: {
        introduction: false,
        contacts: false,
        project: false,
        budget: false,
        signatures: false
      },
      warnedAdmin: false
    }
  }
  /*
  If a section hasn't been validated, run validations as the server returns updated props (on tab change)
  Saving this in state allows us to stop redundant validation attempts.
  */
  componentWillReceiveProps (nextProps) {
    let { valid } = this.state
    const next = nextProps.proposal
    if (!valid.introduction) this.validateIntroduction(next)
    if (!valid.contacts) this.validateContacts(next)
    if (!valid.project) this.validateProject(next)
    if (!valid.budget) this.validateBudget(next)
    if (!valid.signatures) this.validateSignatures(next)
  }

  validateIntroduction = (
    { title, category, organization } = this.props,
    { valid } = this.state
  ) => {
    valid.introduction = (title && category && organization) ? true : false // eslint-disable-line
    this.setState({ valid })
  }
  validateContacts = (
    { contacts } = this.props,
    { valid } = this.state
  ) => {
    let requiredFields = 0
    for (const { role } of contacts) {
      if (role === 'organization' || role === 'budget' || role === 'primary') requiredFields++
    }
    valid.contacts = requiredFields >= 3 || false
    this.setState({ valid })
  }
  validateProject = (
    { body } = this.props,
    { valid } = this.state
  ) => {
    const { overview, plan } = body || {}
    console.warn('Validate body', body, overview, plan)
    let requiredFields = 0
    //  Overview is valid if three prompts as well as the three impact types are filled
    if (overview) {
      const { abstract, justification, objectives, impact } = overview
      if (abstract && justification && objectives) requiredFields++
      if (impact && Object.keys(impact).length >= 3) requiredFields++
    }
    //  Project plan is valid if each of the 5 valid subcategories has a current and future state.
    if (plan) {
      let validCategories = 0
      for (const key of Object.keys(plan)) {
        if (plan[key] && plan[key].current && plan[key].future) validCategories++
      }
      if (validCategories >= 5) requiredFields++
    }
    valid.project = requiredFields >= 3
    this.setState({ valid })
  }
  validateBudget = (
    { manifests } = this.props,
    { valid } = this.state
  ) => {
    //  Keeping the validation simple here due to anticipated future enhancement of server side pre/post processing.
    const { items } = manifests[0]
    valid.budget = Array.isArray(items) && items.length >= 1
    this.setState({ valid })
  }
  validateSignatures = (
    { contacts } = this.props,
    { valid } = this.state
  ) => {
    let requiredFields = 0
    for (const { role, signature } of contacts) {
      if (role === 'organization' || role === 'budget' || role === 'primary') {
        if (signature) requiredFields++
      }
    }
    valid.signatures = requiredFields >= 3
    this.setState({ valid })
  }
  redirectUnaffiliatedUsers = (
    { router, user, proposal: { contacts } } = this.props,
    { warnedAdmin } = this.state
  ) => {
    if (Array.isArray(contacts) && contacts.length > 0) {
      const affiliated = contacts.map(con => con.netID)
      const affiliate = affiliated.includes(user.netID)
      const admin = user.stf && user.stf.admin
      if (!affiliate && !admin) {
        router.push('/')
        message.error(`You are not affiliated with this proposal. Affiliates include: ${affiliated.toString()}`)
      }
      if (admin && !warnedAdmin) {
        message.warning('You\'re viewing another person\'s proposal using admin permissions. Be very careful.')
        this.setState({ warnedAdmin: true })
      }
    }
  }
  render (
    { router, forceRequest, proposal, user } = this.props,
    { valid } = this.state
  ) {
    const { introduction, contacts, project, budget, signatures } = valid
    const complete = Object.keys(valid).every(k => valid[k] === true)
    //  Once proposals have loaded, redirect unaffiliated users.
    //  You can log out of Shib and push an update, but if you leave the page after that, it locks you out.
    if (user && proposal) this.redirectUnaffiliatedUsers()
    console.log('rendering w/ valid:', valid)
    return (
      <article className={styles['page']}>
        <Helmet title='New Proposal' />
        {!proposal
          ? <Spin size='large' tip='Loading...' />
          : <div id={proposal._id}>
            <h1>{`Editing: ${proposal.title || 'New Proposal'}`}</h1>
            <h6>{`Draft ID: ${proposal._id}`}</h6>
            <hr />
            <Tabs tabPosition='top' defaultActiveKey='1'
              onChange={forceRequest}
            >
              <TabPane key='1'
                tab={<span style={{ color: introduction ? colors.green : colors.gold }}>
                  <Icon type='file' />Introduction</span>
                }>
                <Introduction validate={this.validateIntroduction} />
              </TabPane>
              <TabPane key='2'
                tab={<span style={{ color: contacts ? colors.green : colors.gold }}>
                  <Icon type='team' />Contacts</span>
                }>
                <Contacts validate={this.validateContacts} />
              </TabPane>
              <TabPane key='3'
                tab={<span style={{ color: project ? colors.green : colors.gold }}>
                  <Icon type='book' />Project Plan</span>
                }>
                <ProjectPlan validate={this.validateProject} />
              </TabPane>
              <TabPane key='4'
                tab={<span style={{ color: budget ? colors.green : colors.gold }}>
                  <Icon type='wallet' />Budget</span>
                }>
                <Budget validate={this.validateBudget} />
              </TabPane>
              <TabPane key='5'
                tab={<span style={{ color: signatures ? colors.green : colors.gold }}>
                  <Icon type='edit' />Signatures</span>
                }>
                <Signatures validate={this.validateSignatures} />
              </TabPane>
              <TabPane key='6' disabled={!complete}
                tab={<span><Icon type='rocket' />Publish !</span>}>
                <Publish />
              </TabPane>
            </Tabs>
            {!complete && <em>Once all sections are complete (indicated by the tab turning green), the publish option will appear.</em>}
          </div>
        }
      </article>
    )
  }
}

export default Edit
