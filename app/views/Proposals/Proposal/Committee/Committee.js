import React from 'react'
import PropTypes from 'prop-types'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import _ from 'lodash'

import api from '../../../../services'

import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

import Decision from './Decision/Decision'

const currency = value => `$${Number.parseInt(value).toLocaleString()}`

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
class Committee extends React.Component {
  static propTypes = {
    proposal: PropTypes.string
  }
  render ({ asked, manifests, reviews } = this.props) {
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
              <Decision {...m} asked={asked} />
            </TabPane>
          ))}
        </Tabs>
      </section>
    )
  }
}

export default Committee
