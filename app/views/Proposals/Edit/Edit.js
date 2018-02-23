import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'

import { initialProposalContacts } from '../../../selectors'

import Introduction from './Introduction/Introduction'
import Contacts from './Contacts/Contacts'
import ProjectPlan from './ProjectPlan/ProjectPlan'
import Budget from './Budget/Budget'
import Signatures from './Signatures/Signatures'
import Publish from './Publish/Publish'

import { Spin, Icon, Tooltip, Tabs, Alert, message } from 'antd'
const TabPane = Tabs.TabPane

const colors = {
  green: '#00a854',
  gold: '#85754d'
}
/*
EDIT PAGE:  .../edit/:id
A hefty page and container
Each section is a tabbed panel
and saving (or navigating) will trigger validators
Validators cascade down from this component.

Some of the logic here can be quite tricky.
Things we try and account for are along the lines of:
- Users creating duplicate contacts / budgets
- Saving return data with IDS (e.g. manifest item ids) so we can PATCH instead of POST on the next update.

Of all parts on the site,
this could use the most refactoring.
*/
import styles from './Edit.css'
@compose(
  connect(state => ({
    //  Loads async, don't use specific selectors.
    proposal: state.db.proposal,
    contacts: initialProposalContacts(state),
    user: state.user,
    submissions: state.config.submissions,
    date: state.db.proposal && state.db.proposal.date
  })),
  connectRequest(props => api.get('proposal', {
    id: props.params.id,
    populate: [
      'contacts', 'body',
      { path: 'manifests', populate: { path: 'items' } }
    ],
    force: true
  }))
)
class Edit extends React.Component {
  static propTypes = {
    router: PropTypes.object,
    api: PropTypes.object,
    proposal: PropTypes.object,
    user: PropTypes.object,
    forceRequest: PropTypes.func
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
    if (!valid.introduction) this.validateIntroduction(nextProps)
    if (!valid.contacts) this.validateContacts(nextProps)
    if (!valid.project) this.validateProject(nextProps)
    if (!valid.budget) this.validateBudget(nextProps)
    if (!valid.signatures) this.validateSignatures(nextProps)
  }

  validateIntroduction = (
    { proposal } = this.props,
    { valid } = this.state
  ) => {
    if (proposal) {
      const { title, category, organization } = proposal
      if (title && category && organization) valid.introduction = true
      this.setState({ valid })
    }
  }
  validateContacts = (
    { proposal } = this.props,
    { valid } = this.state
  ) => {
    if (proposal && proposal.contacts) {
      const { contacts } = proposal
      let requiredFields = 0
      for (const contact of contacts) {
        if (contact) {
          let { role, _id } = contact
          if (_id && (role === 'primary' || role === 'budget' || role === 'organization')) requiredFields++
        }
      }
      valid.contacts = requiredFields >= 3 || false
      this.setState({ valid })
    }
  }
  validateProject = (
    { proposal } = this.props,
    { valid } = this.state
  ) => {
    if (proposal && proposal.body) {
      const { body: { overview, plan } } = proposal
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
  }
  validateBudget = (
    { proposal } = this.props,
    { valid } = this.state
  ) => {
    if (proposal && proposal.manifests && proposal.manifests[0]) {
      const manifest = proposal.manifests[0]
      const { items, total } = manifest
      if (items && total) {
        valid.budget = Array.isArray(items) && items.length >= 1
        this.setState({ valid })
      }
    } else {
      //  FIXME: To address issues with budget updates
      valid.budget = proposal ? proposal.asked > 0 : false
      this.setState({ valid })
    }
  }
  validateSignatures = (
    { proposal } = this.props,
    { valid } = this.state
  ) => {
    if (proposal && proposal.contacts) {
      const { contacts } = proposal
      let requiredFields = 0
      for (const contact of contacts) {
        if (contact) {
          let { role, signature } = contact
          if (signature && role && (role === 'organization' || role === 'budget' || role === 'primary')) requiredFields++
        }
      }
      valid.signatures = requiredFields >= 3
      this.setState({ valid })
    }
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
    { router, forceRequest, proposal, user, submissions, date } = this.props,
    { valid } = this.state
  ) {
    const { introduction, contacts, project, budget, signatures } = valid
    const complete = Object.keys(valid)
      .every(key => valid[key] === true)
    //  Once proposals have loaded, redirect unaffiliated users.
    //  You can log out of Shib and push an update, but if you leave the page after that, it locks you out.
    var gracePeriodEnd = new Date(date)
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 7)
    if (user && proposal) this.redirectUnaffiliatedUsers()
    return (
      <article className={styles['page']}>
        <Helmet title='New Proposal' />
        {!proposal
          ? <Spin size='large' tip='Loading...' />
          : <div id={proposal._id}>
            <h1>{`Editing: ${proposal.title || 'New Proposal'}`}</h1>
            <Tooltip placement='topLeft'
              title={'Technical issues? E-mail STFCweb@uw.edu with your concern and draft ID'}
            >
              <h6>{`Draft ID: ${proposal._id}`}</h6>
            </Tooltip>
            {!submissions && <Alert type='warning' showIcon
              message='Submissions are closed'
              description='Unfortunately, the due date for proposal submissions has elapsed. However, we encourage you to continue working on your proposal and submitting it for the next quarterly cycle. Please reach out if you have any questions!'
            />}
            <Tabs tabPosition='top' defaultActiveKey='1'
              onChange={() => this.validateContacts(proposal)}
            >
              <TabPane key='1'
                tab={<span style={{ color: introduction ? colors.green : colors.gold }}>
                  <Icon type='file' />Introduction</span>
                }>
                <Introduction />
              </TabPane>
              <TabPane key='2'
                tab={<span style={{ color: contacts ? colors.green : colors.gold }}>
                  <Icon type='team' />Contacts</span>
                }>
                <Contacts />
              </TabPane>
              <TabPane key='3'
                tab={<span style={{ color: project ? colors.green : colors.gold }}>
                  <Icon type='book' />Project Plan</span>
                }>
                <ProjectPlan />
              </TabPane>
              <TabPane key='4'
                tab={<span style={{ color: budget ? colors.green : colors.gold }}>
                  <Icon type='wallet' />Budget</span>
                }>
                <Budget />
              </TabPane>
              <TabPane key='5'
                tab={<span style={{ color: signatures ? colors.green : colors.gold }}>
                  <Icon type='edit' />Signatures</span>
                }>
                <Signatures />
              </TabPane>
              <TabPane key='6' disabled={!complete}
                tab={<span><Icon type='rocket' />Publish !</span>}>
                <Publish />
              </TabPane>
            </Tabs>
          </div>
        }
      </article>
    )
  }
}

export default Edit
