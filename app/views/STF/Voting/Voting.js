import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'

import { Spin, Tabs } from 'antd'
const TabPane = Tabs.TabPane

import Vote from './Vote/Vote'

import styles from './Voting.css'
// @connect(state => ({ user: state.user }))
@compose(
  connect(
    state => ({ manifests: state.db.manifests }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
),
  connectRequest(() => api.get('manifests', {
    //  BUG: Unpublished proposals can be pulled in docket creation.
    force: true,
    join: ['proposal.body']
  }))
)
class Voting extends React.Component {
  constructor (props) {
    super(props)
    this.state = { docket: [] }
  }
  componentWillReceiveProps (nextProps) {
    //  Check our manifests to see if they're on the docket
    const { manifests } = nextProps
    if (Array.isArray(manifests)) {
      //  Filter out proposals containing the netID in contacts.
      const docket = manifests.filter(manifest => {
        return manifest.docket.metrics || manifest.docket.voting
      })
      this.setState({ docket })
    }
  }
  render (
    { user, manifests } = this.props,
    { docket } = this.state
  ) {
    return (
      <article className={styles['article']}>
        <h1>Reviews & Voting</h1>
        {!docket
          ? <Spin size='large' tip='Loading...' />
          : (docket.length >= 1
            ? <Tabs tabPosition='left'>
              {docket.map((manifest, i) => (
                <TabPane key={i} tab={
                  manifest.type !== 'original'
                    ? <span>
                      {_.capitalize(manifest.type)}
                      <br />
                      {manifest.proposal.year}-{manifest.proposal.number}
                    </span>
                    : `${manifest.proposal.year}-${manifest.proposal.number}`
                }
                >
                  <Vote index={i} />
                </TabPane>
              ))}
            </Tabs>
            : <p><em>Nothing is on the docket.</em></p>
          )
        }
      </article>
    )
  }
}
Voting.propTypes = {
  manifests: PropTypes.array
}
export default Voting
