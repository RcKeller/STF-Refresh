//  React and its typechecking
import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import _ from 'lodash'
//  Redux utils
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'
//  Our API services
import api from '../../../services'

import { Link } from 'react-router'
import {
  Spin,
  Table,
  Progress,
  Badge,
  Input,
  Button,
  Icon
} from 'antd'

import SubTable from './SubTable/SubTable'

//  Status indicator mapping for badge components
const indicators = {
  'In Review': 'default',
  'Fully Funded': 'success',
  'Partially Funded': 'success',
  'Revisions Requested': 'warning',
  Denied: 'error'
}
const currency = number =>
  number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  })

const expandedRowRender = (record, i) => <SubTable
  contacts={record.proposal && record.proposal.contacts}
  manifest={record.manifest}
  report={record.manifest && record.manifest.report}
/>

//  Import modular CSS. Needs to run through JS because styles are hashed.
import styles from './Dashboard.css'
//  This is a decorator, a function that wraps another class (which in JS is essentially a func)
@compose(
  connect((state, props) => ({
    awards: state.db.decisions,
    enums: state.db.config && state.db.config.enums,
    screen: state.screen,
    user: state.user
  })),
  connectRequest(
    () => api.get('decisions', {
      where: { approved: true },
      join: ['manifest.report', 'proposal.contacts']
    })
  )
)
class Dashboard extends React.Component {
  static propTypes = {
    awards: PropTypes.array,
    screen: PropTypes.object,
    user: PropTypes.object
  }
  constructor (props) {
    super(props)
    const { awards } = this.props
    this.state = {
      awards,
      filterDropdownVisible: false,
      searchText: '',
      filtered: false
    }
  }
  componentWillReceiveProps (nextProps) {
    const { awards } = nextProps
    if (awards) this.setState({ awards })
  }

  onInputChange = searchText => this.setState({ searchText })
  onSearch = () => {
    const { searchText } = this.state
    const { awards } = this.props
    const reg = new RegExp(searchText, 'gi')
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      awards: awards
        .map(record => {
          const match = record.proposal.title.match(reg)
          if (!match) return null
          return {
            ...record,
            title: (
              <span>
                {record.proposal.title
                  .split(reg).map((text, i) => i > 0
                      ? [(<span className='highlight'>{match[0]}</span>), text]
                      : text
                  )}
              </span>
            )
          }
        })
        .filter(record => !!record)
    })
  }
  //  Shorthand assignment of variables when defining render
  render (
    { enums, screen } = this.props,
    //  Proposals go through state since we filter
    { awards } = this.state
  ) {
    //  Create an array of years for select boxes
    const years = _.range(
      2000,
      new Date().getFullYear() + 1
    )
    //  Columns are defined in render because they have many data dependencies.
    // const due = (date) => {
    //   let localDate = new Date(date)
    //   //  Date is in the future, display due date.
    //   return Date.now() - localDate.getTime()
    //     ? localDate.toLocaleDateString('en-US', { timeZone: 'UTC' })
    //     : ''
    // }
    const columns = [
      {
        title: 'ID',
        dataIndex: 'proposal.number',
        key: 'proposal.number',
        render: (text, record) => (
          <span>{`${record.proposal.year}-${record.proposal.number}`}</span>
        ),
        sorter: (a, b) =>
          a.proposal.year * a.proposal.number - b.proposal.year * b.proposal.number,
        filters: years.map((year, i) => {
          return { text: year, value: year }
        }),
        onFilter: (value, record) =>
          record.proposal.year.toString().includes(value),
        width: 90
      },
      {
        title: 'Q',
        dataIndex: 'proposal.quarter',
        key: 'quarter',
        render: text => <span>{text.substr(0, 2) || ''}</span>,
        filters: [
          { text: 'Autumn', value: 'Autumn' },
          { text: 'Fall', value: 'Fall' },
          { text: 'Spring', value: 'Spring' },
          { text: 'Summer', value: 'Summer' }
        ],
        onFilter: (value, record) => record.proposal.quarter.includes(value),
        width: 50
      },
      {
        title: 'Title',
        dataIndex: 'proposal.title',
        key: 'proposal.title',
        render: (text, record) => (
          <span>
            <Link to={`/proposals/${record.proposal.year}/${record.proposal.number}`}>
              <b>{`${_.capitalize(record.manifest.type)}: `}</b>
              <span>{record.proposal.title}</span>
            </Link>
            <br />
            <em>{record.proposal.category}</em>
          </span>
        ),
        filterDropdown: (
          <Input
            ref={ele => this.searchInput = ele}
            placeholder='Search title'
            value={this.state.searchText}
            onChange={(e) => this.onInputChange(e.target.value)}
            onPressEnter={this.onSearch}
          />
        ),
        filterIcon: <Icon type='search' style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible: this.state.filterDropdownVisible,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            { filterDropdownVisible: visible },
            () => this.searchInput.focus()
          )
        }
      },
      {
        title: 'Organization',
        dataIndex: 'proposal.organization',
        key: 'proposal.organization',
        render: (text, record) => (
          <span>
            {text}
            <br />
            <em>{record.proposal.budget}</em>
          </span>
        ),
        filters: enums
          ? Object.keys(enums.organizations).map(org => {
            return { text: org, value: org }
          })
          : [],
        onFilter: (value, record) => record.proposal.organization === value
      },
      {
        title: 'Category',
        dataIndex: 'proposal.category',
        key: 'proposal.category',
        filters: enums
          ? enums.categories.map(category => {
            return { text: category, value: category }
          })
          : [],
        onFilter: (value, record) => record.proposal.category === value,
        width: 150
      },
      {
        title: 'Awarded',
        dataIndex: 'proposal.received',
        key: 'proposal.received',
        // render: text => <span>{text ? currency(text) : '0'}</span>,
        render: (text, record) => (
          <span>
            {text ? currency(text) : '$0'}
            <br />
            <Badge status={indicators[record.proposal.status] || 'default'} text={record.proposal.status} />
          </span>
        ),
        sorter: (a, b) => a.proposal.received - b.proposal.received,
        filters: enums
          ? enums.statuses.map(status => {
            return { text: status, value: status }
          })
          : [],
        onFilter: (value, record) => record.proposal.status === value
      },
      {
        title: 'Budget #',
        dataIndex: 'manifest.report.budget',
        key: 'manifest.report.budget'
      }, {
        title: 'Report / Due',
        dataIndex: 'manifest.report.due',
        key: 'manifest.report.due',
        // render: text => <span>{text ? currency(text) : '0'}</span>,
        render: (text, record) => (
          <span>
            {text
              ? new Date(text)
                .toLocaleDateString('en-US', { timeZone: 'UTC' })
              : 'N/A'
            }
          </span>
        ),
        sorter: (a, b) => a.report.due - b.report.due
      }
    ]
    return (
      <article className={styles['article']}>
        <h1>Budgeting Dashboard</h1>
        <Helmet title='Dashboard' />
        {!awards
            ? <Spin size='large' tip='Loading...' />
            : <Table
              dataSource={awards}
              sort
              size={screen.lessThan.medium ? 'small' : 'middle'}
              columns={columns}
              rowKey={record => record._id}
              expandedRowRender={expandedRowRender}
            />
            }
      </article>
    )
  }
}
export default Dashboard
