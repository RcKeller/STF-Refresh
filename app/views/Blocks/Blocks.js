import React from 'react'
import PropTypes from 'prop-types'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import { blocks } from '../../services'

// const columns = [
//   { title: 'Year', dataIndex: 'year', key: 'year' },
//   { title: '#', dataIndex: 'number', key: 'number' },
//   { title: 'Title', dataIndex: 'title', key: 'title' },
//   { title: 'Organization', dataIndex: 'organization', key: 'organization' },
//   { title: 'Status', dataIndex: 'status', key: 'status' }
// ]

import { Table } from 'antd'

import styles from './Blocks.css'
@compose(
  connect(state => ({ blocks: state.entities.blocks })),
  connectRequest(() => blocks.getAll())
)
class Blocks extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [
        { title: 'Year', dataIndex: 'year', key: 'year' },
        { title: '#', dataIndex: 'number', key: 'number' },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Organization', dataIndex: 'organization', key: 'organization' },
        { title: 'Status', dataIndex: 'status', key: 'status' }
      ]
    }
  }
  render (
    { columns } = this.state,
    { blocks } = this.props
  ) {
    return (
      <article className={styles['article']}>
        <Table columns={columns} dataSource={blocks} sort
          title={() => 'Continuous Funding Blocks'}
        />
      </article>
    )
  }
}
Blocks.propTypes = {
  blocks: PropTypes.array
}
export default Blocks
