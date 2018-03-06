import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'
import _ from 'lodash'

import { Tabs, Tooltip, Button } from 'antd'
const TabPane = Tabs.TabPane

import api from '../../../services'
import { currency } from '../../../util'
import { Loading } from '../../../components'
import Panels from './Panels/Panels'

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
        <Loading render={Array.isArray(docket) && docket.length > 0}
          title='proposals on the docket'
          tip='Loading Proposals on the Docket...'
        >
          <Tabs size='small'
            tabPosition='left'
            tabBarExtraContent={
              <Button type='ghost' icon='reload' onClick={forceRequest}>
                Refresh
              </Button>
            }
          >
            {docket.map((manifest, i) => (
              <TabPane key={manifest._id} tab={
                manifest.proposal &&
                <Tooltip placement='rightTop' title={manifest.proposal.title}>
                  <div className={styles['tab-title']}>
                    <span>{`${manifest.proposal.year}-${manifest.proposal.number}`}</span>
                    <br />
                    {manifest.type !== 'original' &&
                      <small>
                        <span>{_.capitalize(manifest.type)}</span>
                        <br />
                        <span>{`for ${currency(manifest.total)}`}</span>
                      </small>
                    }
                  </div>
                </Tooltip>
              }>
                <Panels index={i} id={manifest._id} />
              </TabPane>
            ))}
          </Tabs>
        </Loading>
      </article>
    )
  }
}

export default Voting
