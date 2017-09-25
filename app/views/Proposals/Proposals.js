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
import api from '../../services'

import { Link } from 'react-router'
import { Spin, Table, Progress, Badge, Input, Icon } from 'antd'

//  Status indicator mapping for badge components
const indicators = {
  'Submitted': 'default',
  'Funded': 'success',
  'Partially Funded': 'success',
  'In Review': 'warning',
  'Awaiting Decision': 'warning',
  'Denied': 'error',
  'Draft': 'error',
  'Withdrawn': 'error'
}
//  At this scale, cents are triffling
const currency = number => `$${Number.parseInt(number).toLocaleString('en-US')}`

//  Import modular CSS. Needs to run through JS because styles are hashed.
import styles from './Proposals.css'
//  This is a decorator, a function that wraps another class (which in JS is essentially a func)
import { publishedProposals, myProposals, myDrafts } from '../../selectors'
@compose(
  connect((state, props) => ({
    proposals: publishedProposals(state),
    myProposals: myProposals(state),
    myDrafts: myDrafts(state),
    enums: state.config && state.config.enums,
    screen: state.screen,
    user: state.user
  })),
  //  If not logged in, query for only published proposals (performance)
  connectRequest(({user}) =>
      user._id
        ? api.get('proposals', { join: [ 'contacts' ] })
        : api.get('proposals', { where: { published: true }, join: [ 'contacts' ] })
  )
)
class // Compose is a redux utility that runs an array of functions:
//  Connect component to cached DB entities
//  Execute necessary AJAX to load said entities
// where: { published: true }
// connectRequest((props) => api.getAll('proposals'))
Proposals extends React.Component {
  static propTypes = {
    proposals: PropTypes.array,
    screen: PropTypes.object,
    user: PropTypes.object
  }
  constructor (props) {
    super(props)
    const { proposals } = this.props
    this.state = {
      proposals,
      filterDropdownVisible: false,
      searchText: '',
      filtered: false
    }
  }
  componentWillReceiveProps (nextProps) {
    const { proposals } = nextProps
    if (proposals) this.setState({ proposals })
  }

  onInputChange = searchText => this.setState({ searchText })
  onSearch = () => {
    const { searchText } = this.state
    const { proposals } = this.props
    const reg = new RegExp(searchText, 'gi')
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      proposals: proposals
        .map(record => {
          const match = record.title.match(reg)
          if (!match) return null
          return {
            ...record,
            title: (
              <span>
                {record.title
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
    { enums, screen, myProposals, myDrafts } = this.props,
    //  Proposals go through state since we filter
    { proposals } = this.state
  ) {
    //  Create an array of years for select boxes
    const years = _.range(
      2000,
      new Date().getFullYear() + 1
    )
    //  Columns are defined in render because they have many data dependencies.
    let columns = [
      {
        title: 'ID',
        dataIndex: 'number',
        key: 'number',
        render: (text, record) => (
          <span>{`${record.year}-${record.number}`}</span>
        ),
        //  FIXME: Does this sort correctly?
        sorter: (a, b) =>
          a.year * a.number - b.year * b.number,
        // sorter: (a, b) => {
          // let ret = 0
          // if (a.year > b.year) {
          //   ret -= 1
          // } else if (a.number > b.number) {
          //   ret -= 1
          // } else {
          //   ret += 1
          // }
          // return ret
        // },
        filters: years.map((year, i) => {
          return { text: year, value: year }
        }),
        onFilter: (value, record) =>
          record.year.toString().includes(value),
        width: 90
      },
      {
        title: 'Q',
        dataIndex: 'quarter',
        key: 'quarter',
        render: text => (
          <span>{text.substr(0, 2) || ''}</span>
        ),
        filters: [
          { text: 'Winter', value: 'Winter' },
          { text: 'Fall', value: 'Fall' },
          { text: 'Spring', value: 'Spring' },
          { text: 'Summer', value: 'Summer' }
        ],
        onFilter: (value, record) =>
          record.quarter.includes(value),
        width: 50
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => (
          <Link to={`/proposals/${record.year}/${record.number}`}>
            {record.title}
          </Link>
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
        dataIndex: 'organization',
        key: 'organization',
        filters: enums
          ? Object.keys(enums.organizations).map(key => ({ text: key, value: key }))
          : [],
        onFilter: (value, record) => record.organization === value
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        filters: enums
          ? enums.categories.map(category => {
            return { text: category, value: category }
          })
          : [],
        onFilter: (value, record) =>
          record.category === value,
        width: 150
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: text => <Badge status={indicators[text] || 'default'} text={<b>{text}</b>} />,
        filters: enums
          ? enums.statuses.map(status => {
            return { text: status, value: status }
          })
          : [],
        onFilter: (value, record) => record.status === value,
        width: 100
      },
      {
        title: 'Asked',
        dataIndex: 'asked',
        key: 'asked',
        render: text => <span>{text ? currency(text) : '0'}</span>,
        sorter: (a, b) => a.asked - b.asked,
        width: 100
      },
      {
        title: 'Awarded',
        dataIndex: 'received',
        key: 'received',
        // render: (text, record) =>
        //   record.received
        //     ? <Progress type='circle' width={70}
        //       percent={parseInt(record.received / record.asked * 100)} />
        //     : <span />,
        render: (text, record) =>
          record.received
            ? <Progress type='circle' width={70}
              percent={parseInt(record.received / record.asked * 100)} />
            : record.status === 'Denied'
                ? <Progress type='circle' width={70}
                  status='exception'
                  percent={0} />
                : <em>N/A</em>,
        sorter: (a, b) =>
          a.received || 0 / a.asked -
            b.received || 0 / b.asked,
        width: 110
      }
    ]
    const title = () => (
      <div>
        {(myProposals && myProposals.length > 0) &&
          <div>
            <h6>Your Proposals</h6>
            <ul>
              {myProposals.map((p, i) => (
                <li key={p._id}>
                  <Badge status={indicators[p.status] || 'default'}
                    text={
                      <Link to={`/proposals/${p.year}/${p.number}`}>
                        {`${p.year}-${p.number}: ${p.title}`}
                      </Link>
                      }
                  />
                </li>
                ))}
            </ul>
          </div>
        }
        {(myDrafts && myDrafts.length > 0) &&
          <div>
            <h6>Pending Drafts</h6>
            <ul>
              {myDrafts.map((p, i) => (
                <li key={p._id}>
                  <Badge status='error'
                    text={
                      <Link to={`/edit/${p._id}`}>
                        {`${p._id}: ${p.title || 'Untitled Draft'}`}
                      </Link>
                    }
                  />
                </li>
                ))}
            </ul>
          </div>
        }
      </div>
    )
    const footer = () => (
      <div>
        <h6>
          <em>
            Any campus department or org can submit a proposal with a budget code. <Link to='/create'>
            Click Here!
          </Link>
          </em>
        </h6>
      </div>
    )
    // let responsiveColumns = columns
    // const responsiveColumns = () => {
    //   if (screen.lessThan.large && !screen.lessThan.medium) {
    //     return [...columns.slice(0, 3), ...columns.slice(6)]
    //   } else if (screen.lessThan.medium) {
    //     return columns.slice(0, 3)
    //   }
    //   return columns
    // }
    if (screen.lessThan.large && !screen.lessThan.medium) {
      columns = [...columns.slice(0, 3), ...columns.slice(6)]
    } else if (screen.lessThan.medium) {
      columns = columns.slice(0, 3)
    }
    return (
      <article className={styles['article']}>
        <h1>STF Proposals</h1>
        <p>
          All STF proposals from the past 2 years can be viewed here.
        </p>
        <Helmet title='Proposals' />
        {!proposals
            ? <Spin size='large' tip='Loading...' />
            : <Table
              rowKey={record => record._id}
              dataSource={proposals}
              sort
              size={screen.lessThan.medium ? 'small' : 'middle'}
              columns={columns}
              title={title}
              footer={footer}
            />
          }
      </article>
    )
  }
}
export default Proposals
