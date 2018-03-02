import React from 'react'
import PropTypes from 'prop-types'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import _ from 'lodash'

import api from '../../../../services'
import { Loading } from '../../../../components'

import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

import Decision from './Decision/Decision'

const currency = value => `$${Number.parseInt(value).toLocaleString()}`
/*
DECISIONS TAB:
Allows users to see the decisions issued on a proposal's budgets
(note: proposals have many budgets! hence the second tab layer)
Admins are allowed to see metrics (comments and score breakdowns)
in addition to decisions.
*/
@compose(
  connect(state => ({
    asked: state.db.proposal.asked,
    manifests: state.db.proposal ? state.db.proposal.manifests : [],
    reviews: state.db.reviews || [],
    user: state.user
  })),
  connectRequest(props => api.get('reviews', {
    force: true,
    query: { proposal: props.proposal },
    // select: ['author', 'date', 'ratings', 'score', 'approved'],
    populate: ['author']
  }))
)
class Decisions extends React.Component {
  static propTypes = {
    proposal: PropTypes.string
  }
  render ({ asked, manifests, reviews, user } = this.props) {
    //  Merge reviews into proposal.manifests
    manifests = manifests.map(m => ({ ...m, reviews: [] }))
    if (Array.isArray(reviews)) {
      for (let r of reviews) {
        const index = manifests
        .findIndex(m => m._id === r.manifest)
        if (index >= 0) manifests[index].reviews.push(r)
      }
    }
    return (
      <section>
        <Loading render={manifests}
          title={`Proposal Reviews`}
          tip={`Loading Reviews and Decisions...`}
        >
          <Tabs>
            {manifests.map((m, i) => (
              <TabPane key={m._id} tab={<span>
                {`${_.capitalize(m.type || '')} Budget (#${++i})`}
                <br />
                {_.capitalize(m.title || 'Untitled')}
                <br />
                {`${currency(m.total)} (${parseInt(m.total / asked * 100)}%)`}
              </span>}
              >
                <Decision {...m} asked={asked} user={user} />
              </TabPane>
            ))}
          </Tabs>
        </Loading>
      </section>
    )
  }
}

export default Decisions
