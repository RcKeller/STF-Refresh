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
        <h1 className='demo-note' style={{ color: 'goldenrod' }}>REVISION NEEDED</h1>
        <p className='demo-note' style={{ color: 'goldenrod' }}>I need new contact information and verbage (can we get rid of the "tech fee" part), hopefully some that explains the proposal lifecycle. Also, let's consider combining this with the contact page.</p>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <h1>The Student Tech Fee</h1>
            <p>
              The Student Technology Fee is a $38 per quarter fee paid by all matriculated students of the University of Washington. The STF pays for additional technological needs of students beyond the scope of the classroom. The STF was created under the powers given by the Washington State Legislature's <a href='http://apps.leg.wa.gov/RCW/default.aspx?cite=28b.15.051'>Technology Fee</a> article, and the University of Washington's <a href='https://www.washington.edu/regents/'>Board of Regents</a>.
            </p>
          </Col>
          <Col xs={24} sm={12}>
            <h1>The STF Committee</h1>
            <p>
                The money brought in by The Student Technology Fee is appropriated by the STF Committee. A group of nine voting members, appointed by both the <a href='http://asuw.org'>Associated Students of the University of Washington</a>, and the <a href='http://depts.washington.edu/gpss/home'>Graduate and Professional Student Senate</a>, accepts proposals for the expenditure of STF funds. Throughout the academic year, proposal authors present to the committee to request funding.
            </p>
            <p>
                The committee appropriates just shy of $5 million into almost one hundred proposals annually.
            </p>
            <p>
              The Student Technology Fee is entirely student operated and funded. While department heads can request money, funds must always be allocated to student uses. Any technology funded by the STF Committee is appropriated for students use.
            </p>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            {!members
              ? <Spin size='large' tip='Loading...' />
              : <div>
                <h1>Voting Members</h1>
                <p>Lorem ipsum...</p>
                <Table
                  header={() =>
                    <div>
                      <h1>Voting Members</h1>
                      <p>Lorem ipsum...</p>
                    </div>
                  }
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
          </Col>
          <Col xs={24} sm={12}>
            {!exOfficios
              ? <Spin size='large' tip='Loading...' />
              : <div>
                <h1>Ex-Officios</h1>
                <p>Lorem ipsum...</p>
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
          </Col>
        </Row>
        {!admins
          ? <Spin size='large' tip='Loading...' />
          : <div>
            <h1>Administration</h1>
            <p>Lorem ipsum...</p>
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
      </article>
    )
  }
}

export default About
