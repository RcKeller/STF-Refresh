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
    this.columns = [{
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
    },
    {
      title: 'Metrics',
      dataIndex: 'docket.metrics',
      key: 'docket.metrics',
      // render: (text, record, index) => <Switch checked={this.props.manifests[index].docket.metrics || false} onChange={(metrics) => this.handleToggleMetrics(metrics, record, index)} />,
      render: (text, record, index) =>
      record.type === 'original'  //  Supplementals don't go through metrics reviews
        ? <Switch checked={text} onChange={(metrics) => this.handleToggleMetrics(metrics, record, index)} />
        : <em>N/A</em>,
      width: 75
    }, {
      title: 'Voting',
      dataIndex: 'docket.voting',
      key: 'docket.voting',
      render: (text, record, index) => <Switch checked={text} onChange={(voting) => this.handleToggleVoting(voting, record, index)} />,
      width: 75
    }]
  }

  handleToggleMetrics = (metrics, record, index) => {
    const { api } = this.props
    const id = record._id
    //  Update the manifest at the correct index.
    const update = { manifests: (prev, next) => {
      let newData = prev.slice()
      newData[index].docket.metrics = metrics
      return newData
    }}
    api.patch('manifest', { docket: { metrics } }, { id, update })
    .then(message.success((metrics
      ? `${_.capitalize(record.type)} is now up for metrics!`
      : `${_.capitalize(record.type)} was taken down from metrics!`
    ), 10))
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }

  handleToggleVoting = (voting, record, index) => {
    const { api } = this.props
    const id = record._id
    //  Update the manifest at the correct index.
    const update = { manifests: (prev, next) => {
      let newData = prev.slice()
      newData[index].docket.voting = voting
      return newData
    }}
    api.patch('manifest', { docket: { voting } }, { id, update })
    .then(message.success((voting
      ? `${_.capitalize(record.type)} is now up for voting!`
      : `${_.capitalize(record.type)} was taken down from voting!`
    ), 10))
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }
  render (
    { columns } = this,
    { manifests, screen } = this.props
  ) {
    return (
      <article className={styles['article']}>
        <h1>Committee Docket</h1>
        <h6>Internal use only.</h6>
        <p>Add proposals, partials and supplementals to QA and voting dockets.</p>
        {!manifests
          ? <Spin size='large' tip='Loading...' />
          : <Table dataSource={manifests} sort
            size={screen.lessThan.medium ? 'small' : ''}
            columns={screen.lessThan.medium ? columns.filter(col => col.title !== 'Title') : columns}
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
