import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../services'
import { Loading } from '../../components'

import { Link } from 'react-router'
import { Spin, Table, Alert } from 'antd'

const currency = value => `$${Number.parseInt(value).toLocaleString()}`

/*
/BLOCKS PAGE: .../blocks
Provides an overview on continuous funding blocks
Renders all blocks in a short table
Summarizes annual projections for continuous funding expenses
*/
import styles from './Blocks.css'
@compose(
  connect(state => ({
    blocks: state.db.blocks || [],
    screen: state.screen
  })),
  connectRequest(() => api.get('blocks', {
    select: ['year', 'number', 'title', 'organization', 'status', 'received'],
    populate: [{ path: 'contacts', select: 'netID' }]
  }))
)
class Blocks extends React.Component {
  static propTypes = {
    blocks: PropTypes.array,
    screen: PropTypes.object
  }
  projects = [
    {
      _id: 'CSF',
      number: 'CSF',
      year: 2018,
      title: 'Campus Sustainability Fund',
      organization: 'Campus Sustainability',
      status: 'Special Grant',
      received: 200000
    }
  ]
  columns = [
    { title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => <Link to={`/blocks/${record.number}`}>{record.title}</Link>
    },
    { title: 'Organization', dataIndex: 'organization', key: 'organization' },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100 },
    { title: 'Award', dataIndex: 'received', key: 'received', render: (title) => <span>{currency(title || 0)}</span>, width: 80 }
  ]
  render (
    { blocks, screen } = this.props,
    { projects } = this
  ) {
    // Combine blocks and Special Projects
    let blocksAndProjects = blocks.slice()
    for (let project of projects) {
      blocksAndProjects.push(project)
    }
    const total = blocksAndProjects.reduce((a, b) => a + b.received, 0)
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
        <Loading render={blocksAndProjects && blocksAndProjects.length > projects.length}
          title='block projects'
          tip='Loading Projects...'
        >
          <Table dataSource={blocksAndProjects} pagination={false}
            rowKey={record => record._id}
            size='middle'
            columns={screen.lessThan.medium ? [this.columns[0], this.columns[3]] : this.columns}
            footer={() =>
              <Alert type='info' banner showIcon={false}
                message={<h2>{`Estimated Annual Funding: ${currency(total || 0)}`}</h2>}
              />
            }
          />
        </Loading>
      </article>
    )
  }
}

export default Blocks
