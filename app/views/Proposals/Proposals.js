//  React and its typechecking
import React from 'react'
import PropTypes from 'prop-types'
//  Redux utils
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'
//  Our API services
import api from '../../services'

import { Link } from 'react-router'
import { Spin, Table, Progress, Badge } from 'antd'

const columns = [
  {
    title: 'ID',
    dataIndex: 'number',
    key: 'number',
    sorter: (a, b) => (a.year * a.number) - (b.year * b.number),
    render: (text, record) => <span>{`${record.year}-${record.number}`}</span>,
    width: 90
  },
  {
    title: 'Q',
    dataIndex: 'quarter',
    key: 'quarter',
    render: (text) => <span>{text ? text.substr(0, 2) : ''}</span>,
    filters: [
      { text: 'Autumn', value: 'Au' },
      { text: 'Fall', value: 'Fa' },
      { text: 'Spring', value: 'Sp' },
      { text: 'Summer', value: 'Su' }
    ],
    onFilter: (value, record) => record.quarter.indexOf(value) === 0,
    width: 50
  },
  { title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (text, record) => <Link to={`/proposals/${record.year}/${record.number}`}>{record.title}</Link>
  },
  { title: 'Organization', dataIndex: 'organization', key: 'organization' },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    width: 150
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text) => <Badge status='success' text={text} />
  },
  {
    title: 'Asked',
    dataIndex: 'asked',
    key: 'asked',
    sorter: (a, b) => (a.asked) - (b.asked)
  },
  {
    title: 'Received',
    dataIndex: 'received',
    key: 'received',
    render: (text, record) => <Progress type='circle' width={70}
      percent={parseInt(record.asked / record.received * 100)} />,
    sorter: (a, b) => (a.asked / a.received * 100) - (b.asked / b.received * 100),
    width: 100
    // render: (text, record) => <Progress percent={parseInt(record.asked / record.received * 100)} status='active' />
  }
]

//  Import modular CSS. Needs to run through JS because styles are hashed.
import styles from './Proposals.css'
//  This is a decorator, a function that wraps another class (which in JS is essentially a func)
@compose(
  // Compose is a redux utility that runs an array of functions:
  //  Connect component to cached DB entities
  connect((state, props) => ({
    proposals: state.db.proposals,
    screen: state.screen,
    user: state.user
  })),
  //  Execute necessary AJAX to load said entities
  connectRequest(() => api.get('proposals', {
    where: { published: true }
  }))
  // connectRequest((props) => api.getAll('proposals'))
)
class Proposals extends React.Component {
  constructor (props) {
    super(props)
    this.state = { myProposals: [] }
  }
  componentWillReceiveProps (nextProps) {
    const { proposals } = nextProps
    const { user } = this.props
    if (proposals && user.netID) {
      //  Filter out proposals containing the netID in contacts.
      const myProposals = proposals.filter(proposal => {
        for (const contact of proposal.contacts) {
          return contact.netID === user.netID
        }
      })
      this.setState({ myProposals })
    }
  }
  //  Shorthand assignment of variables when defining render
  render (
    { proposals, screen } = this.props,
    { myProposals } = this.state
  ) {
    const footer = () => (
      <div>
        {myProposals.length > 0 &&
          <div>
            <h6>My Proposals</h6>
            <ul>
              {myProposals.map((p, i) => (
                <Link to={`/proposals/${p.year}/${p.number}`}>
                  <li>{`${p.year}-${p.number}: ${p.title}`}</li>
                </Link>
              ))}
            </ul>
          </div>
        }
        <em>Any campus department or org can submit a proposal with a budget code. <Link to='/create'>Click Here!</Link></em>
      </div>
    )
    return (
      <article className={styles['article']}>
        <h1>STF Proposals</h1>
        {!proposals
          ? <Spin size='large' tip='Loading...' />
          : <Table dataSource={proposals} sort
            size={screen.lessThan.medium ? 'small' : ''}
            columns={screen.lessThan.medium ? columns.slice(0, 3) : columns}
            footer={footer}
            />
        }
      </article>
    )
  }
}

//  Proptypes are an idiomatic way of defining expected values.
//  Flow typing and typescript work well with React, but I'd like to stay unopinionated.
Proposals.propTypes = {
  proposals: PropTypes.array,
  screen: PropTypes.object,
  user: PropTypes.object

}
export default Proposals
