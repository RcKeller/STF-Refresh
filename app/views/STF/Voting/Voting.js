import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import _ from 'lodash'

import api from '../../../services'
// import { manifestsOnDocket } from '../../../selectors'

import { Spin, Tabs, Button, Tooltip } from 'antd'
const TabPane = Tabs.TabPane

import Panels from './Panels/Panels'

// ${manifest.type !== 'original' ? `(${manifest.type[0].toUpperCase()})` : ''}
const manifestType = (type) => {
  switch (type) {
    case 'original':
      return _.capitalize(type)
    case 'partial':
      return _.capitalize(type)
    case 'supplemental':
      return _.capitalize(type)
  }
  return null
}

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
      { path: 'proposal', populate: { path: 'body' } },
      { path: 'proposal', populate: { path: 'endorsements' } }
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
