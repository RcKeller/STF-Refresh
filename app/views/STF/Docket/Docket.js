import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'

import { Link } from 'react-router'
import { Spin, Table, Switch } from 'antd'

import styles from './Docket.css'

const columns = [
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
    this.columns = columns
    this.columns.push({
      title: 'Metrics',
      dataIndex: 'docket.metrics',
      key: 'docket.metrics',
      render: (text) => <Switch checked={text} onChange={this.handleToggleMetrics} />,
      width: 75
    }, {
      title: 'Voting',
      dataIndex: 'docket.voting',
      key: 'docket.voting',
      render: (text) => <Switch checked={text} onChange={this.handleToggleVoting} />,
      width: 75
    })
  }

  handleToggleMetrics = (value) => {
    console.log('TOGGLE METRICS', value)
  }
  handleToggleVoting = (value) => {
    console.log('TOGGLE VOTING', value)
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
  manifests: PropTypes.array,
  screen: PropTypes.object
}
export default Docket
