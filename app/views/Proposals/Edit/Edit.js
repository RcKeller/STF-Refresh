import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'
import { redirectUnaffiliated } from '../../../util/selectors'

import Introduction from './Introduction/Introduction'
import Contacts from './Contacts/Contacts'
import ProposalBody from './ProposalBody/ProposalBody'
import Manifest from './Manifest/Manifest'
import Signatures from './Signatures/Signatures'

import { Icon, Spin, Tabs } from 'antd'
const TabPane = Tabs.TabPane

import styles from './Edit.css'
@compose(
  connect(state => ({
    //  Loads async, don't use specific selectors.
    proposal: state.db.proposal,
    user: state.user
  })),
  connectRequest(props => api.get('proposal', {
    id: props.params.id,
    join: ['contacts', 'body', 'manifests']
  }))
)
class Edit extends React.Component {
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
  validateIntroduction = (...args) => {
    //  Valid if  all args have content.
    let validFields = args.filter((a) => a.length >= 0)
    return validFields.length === args.length
  }
  validateContacts = (contacts) => true
  validateBody = () => true
  validateManifest = () => true
  validateSignatures = () => true
  render ({ forceRequest, proposal, user } = this.props) {
    //  Once proposals have loaded, redirect unaffiliated users.
    //  You can remove your netID and push an update, but if you leave the page after that, it locks you out.
    // proposal && proposal.contacts && redirectUnaffiliated(user, proposal.contacts)
    //  forceRequest is bound by redux-query and run on tab changes.
    //  This ensures all fields populate() completely and changes reflect other subsections (contact changes update sigs, etc)
    return (
      <article className={styles['page']}>
        {!proposal
          ? <Spin size='large' tip='Loading...' />
          : <div>
            <h1>{`Editing: ${proposal.title || 'New Proposal'}`}</h1>
            <h6>{`ID: ${proposal._id}`}</h6>
            <hr />
            <Tabs tabPosition='right' defaultActiveKey='1'
              onChange={forceRequest}
            >
              <TabPane key='1' tab={<span><Icon type='team' />Introduction</span>}>
                <Introduction validate={this.validateIntroduction} />
              </TabPane>
              <TabPane key='2' tab={<span><Icon type='team' />Contacts</span>}>
                <Contacts />
              </TabPane>
              <TabPane key='3' tab={<span><Icon type='book' />Proposal Body</span>}>
                <ProposalBody />
              </TabPane>
              <TabPane key='4' tab={<span><Icon type='wallet' />Manifest</span>}>
                <Manifest />
              </TabPane>
              <TabPane key='5' tab={<span><Icon type='edit' />Signatures</span>}>
                <Signatures />
              </TabPane>
            </Tabs>
          </div>
        }
      </article>
    )
  }
}
Edit.propTypes = {
  api: PropTypes.object,
  proposal: PropTypes.object,
  user: PropTypes.object
}
export default Edit
