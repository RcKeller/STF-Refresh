import React from 'react'
import PropTypes from 'prop-types'

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
    blocks: state.entities.blocks,
    screen: state.screen
  })),
  connectRequest(() => api.getAll('blocks'))
)
class Blocks extends React.Component {
  render ({ blocks, screen } = this.props) {
    return (
      <article className={styles['blocks']}>
        {!blocks
          ? <Spin size='large' tip='Loading...' />
          : <Table dataSource={blocks} sort
            size={screen.lessThan.medium ? 'small' : ''}
            columns={screen.lessThan.medium ? columns.slice(1, 3) : columns}
            title={() => <h1>Continuous Funding Blocks</h1>}
          />
        }
      </article>
    )
  }
}
Blocks.propTypes = {
  blocks: PropTypes.array,
  screen: PropTypes.object
}
export default Blocks
