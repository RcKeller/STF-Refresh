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
import { Loading } from '../../components'

import { Link } from 'react-router'
import { Table, Progress, Badge, Input, Icon, Alert } from 'antd'

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

/*
PROPOSALS PAGE: .../proposals
Proposals are loaded dynamically (admins can see unpublished proposals)
and rendered in a highly customized, searchable table.
There are a lot of disparate data sources (e.g. enums in config)
so read the code closely
This is also where users are linked to /create
and can revisit their drafts
*/
//  Import modular CSS. Needs to run through JS because styles are hashed.
import styles from './Proposals.css'
//  This is a decorator, a function that wraps another class (which in JS is essentially a func)
import { sortProposals, publishedProposals, myProposals } from '../../selectors'
@compose(
  connect((state, props) => ({
    proposals: publishedProposals(state),
    myProposals: myProposals(state),
    enums: state.config.enums,
    submissions: state.config.submissions,
    screen: state.screen,
    user: state.user
  })),
  //  If not logged in, query for only published proposals (performance)
  connectRequest(({user}) =>
      user.netID
        ? api.get('proposals', {
          populate: [{ path: 'contacts', select: 'netID' }]
        })
        : api.get('proposals', {
          query: { published: true },
          populate: [{ path: 'contacts', select: 'netID' }]
        })
  )
)
class Proposals extends React.Component {
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
    { enums, screen, myProposals, myDrafts, submissions } = this.props,
    //  Proposals go through state since we filter
    { proposals } = this.state
  ) {
    //  Create an array of years for select boxes
    const years = _.range(
      2000,
      new Date().getFullYear() + 1
    ).reverse()
    //  Columns are defined in render because they have many data dependencies.
    let columns = [
      {
        title: 'ID',
        dataIndex: 'number',
        key: 'number',
        render: (text, record) => (
          <span>{`${record.year}-${record.number}`}</span>
        ),
        sorter: sortProposals,
        filters: years.map((year, i) => {
          return { text: year, value: year }
        }),
        onFilter: (value, record) =>
          record.year.toString().includes(value),
        width: 80
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
          { text: 'Autumn', value: 'Autumn' },
          { text: 'Spring', value: 'Spring' },
          { text: 'Summer', value: 'Summer' }
        ],
        onFilter: (value, record) =>
          record.quarter.includes(value),
        width: 55
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
            size='large'
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
        width: 125
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
        width: 125
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
        title: 'Award',
        dataIndex: 'received',
        key: 'received',
        render: (text, record) =>
          record.received
            ? <Progress type='circle' width={70}
              percent={parseInt(record.received / record.asked * 100)} />
            : record.status === 'Denied'
                ? <Progress type='circle' width={70}
                  status='exception'
                  percent={0} />
                : <Progress type='circle' width={70}
                  format={() => <Icon type='ellipsis' />}
                  percent={0} />,
        sorter: (a, b) =>
          a.received
            ? (a.received || 0) / (a.asked || 1) -
            (b.received || 0) / (b.asked || 1)
            : -a.asked,
        width: 100
      }
    ]
    if (screen.lessThan.large && !screen.lessThan.medium) {
      columns = [...columns.slice(0, 3), ...columns.slice(6)]
    } else if (screen.lessThan.medium) {
      columns = columns.slice(0, 3)
    }
    return (
      <article className={styles['article']}>
        <Helmet title='Proposals' />
        <h1 className={styles['heading']}>Student Technology Proposals</h1>
        {(myProposals && myProposals.length > 0) &&
          <Alert type='info' showIcon={false} banner
            style={{ padding: 8 }}
            message='Your Proposals'
            description={<ul>
              {myProposals.map((p, i) => (
                <li key={p._id}>
                  {p.published
                   ? <Badge status={indicators[p.status] || 'default'}
                     text={<Link to={`/proposals/${p.year}/${p.number}`}>
                       {`${p.year}-${p.number}: ${p.title}`}
                     </Link>}
                  />
                  : <Badge status='error'
                    text={<Link to={`/edit/${p._id}`}>
                      {`Draft ${p._id}: ${p.title || 'Untitled'}`}
                    </Link>}
                  />
                }
                </li>
              ))}
            </ul>}
          />
        }
        <Loading render={Array.isArray(proposals) && proposals.length > 0}
          title='STF Proposals'
          tip='Loading STF Proposals...'
        >
          <Table
            rowKey={record => record._id}
            dataSource={proposals}
            sort
            size={screen.lessThan.medium ? 'small' : 'large'}
            columns={columns}
            footer={submissions
              ? () => <Alert type='warning' banner message={<em>Any campus department or org can submit a proposal with a budget code. <b><Link to='/create'>Click Here!</Link></b></em>} />
              : () => <Alert type='warning' banner message={<em>Proposal submissions for the quarter are closed, but we encourage you to visit and endorse proposals in review!</em>} />
            }
          />
        </Loading>
      </article>
    )
  }
}
export default Proposals
