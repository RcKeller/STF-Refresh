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
        <p>
          Block Funding is the mode through which the STF provides continuous funding to select UW entities. Programs to be considered for Block Funding are identified by the STF committee internally, rather than through a proposal process. STF members may nominate a program to receive block funding, at which point the committee may vote to begin the block initiation process. Programs chosen for block funding are generally characterized by:
        </p>
        <ul style={{
          listStyleType: 'circle',
          listStylePosition: 'inside'
        }}>
          <li>
            A history of successfully using committee funds to complete proposed projects.
          </li>
          <li>
            High impact on student success.
          </li>
          <li>
            A specific need for continuous access to new equipment.
          </li>
          <li>
            A demonstrated history of accurate and timely reporting.
          </li>
          <li>
            A reasonable need for greater discretion in use of committee funds than is provided by the regular proposal process.
          </li>
        </ul>
        <br />
        <p>
          If you are interested in pursuing Block Funding for your organization, feel free to discuss it with any member of the committee. Please refrain from asking for Block Funding in your written proposal or proposal presentation.
        </p>
        {!blocks
          ? <Spin size='large' tip='Loading...' />
          : <Table dataSource={blocks} pagination={false}
            rowKey={record => record._id}
            size={screen.lessThan.medium ? 'small' : ''}
            columns={screen.lessThan.medium ? columns.slice(1, 3) : columns}
          />
        }
      </article>
    )
  }
}

export default Blocks
