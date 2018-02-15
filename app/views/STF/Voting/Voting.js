import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'
import _ from 'lodash'

import { Spin, Tabs, Tooltip } from 'antd'
const TabPane = Tabs.TabPane

import api from '../../../services'

import Panels from './Panels/Panels'

// const manifestType = (type) => {
//   switch (type) {
//     case 'original':
//       return _.capitalize(type)
//     case 'partial':
//       return _.capitalize(type)
//     case 'supplemental':
//       return _.capitalize(type)
//   }
//   return null
// }

/*
VOTING VIEW:
Renders a collection of manifests (not proposals!)
to vote on at meetings
*/
import styles from './Voting.css'
@compose(
  connect(
    state => ({ docket: state.db.manifests || [] }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
),
  connectRequest(() => api.get('manifests', {
    query: {
      //  NOTE: I found out by trial/error that mongo will allow or conditions with dot notation.
      //  https://docs.mongodb.com/manual/reference/operator/query/or/
      $or: [
        { 'docket.metrics': true },
        { 'docket.voting': true },
        { 'docket.decisions': true }
      ]
    },
    populate: [
      'items',
      'decision',
      { path: 'reviews', populate: { path: 'author', populate: ['stf'] } },
      { path: 'proposal', populate: ['contacts', 'body'] },
      { path: 'proposal', populate: { path: 'comments', populate: ['user'] } }
    ],
    force: true
  }))
)
class Voting extends React.Component {
  static propTypes = {
    docket: PropTypes.array
  }
  render (
    { user, docket, forceRequest } = this.props
  ) {
    return (
      <article className={styles['article']}>
        <Helmet title='Voting' />
        {!docket
          ? <Spin size='large' tip='Loading...' />
          : <Tabs size='small' tabPosition='left'>
            {docket.map((manifest, i) => (
              // <TabPane key={manifest._id} tab={
              //   <span>{manifest.proposal.title}</span>
              // }>
              <TabPane key={manifest._id} tab={
                <Tooltip placement='rightTop' title={manifest.proposal.title}>
                  <div className={styles['tab-title']}>
                    <span>{`${manifest.proposal.year}-${manifest.proposal.number}`}</span>
                    <br />
                    {manifest.type !== 'original' && <small>{_.capitalize(manifest.type)}</small>}
                  </div>
                </Tooltip>
              }>
                <Panels index={i} id={manifest._id} />
              </TabPane>
            ))}
          </Tabs>
        }
      </article>
    )
  }
}

export default Voting
