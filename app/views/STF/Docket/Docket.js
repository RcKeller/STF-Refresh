import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import _ from 'lodash'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'
import { Loading } from '../../../components'
import { manifestsOnDocket, sortManifestsByProposal } from '../../../selectors'

import { Link } from 'react-router'
import { Table, Checkbox, Badge, Select, message } from 'antd'
const Option = Select.Option

//  At this scale, cents are triffling
const currency = number => `$${Number.parseInt(number).toLocaleString('en-US')}`

const years = _.range(
  2000,
  new Date().getFullYear() + 1
).reverse()

//  Status indicator mapping for badge components
const indicators = {
  'Submitted': 'default',
  'Funded': 'success',
  'Partially Funded': 'warning',
  'In Review': 'warning',
  'Awaiting Decision': 'warning',
  'Denied': 'error',
  'Draft': 'error',
  'Withdrawn': 'error'
}

/*
DOCKET PAGE:  .../docket/:year
Allows you to add budgets to /voting,
so the committee can review all relevant proposals
*/
import styles from './Docket.css'
@compose(
  connect(
    (state, props) => ({
      manifests: manifestsOnDocket(state),
      year: state.config.year,
      screen: state.screen
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
),
  connectRequest(props => api.get('manifests', {
    select: ['type', 'title', 'proposal', 'docket', 'decision', 'total'],
    populate: [
      { path: 'proposal', select: ['title', 'year', 'number', 'status', 'asked'] },
      { path: 'decision', select: ['approved'] }
    ],
    transform: docket => ({ docket }),
    update: ({ docket: (prev, next) => next })
  }))
)
class Docket extends React.Component {
  static propTypes = {
    api: PropTypes.object,
    manifests: PropTypes.array,
    year: PropTypes.number,
    screen: PropTypes.object
  }
  constructor (props) {
    super(props)
    const { year } = props
    this.state = { year }
    this.columns = [{
      title: 'ID',
      dataIndex: 'proposal.number',
      key: 'proposal.number',
      sorter: sortManifestsByProposal,
      filters: [
        { text: 'In Review', value: 'In Review' },
        { text: 'Funded', value: 'Funded' },
        { text: 'Partially Funded', value: 'Partially Funded' },
        { text: 'Denied', value: 'Denied' }
      ],
      onFilter: (value, record) => {
        const { proposal } = record
        return proposal && proposal.status.includes(value)
      },
      render: (text, record) => (
        <div id={record._id}>
          <span>{text ? `${record.proposal.year}-${record.proposal.number}` : 'N/A'}</span>
          <Badge status={indicators[record.proposal.status] || 'default'} text={record.proposal.status.toString()} />
        </div>
      ),
      width: 120
    }, {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Original Budget', value: 'original' },
        { text: 'Supplemental Request', value: 'supplemental' },
        { text: 'Partial / Alternates', value: 'partial' }
      ],
      onFilter: (value, record) => {
        const { type } = record
        return type.includes(value)
      },
      render: text => <span>{_.capitalize(text)}</span>,
      width: 80
    }, {
      title: 'Title',
      dataIndex: 'proposal.title',
      key: 'proposal.title',
      render: (text = 'Untitled Proposal', record) => {
        return (
          <div>
            <Link to={`/proposals/${record.proposal.year}/${record.proposal.number}`}>{text}</Link>
            {record.title && <span>
              <br />
              <em>{record.title}</em>
            </span>}
          </div>
        )
      }
    }, {
      title: 'Asked',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.total - b.total,
      render: (text, record) => {
        let percentage = Number.parseInt((text / record.proposal.asked) * 100)
        if (Number.isNaN(percentage)) percentage = 0
        // console.log(text, record.proposal.asked, percentage)
        return (
          <div>
            <span>{currency(text || 0)}</span>
            <br />
            <span>{percentage !== 100 && `${percentage}% of Original`}</span>
          </div>
        )
      },
      width: 120
    }, {
      title: 'Docket',
      dataIndex: 'docket',
      key: 'docket',
      render: (text, record, index) => (
        //  Only original proposals have metrics taken (otherwise it's redundant)
        <div>
          <Checkbox
            disabled={record.type !== 'original'}
            checked={text.metrics}
            onChange={e => this.handleToggle({ metrics: e.target.checked }, record, index)}
          >Metrics</Checkbox>
          <Checkbox
            checked={text.voting}
            onChange={e => this.handleToggle({ voting: e.target.checked }, record, index)}
          >Voting</Checkbox>
          <Checkbox
            checked={text.decisions}
            onChange={e => this.handleToggle({ decisions: e.target.checked }, record, index)}
          >Decisions</Checkbox>
        </div>
      ),
      filters: [
        { text: 'Metrics', value: 'metrics' },
        { text: 'Voting', value: 'voting' },
        { text: 'Decision', value: 'decisions' }
      ],
      onFilter: (value, record) => record.docket[value],
      width: 120
    }]
  }
  handleToggle = (change, record) => {
    //  Change is an object that can be easily assigned, like { docket: true } or { voting: false }
    //  We do this so we can accept a key/bool in one arg and use it in a one-liner, so we can share this toggle func.
    const { api } = this.props
    let { _id: id, docket } = record
    let body = { docket: Object.assign(docket, change) }
    //  Update the manifest at the correct index.
    const params = {
      id,
      // select: ['type', 'title', 'proposal', 'docket', 'decision', 'total'],
      // populate: [
      //   { path: 'proposal', select: ['title', 'year', 'number', 'status', 'asked'] },
      //   { path: 'decision', select: ['approved'] }
      // ],
      transform: docket => ({ docket }),
      update: { docket: (prev, next) => {
        let newData = prev.slice()
        let index = newData.findIndex(m => m._id === record._id)
        if (index >= 0) Object.assign(newData[index].docket, change)
        return newData
      }}
    }
    api.patch('manifest', body, params)
    .then(message.success('Docket updated!', 10))
    .catch(err => {
      message.warning(`Failed to update - client error`)
      console.warn(err)
    })
  }
  onSelectYear = (year) => { this.setState({ year }) }
  render (
    { columns, onSelectYear } = this,
    { params, manifests, screen } = this.props,
    { year } = this.state
  ) {
    const manifestsByFiscalYear = manifests.filter(m => m.proposal && m.proposal.year === year) || []
    const Test = (
      <Select defaultValue={this.props.year}
        style={{ width: '100%' }}
        onChange={onSelectYear}
      >
        {years.map(y => (
          <Option key={y} value={y}>{y}</Option>
        ))}
      </Select>
    )
    return (
      <article className={styles['article']}>
        <Helmet title='Docket' />
        <h1>Committee Docket</h1>
        <h6>Internal use only.</h6>
        <p>
          This page allows admins to control the availability of committee actions on proposals through the website. To make proposals available for metric submission or a committee vote, or to issue a final decision, use the switches below to update proposal status.
        </p>
        <h2>Fiscal Year:</h2>
        {Test}
        <Loading render={Array.isArray(manifests) && manifests.length > 0}
          title='Docket'
          tip={`Loading ${year} Docket...`}
        >
          <Table dataSource={manifestsByFiscalYear} sort
            size='title'
            columns={screen.lessThan.medium ? columns.filter(col => col.title !== 'Title') : columns}
            rowKey={record => record._id}
          />
        </Loading>
      </article>
    )
  }
}

export default Docket
