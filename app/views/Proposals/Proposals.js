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
    fixed: 'left',
    width: 90
  },
  {
    title: 'Q',
    dataIndex: 'quarter',
    key: 'quarter',
    render: (text) => <span>{text.substr(0, 2)}</span>,
    width: 35
  },
  { title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (text, record) => <Link to={`/proposals/${record.year}/${record.number}`}>{record.title}</Link>
  },
  { title: 'Organization', dataIndex: 'organization', key: 'organization' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text) => <span><Badge status='success' />{text}</span>
  },
  { title: 'Asked', dataIndex: 'asked', key: 'asked' },
  {
    title: 'Received',
    dataIndex: 'received',
    key: 'received',
    render: (text, record) => <Progress type='circle' width={60}
      percent={parseInt(record.asked / record.received * 100)} />,
    width: 85
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
  connectRequest((props) => api.getAll({ model: 'proposals' }))
)
class Proposals extends React.Component {
  //  Shorthand assignment of variables when defining render
  render ({ proposals, screen } = this.props) {
    //  Return mapped content with proposal data. Demonstrates data usage.
    return (
      <article className={styles['article']}>
        {!proposals
          ? <Spin size='large' tip='Loading...' />
          : <Table dataSource={proposals} sort
            size={screen.lessThan.medium ? 'small' : ''}
            columns={screen.lessThan.medium ? columns.slice(0, 3) : columns}
            title={() => <h1>STF Proposals</h1>}
          />
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
