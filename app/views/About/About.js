import React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

import { Row, Col, Spin, Table } from 'antd'

import members from './members'
import exOfficios from './exOfficios'
import admins from './admins'

const representativeColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Representing', dataIndex: 'representing', key: 'representing', width: 120 },
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'From', dataIndex: 'from', key: 'from', width: 80 }
]

const adminColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'From', dataIndex: 'from', key: 'from', width: 80 }
  //  Admins should have a duties prop, shown upon expansion.
]

const expandedRowRender = record => (
  <span>
    <p>{record.bio || <em>Biography not available.</em>}</p>
    {record.duties && <span><hr /><p>{record.duties}</p></span>}
  </span>
)

import styles from './About.css'
@connect(state => ({ screen: state.screen }))
class About extends React.Component {
  render (
    { screen } = this.props
  ) {
    return (
      <article className={styles['about']}>
        <Helmet title='About' />
        <div>
          {!members
            ? <Spin size='large' tip='Loading...' />
            : <div>
              <h1>Voting Members</h1>
              <p>
                Voting members are appointed by the <a href='http://asuw.org'>Associated Students of the University of Washington</a>, and the <a href='http://depts.washington.edu/gpss/home'>Graduate and Professional Student Senate</a>. In addition, the STF chair, elected by the committe, is also a voting member.
              </p>
              <Table
                dataSource={members}
                columns={screen.lessThan.medium ? representativeColumns.slice(0, 2) : representativeColumns}
                rowKey={record => record.name}
                expandedRowRender={expandedRowRender}
                defaultExpandAllRows={screen.greaterThan.medium}
                pagination={false}
                size='middle'
              />
            </div>
          }
        </div>
        <div>
          {!exOfficios
            ? <Spin size='large' tip='Loading...' />
            : <div>
              <h1>Ex-Officios</h1>
              <p>Ex-Officios are non-voting members that represent other campus institutions, like UW-IT, Learning Technologies, Library Programs, so on and forth.</p>
              <Table
                dataSource={exOfficios}
                columns={screen.lessThan.medium ? representativeColumns.slice(0, 2) : representativeColumns}
                rowKey={record => record.name}
                expandedRowRender={expandedRowRender}
                defaultExpandAllRows={screen.greaterThan.medium}
                pagination={false}
                size='middle'
              />
            </div>
          }
        </div>
        <div>
          {!admins
            ? <Spin size='large' tip='Loading...' />
            : <div>
              <h1>Administration</h1>
              <p>The Staff and advisors that manage committee operations.</p>
              <Table
                dataSource={admins}
                columns={screen.lessThan.medium ? adminColumns.slice(0, 2) : adminColumns}
                rowKey={record => record.name}
                expandedRowRender={expandedRowRender}
                defaultExpandAllRows={screen.greaterThan.medium}
                pagination={false}
                size='middle'
              />
            </div>
          }
        </div>
      </article>
    )
  }
}

export default About
