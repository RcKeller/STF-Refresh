import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import _ from 'lodash'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'

import { Spin, Tabs, Button } from 'antd'
const TabPane = Tabs.TabPane

//  Public view
import View from './View/View'

import Endorsements from './Endorsements/Endorsements'
//  Contact view
import Budgeting from './Budgeting/Budgeting'
import NextSteps from './NextSteps/NextSteps'
import Update from './Update/Update'
//  STF Memeber and admin views
import Reviews from './Reviews/Reviews'
import Settings from './Settings/Settings'

import styles from './Proposal.css'
/*
NOTE: Bugs can be encountered when users navigate from proposals to /edit
It's caused by data mismatches in the cached store nodes.
Added a check for publication status that tests truthiness, preventing errors.
connectRequest will force a query if there's a mismatch.
*/
@compose(
  connect(state => ({
    id: state.db.proposal && state.db.proposal._id,
    title: state.db.proposal && state.db.proposal.title,
    published: state.db.proposal && state.db.proposal.published,
    contacts: state.db.proposal && state.db.proposal.contacts,
    author:
      state.user && state.user.netID &&
      state.db.proposal && Array.isArray(state.db.proposal.contacts)
        ? _.find(state.db.proposal.contacts, { netID: state.user.netID })
        : false,
    user: state.user
  })),
  connectRequest(props => api.get('proposal', {
    force: true,
    where: {
      year: props.params.year,
      number: props.params.number
    },
    // Proposal reporting, metrics and decisions are tied to manifests, which are individual "asks"
    join: [
      'contacts', 'body', 'comments',
      'manifests.report', 'manifests.reviews', 'manifests.decision'
    ]
  }))
)
class Proposal extends React.Component {
  static propTypes = {
    proposal: PropTypes.object
  }
  render ({ proposal, id, title, published, user, author, forceRequest } = this.props) {
    const stf = user && user.stf
    const admin = stf && stf.admin
    return (
      <article className={styles['tabbed-article']} >
        <Helmet title={title || 'Proposal'} />
        {!id
          ? <Spin size='large' tip='Loading...' />
          : <Tabs className='tab-container' type='card'
            tabBarExtraContent={
              <Button type='ghost' icon='reload' onClick={forceRequest}>
                Refresh
              </Button>
            }
            >
            <TabPane tab='Proposal' key='1' className={styles['tab-pane']}>
              <View />
            </TabPane>
            <TabPane tab='Endorsements' key='2' className={styles['tab-pane']}>
              <Endorsements />
            </TabPane>
            {(author || admin) &&
              <TabPane tab='Budgeting' key='3' className={styles['tab-pane']}>
                <Budgeting />
              </TabPane>
            }
            {(author || admin) &&
              <TabPane tab='Contact Info' key='4' className={styles['tab-pane']}>
                <Update />
              </TabPane>
            }
            {(author || stf) &&
              <TabPane tab='Next Steps' key='5' className={styles['tab-pane']}>
                <NextSteps />
              </TabPane>
            }
            {/* FIXME: This component is failing w/ actual data */}
            {/* {stf &&
              <TabPane disabled tab={<span>Reviews (<em>STF-Only</em>)</span>} key='6' className={styles['tab-pane']}>
                <Reviews />
              </TabPane>
            } */}
            {admin &&
              <TabPane tab={<span>Settings (<em>Admin-Only</em>)</span>} key='7' className={styles['tab-pane']}>
                <Settings />
              </TabPane>
            }
          </Tabs>
        }
      </article>
    )
  }
}

export default Proposal
