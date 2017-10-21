import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import _ from 'lodash'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'
import { manifestsOnDocket } from '../../../selectors'

import { Spin, Tabs, Alert, Button, Tooltip } from 'antd'
const TabPane = Tabs.TabPane

import Panels from './Panels/Panels'

import styles from './Voting.css'
@compose(
  connect(
    state => ({
      docket: manifestsOnDocket(state)
      // docket: Array.isArray(state.db.manifests)
      //   ? state.db.manifests
      //     .filter(budget => {
      //       let { docket } = budget
      //       if (docket) return docket.metrics || docket.voting || docket.decisions
      //     })
      //   : []
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
),
  connectRequest(() => api.get('manifests', {
    populate: [
      'items',
      'reviews',
      'decision',
      { path: 'proposal', populate: { path: 'body' } },
      { path: 'proposal', populate: { path: 'contacts' } }
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
      <article className={styles['tabbed-article']}>
        <Helmet title='Voting' />
        {!docket
          ? <Spin size='large' tip='Loading...' />
          : <Tabs type='mini' tabPosition='left'
            // tabBarExtraContent={<Button type='ghost' icon='reload' onClick={forceRequest}>Refresh</Button>}
            >
            <TabPane tab='Overview' key='1' className={styles['tab-pane']}>
              <h1>Reviews & Voting</h1>
              <p>Instructions here.</p>
              <Alert type='info' banner showIcon={false}
                message='Major Changes for Ex-Officios'
                description='Permissions have been expanded to allow Ex-Officios to review proposals, sans final voting. Officios also have read access to more content in general. We are grateful for their involvement and want the web platform to reflect that.'
              />
            </TabPane>
            {docket.map((manifest, i) => (
              <TabPane key={manifest._id} className={styles['tab-pane']}
                tab={
                  <Tooltip placement='bottom' title={manifest.proposal.title}>{`
                    ${manifest.proposal.year}-${manifest.proposal.number}
                    ${manifest.type !== 'original' ? `(${manifest.type[0].toUpperCase()})` : ''}
                  `}
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
