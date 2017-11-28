import React from 'react'
import PropTypes from 'prop-types'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import _ from 'lodash'

import api from '../../../../services'

import { Spin, Tabs, Button } from 'antd'
const TabPane = Tabs.TabPane

@compose(
  connect(state => ({
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
class Proposal extends React.Component {
  static propTypes = {
    proposal: PropTypes.string
  }
  render ({ proposal, manifests, reviews } = this.props) {
    //  Merge reviews into proposal.manifests
    manifests = manifests.map(m => ({ ...m, reviews: [] }))
    for (let r of reviews) {
      const index = manifests
        .findIndex(m => m._id === r.manifest)
      if (index >= 0) manifests[index].reviews.push(r)
    }
    console.warn('MANIFESTS', manifests)
    return (
      <section>
        <h1>Metrics and Reviews</h1>
        <h6>Internal use only.</h6>
        <Tabs>
          {manifests.map((m, i) => (
            <TabPane key={m._id} tab={<span>
              {`${_.capitalize(m.type || '')} Budget (#${++i})`}
              <br />
              {_.capitalize(m.title || 'Untitled')}
            </span>}
            >
              <div>
                <h1>{_.capitalize(m.title || 'Untitled Budget')}</h1>
                <span>{m._id}</span>
              </div>
            </TabPane>
          ))}
        </Tabs>
      </section>
    )
  }
}

export default Proposal
