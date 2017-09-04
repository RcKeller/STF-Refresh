import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../services'

import { Link } from 'react-router'
import { Spin, Table } from 'antd'

import styles from './Blocks.css'
// const renderTitle = (text, record) => <Link to={`/${record.number}`}>{record.title}</Link>

const columns = [
  { title: 'Year', dataIndex: 'year', key: 'year' },
  { title: '#', dataIndex: 'number', key: 'number' },
  { title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (text, record) => <Link to={`/blocks/${record.number}`}>{record.title}</Link>
  },
  { title: 'Organization', dataIndex: 'organization', key: 'organization' },
  { title: 'Status', dataIndex: 'status', key: 'status' }
]

@compose(
  connect(state => ({
    blocks: state.db.blocks,
    screen: state.screen
  })),
  connectRequest(() => api.get('blocks'))
)
class Blocks extends React.Component {
  static propTypes = {
    blocks: PropTypes.array,
    screen: PropTypes.object
  }
  render ({ blocks, screen } = this.props) {
    return (
      <article className={styles['blocks']}>
        <Helmet title='Block Funding' />
        <h1>Continuous Funding Blocks</h1>
        {!blocks
          ? <Spin size='large' tip='Loading...' />
          : <Table dataSource={blocks} pagination={false}
            size={screen.lessThan.medium ? 'small' : ''}
            columns={screen.lessThan.medium ? columns.slice(1, 3) : columns}
          />
        }
        <h1 className='demo-note' style={{ color: 'red' }}>CONTENT NEEDED</h1>
        <p className='demo-note' style={{ color: 'red' }}>We'll need a (brand new) rundown on how block funding works here.</p>
      </article>
    )
  }
}

export default Blocks
