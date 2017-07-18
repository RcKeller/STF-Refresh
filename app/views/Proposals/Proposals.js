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
    render: (text) => <span>{text.substr(0, 2)}</span>,
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
    screen: state.screen
  })),
  //  Execute necessary AJAX to load said entities
  connectRequest((props) => api.get('proposals', {
    where: { published: true }
  }))
  // connectRequest((props) => api.getAll('proposals'))
)
class Proposals extends React.Component {
  //  Shorthand assignment of variables when defining render
  render ({ proposals, screen } = this.props) {
    //  Return mapped content with proposal data. Demonstrates data usage.
    const title = () => <h1>STF Proposals</h1>
    const footer = () => (
      <div>
        <ul>
          {proposals &&
            <div>
              <h6>My Proposals</h6>
              <Link to={`/proposals/${proposals[0].year}/${proposals[0].number}`}>
                <li>{`${proposals[0].year}-${proposals[0].number}: ${proposals[0].title}`}</li>
              </Link>
            </div>
          }
          <li>My prop</li>
          <li>My prop</li>
        </ul>
        <em>Any campus department or org can submit a proposal with a budget code. <Link to='/create'>Click Here!</Link></em>
      </div>
    )
    return (
      <article className={styles['article']}>
        {!proposals
          ? <Spin size='large' tip='Loading...' />
          : (screen.greaterThan.medium
            ? <Table dataSource={proposals} sort
              columns={columns}
              title={title}
              footer={footer}
              />
            : <Table dataSource={proposals} sort
              size='small'
              columns={columns.slice(0, 3)}
              title={title}
              footer={footer}
            />
          )
        }
      </article>
    )
  }
}

//  Proptypes are an idiomatic way of defining expected values.
//  Flow typing and typescript work well with React, but I'd like to stay unopinionated.
Proposals.propTypes = {
  proposals: PropTypes.array
}
export default Proposals
