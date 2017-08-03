import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'

import { Link } from 'react-router'
import { Spin, Table, Switch, message } from 'antd'

import styles from './Docket.css'

//  Our column config is split in two and combined in the constructor, since we need "this" component scope for callbacks.
const columnsWithoutScope = [
  {
    title: 'ID',
    dataIndex: 'number',
    key: 'number',
    sorter: (a, b) => (a.proposal.year * a.proposal.number) - (b.proposal.year * b.proposal.number),
    render: (text, record) => <Link to={`/proposals/${record.proposal.year}/${record.proposal.number}`}>{`${record.proposal.year}-${record.proposal.number}`}</Link>,
    width: 90
  },
  {
    title: 'Title',
    dataIndex: 'proposal.title',
    key: 'proposal.title',
    render: (text, record) => <Link to={`/proposals/${record.proposal.year}/${record.proposal.number}`}>{text}</Link>
  },
  {
    title: 'Motion',
    dataIndex: 'type',
    key: 'type',
    render: (text) => <span>{_.capitalize(text)}</span>,
    width: 120
  }
]

@compose(
  connect(
    state => ({
      manifests: state.db.manifests,
      screen: state.screen
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
),
  connectRequest(() => api.get('manifests', {

    //  BUG: Unpublished proposals can be pulled in docket creation.
    // where: { 'published': true },
    join: ['proposal']  //  Every manifest has a proposal, no need to check existence.
    //  TODO: Add docket: { metrics, voting } to manifest schema. No need to make a schema for voting only, it would only have two bools and a ref.
  }))
)
class Docket extends React.Component {
  constructor (props) {
    super(props)
    this.columns = columnsWithoutScope
    this.columns.push({
      title: 'Metrics',
      dataIndex: 'docket.metrics',
      key: 'docket.metrics',
      render: (text, record) => <Switch checked={text} onChange={(metrics) => this.handleToggleMetrics(metrics, record)} />,
      width: 75
    }, {
      title: 'Voting',
      dataIndex: 'docket.voting',
      key: 'docket.voting',
      render: (text, record) => <Switch checked={text} onChange={(voting) => this.handleToggleVoting(voting, record)} />,
      width: 75
    })
  }

  handleToggleMetrics = (metrics, record) => {
    const { api } = this.props
    const id = record._id
    console.log('TOGGLE METRICS', id, metrics)
    //  BUG: Failing. Perhaps it's because these aren't being  requested first?
    // console.log(api, id, metrics, record)
    // api.get('manifest', { id })
    // const update =
    // const docket = { docket: { metrics } }
    // console.log(id, docket)
    // const update = {  manifest: (prev, next) => prev }
    //TODO: Update store to reflect toggling.
    api.patch('manifest', { docket: { metrics } }, { id })
    .then(message.success((metrics
      ? `${_.capitalize(record.type)} is now up for metrics!`
      : `${_.capitalize(record.type)} was taken down from metrics!`
    ), 10))
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }

  handleToggleVoting = (voting, record) => {
    console.log('TOGGLE VOTING', voting, record)
  }
  render ({ manifests, screen } = this.props) {
    return (
      <article className={styles['article']}>
        {!manifests
          ? <Spin size='large' tip='Loading...' />
          : <Table dataSource={manifests} sort
            size={screen.lessThan.medium ? 'small' : ''}
            columns={this.columns}
            title={() => <div>
              <h1>Committee Docket</h1>
              <h6>Internal use only.</h6>
              <p>Add proposals, partials and supplementals to QA and voting dockets.</p>
            </div>}
          />
        }
      </article>
    )
  }
}
Docket.propTypes = {
  api: PropTypes.object,
  manifests: PropTypes.array,
  screen: PropTypes.object
}
export default Docket
