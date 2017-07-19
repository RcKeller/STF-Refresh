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
  render ({ proposal, user } = this.props) {
    //  Once proposals have loaded, redirect unaffiliated users.
    //  You can remove your netID and push an update, but if you leave the page after that, it locks you out.
    proposal && redirectUnaffiliated(user, proposal.contacts)
    return (
      <article className={styles['page']}>
        {!proposal
          ? <Spin size='large' tip='Loading...' />
          : <div>
            <h1>{`Editing: ${proposal.title || 'New Proposal'}`}</h1>
            <h6>{`ID: ${proposal._id}`}</h6>
            <hr />
            <Tabs tabPosition='right' defaultActiveKey='1'>
              <TabPane key='1' tab={<span><Icon type='team' />Introduction</span>}>
                <Introduction />
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
              <p>Proposals can be published after all sections are completed and the appropriate contacts sign.</p>
            </Tabs>
          </div>
        }
      </article>
    )
  }
}
Edit.propTypes = {
  proposal: PropTypes.object,
  api: PropTypes.object
}
export default Edit
