import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'
import { redirectUnaffiliated } from '../../../util/selectors'

import Introduction from './Introduction/Introduction'
import Contacts from './Contacts/Contacts'
import ProjectPlan from './ProjectPlan/ProjectPlan'
import Budget from './Budget/Budget'
import Signatures from './Signatures/Signatures'
import Publish from './Publish/Publish'

import { Icon, Spin, Tabs } from 'antd'
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
        body: false,
        manifest: false,
        signatures: false
      }
    }
  }
  /*
  If a section hasn't been validated, run validations as the server returns updated props (on tab change)
  Saving this in state allows us to stop redundant validation attempts.
  */
  componentWillReceiveProps (nextProps, nextState) {
    let { valid } = this.state
    const next = nextProps.proposal
    if (!valid.introduction) valid.introduction = this.validateIntroduction(next.title, next.category, next.organization)
    if (!valid.contacts) valid.contacts = this.validateContacts(next.contacts)
    if (!valid.body) valid.body = this.validateBody(next.body)
    if (!valid.manifest) valid.manifest = this.validateManifest(next.manifests[0])
    if (!valid.signatures) valid.signatures = this.validateSignatures(next.contacts)
    this.setState({ valid })
    console.log('VALID', valid)
  }
  validateIntroduction = (title, category, organization) => {
    return (title && category && organization) ? true : false // eslint-disable-line
  }
  validateContacts = (contacts) => {
    let valid = 0
    for (const { role } of contacts) {
      if (role === 'organization' || role === 'budget' || role === 'primary') valid++
    }
    return valid >= 3
  }
  validateBody = ({ overview, plan } = {}) => {
    let valid = 0
    //  Overview is valid if three prompts as well as the three impact types are filled
    if (overview) {
      const { abstract, justification, objectives, impact } = overview
      if (abstract && justification && objectives) valid++
      if (impact && Object.keys(impact).length >= 3) valid++
    }
    //  Project plan is valid if each of the 5 valid subcategories has a current and future state.
    if (plan) {
      let validCategories = 0
      for (const key of Object.keys(plan)) {
        if (plan[key] && plan[key].current && plan[key].future) validCategories++
      }
      if (validCategories >= 5) valid++
    }
    return valid >= 3
  }
  validateManifest = ({ items } = {}) => {
    //  Keeping the validation simple here due to anticipated future enhancement of server side pre/post processing.
    return Array.isArray(items) && items.length >= 1
  }
  validateSignatures = (contacts) => {
    let valid = 0
    for (const { role, signature } of contacts) {
      if (role === 'organization' || role === 'budget' || role === 'primary') {
        if (signature) valid++
      }
    }
    return valid >= 3
  }
  render (
    { forceRequest, proposal, user } = this.props,
    { valid } = this.state
  ) {
    const { introduction, contacts, body, manifest, signatures } = valid
    const complete = Object.keys(valid).every(k => valid[k] === true)
    //  Once proposals have loaded, redirect unaffiliated users.
    //  You can remove your netID and push an update, but if you leave the page after that, it locks you out.
    // proposal && proposal.contacts && redirectUnaffiliated(user, proposal.contacts)
    //  forceRequest is bound by redux-query and run on tab changes.
    //  This ensures all fields populate() completely and changes reflect other subsections (contact changes update sigs, etc)
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
                <Contacts />
              </TabPane>
              <TabPane key='3'
                tab={<span style={{ color: body ? colors.green : colors.gold }}>
                  <Icon type='book' />Project Plan</span>
                }>
                <ProjectPlan />
              </TabPane>
              <TabPane key='4'
                tab={<span style={{ color: manifest ? colors.green : colors.gold }}>
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
            {!complete && <em>Once all sections are complete (indicated by the tab turning green), the publish option will appear.</em>}
          </div>
        }
      </article>
    )
  }
}

export default Edit
