import React from 'react'
import PropTypes from 'prop-types'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import { blocks } from '../../services'

import { Table } from 'antd'

import styles from './Blocks.css'
@compose(
  connect(state => ({
    blocks: state.entities.blocks,
    screen: state.screen
  })),
  connectRequest(() => blocks.getAll())
)
class Blocks extends React.Component {
  constructor (props) {
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
    { blocks, screen } = this.props
  ) {
    return (
      <article className={styles['blocks']}>
        <Table dataSource={blocks}
          sort
          size={
            screen.lessThan.medium ? 'small' : ''
          }
          columns={
            screen.lessThan.medium ? columns.slice(1, 3) : columns
          }
          title={() => <h1>Continuous Funding Blocks</h1>}
        />
      </article>
    )
  }
}
Blocks.propTypes = {
  blocks: PropTypes.array,
  screen: PropTypes.object
}
export default Blocks
