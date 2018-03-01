//  React and its typechecking
import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
//  Redux utils
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'
//  Our API services
import api from '../../../../services'
import { Loading } from '../../../../components'

import { Link } from 'react-router'
import { Table, Progress, Input, Icon } from 'antd'

//  At this scale, cents are triffling
const currency = number => `$${Number.parseInt(number).toLocaleString('en-US')}`

  //  Create an array of years for select boxes
const years = _.range(
  2000,
  new Date().getFullYear() + 1
)

/*
SUPPLEMENTALS FEATURE:
Summary of all supplemental requests
Useful for operations / Proposal Officer
*/
@compose(
  connect((state, props) => ({
    supplementals: state.db.supplementals,
    enums: state.config.enums,
    screen: state.screen,
    user: state.user
  })),
  connectRequest(
    () => api.get('manifests', {
      query: { type: 'supplemental' },
      populate: [
        'items',
        { path: 'proposal', populate: { path: 'contacts' } }
      ],
      transform: supplementals => ({ supplementals }),
      update: ({ supplementals: (prev, next) => next }),
      force: true
    })
  )
)
class Budgeting extends React.Component {
  static propTypes = {
    supplementals: PropTypes.array,
    screen: PropTypes.object,
    user: PropTypes.object
  }
  static defaultProps = {
    supplementals: [],
    screen: {},
    user: {}
  }
  constructor (props) {
    super(props)
    const { supplementals } = this.props
    this.state = {
      supplementals,
      filterDropdownVisible: false,
      searchText: '',
      filtered: false
    }
  }
  componentWillReceiveProps (nextProps) {
    const { supplementals } = nextProps
    if (supplementals) this.setState({ supplementals })
  }

  onInputChange = searchText => this.setState({ searchText })
  onSearch = () => {
    const { searchText } = this.state
    const { supplementals } = this.props
    const reg = new RegExp(searchText, 'gi')
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      supplementals: supplementals
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
  render (
    { enums, screen } = this.props,
    { supplementals } = this.state
  ) {
    const columns = [
      {
        title: 'Submitted',
        dataIndex: 'date',
        key: 'date',
        width: 120,
        render: (text) => new Date(text).toLocaleDateString(),
        sorter: (a, b) => Date.parse(a.date) - Date.parse(b.date)
      }, {
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
        width: 80
      }, {
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
        width: 60
      }, {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => (
          <span>
            <h6>{text}</h6>
            <i><Link to={`/proposals/${record.proposal.year}/${record.proposal.number}`}>
              {record.proposal.title}
            </Link></i>
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
      }, {
        title: 'Awarded',
        dataIndex: 'proposal.received',
        key: 'proposal.received',
        render: (text, record) => currency(text),
        width: 120,
        sorter: (a, b) => a.proposal.received - b.proposal.received
      }, {
        title: 'Requested',
        dataIndex: 'total',
        key: 'total',
        render: (text, record) => currency(text),
        width: 120,
        sorter: (a, b) => a.total - b.total
      }, {
        title: '% of Original',
        dataIndex: 'total',
        key: '_',
        width: 120,
        render: (text, record) => {
          let percentage = Number.parseInt(record.total / record.proposal.received * 100)
          if (Number.isNaN(percentage)) percentage = 0
          // else if (percentage > 100) percentage = 100
          let status = 'active'
          if (percentage > 20) status = 'success'
          if (percentage > 100) status = 'exception'
          return (
            <Progress
              percent={percentage <= 100 ? percentage : 100}
              format={() => `${percentage}${percentage < 100 ? '%' : ''}`}
              status={status}
              strokeWidth={10}
            />
          )
        }
      }
    ]
    return (
      <section>
        <Loading render={Array.isArray(supplementals) && supplementals.length > 0}
          title='Suppplementals'
          tip='Loading Supplemental Requests...'
        >
          <Table
            dataSource={supplementals}
            sort
            size={screen.lessThan.medium ? 'small' : 'middle'}
            columns={columns}
            rowKey={record => record._id}
          />
        </Loading>
      </section>
    )
  }
}
export default Budgeting
