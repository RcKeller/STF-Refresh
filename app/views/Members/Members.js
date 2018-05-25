import React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

import { Table, Row, Col } from 'antd'

/*
MEMBERS PAGE: .../members and .../about (legacy route)
A brief overview of our membership, changes year to year.
Gathering bio info has proven difficult,
thus the page has been altered accordingly.
*/
import styles from './Members.css'
@connect(state => ({ screen: state.screen }))
class Members extends React.Component {
  votingMembers = [{
    name: 'Alexander Novokhodko',
    representing: 'ASUW',
    from: '2017-2018',
    bio: ''
  }, {
    name: "Brian O'Rouke",
    representing: 'ASUW',
    from: '2017-2018',
    bio: ''
  }, {
    name: 'Abhishek Joshi',
    representing: 'ASUW',
    from: '2017-2018',
    bio: ''
  }, {
    name: 'Satvik Vats',
    representing: 'ASUW',
    from: '2017-2018',
    bio: ''
  }, {
    name: 'Abhijit Patil',
    representing: 'ASUW',
    from: '2017-2018',
    bio: ''
  }, {
    name: 'Harsh Dev',
    representing: 'GPSS',
    from: '2017-2018',
    bio: ''
  }, {
    name: 'Brad Copenhaver',
    representing: 'GPSS',
    from: '2017-2018',
    bio: ''
  }, {
    name: 'Alvin Chen',
    representing: 'GPSS',
    from: '2017-2018',
    bio: ''
  }, {
    name: 'Peder Digre',
    representing: 'GPSS',
    from: '2017-2018',
    bio: ''
  }, {
    name: 'Alec Meade',
    representing: 'STF Chair',
    from: '2017-2018',
    bio: ''
  }]
  exOfficios = [{
    name: 'Jennifer Ward',
    representing: 'UW Libraries',
    from: '',
    bio: ''
  }, {
    name: 'Jeremy Caci',
    representing: 'Undergraduate Academic Affairs',
    from: '',
    bio: ''
  }, {
    name: 'Tom Lewis',
    representing: 'UW-IT, Academic Experience',
    from: '',
    bio: ''
  }]
  admins = [{
    name: 'Alec Meade',
    title: 'Chair, former Officer',
    from: '2016-2018',
    bio: 'This is Alec\'s fourth year at the University of Washington, and his third year with the STF. Alec is studying Environmental Science and Resource Management, with a focus in Landscape Ecology, and hopes to pursue a career related to environmental policy and planning. When he\'s not in class, Alec enjoys exploring the outdoors, memes, and literature.',
    duties: 'Responsible for creating STF policy, setting meeting agendas, approving official documents, managing personnel, communicating with student governments, and leading special projects.'
  }, {
    name: 'Katie McConville',
    title: 'Proposal Officer',
    from: '2017-2018',
    bio: '',
    duties: 'Responsible for advising proposal authors, reviewing proposals for completeness, and auditing previously funded proposals.'
  }, {
    name: 'Britt Arram Carlson',
    title: 'Director, Finance',
    from: '2017-2018',
    bio: '',
    duties: ' Responsible for scheduling, overseeing budgets, reviewing proposal reports, and general committee operations.'
  }, {
    name: 'Sara Torres',
    title: 'Hub Advisor & Manager, Student Life',
    from: '2017-2018',
    bio: 'Sara Torres is the Web Computing Specialist, Technology Manger, and Social Media Coordinator for the Husky Union Building. Sara has served as the Student Life advisor and ex-officio member to the Student Technology Fee Committee since 2010. Outside of UW, Sara enjoys playing softball and is an avid movie and trivia buff. A huge baseball fan, Sara is more than halfway done to touring and/or attending baseball games in all MLB stadiums. Originally from New Mexico, Sara is always on the lookout for restaurants in the greater Seattle area which properly use green chile or have good tamales or sopaipillas on their menu. Suggestions welcomed.',
    duties: 'Serves as the in-house advisor for the STF, keeping administration cohesive as the commitee evolves.'
  }, {
    name: 'Ryan Keller',
    title: 'Software Engineer',
    from: '2017-2018',
    bio: 'Keller is an Informatics student and former UW-IT employee with Network Implementation and Critical Infrastructure. He has developed automation systems for scaling infrastructure and IT services for UW-IT. Keller is a ex-academic from the University of North Texas, where he used to be a manager in a trauma research lab.',
    duties: 'The Web Developer is is responsible for maintaining, updating, and improving upon the STF’s web resources.'
  }]
  render (
    { votingMembers, exOfficios, admins } = this,
    { screen } = this.props
  ) {
    // const expandedRowRender = record => (
    //   <span>
    //     <p>{record.bio || <em>Biography not available.</em>}</p>
    //     {record.duties && <span><hr /><p>{record.duties}</p></span>}
    //   </span>
    // )
    const representativeColumns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Representing', dataIndex: 'representing', key: 'representing', width: 200 },
      { title: 'From', dataIndex: 'from', key: 'from', width: 80 }
    ]
    const adminColumns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Title', dataIndex: 'title', key: 'title', width: 200 },
      { title: 'From', dataIndex: 'from', key: 'from', width: 80 }
      //  Admins should have a duties prop, shown upon expansion.
    ]
    return (
      <article className={styles['about']}>
        <Helmet title='About' />
        <Row type='flex' justify='space-between' gutter={16}>
          <Col xs={24} lg={12}>
            <h1>Voting Members</h1>
            <p>
              Voting members are appointed by the <a href='http://asuw.org'>Associated Students of the University of Washington</a>, and the <a href='http://depts.washington.edu/gpss/home'>Graduate and Professional Student Senate</a>. In addition, the STF chair, elected by the committe, is also a voting member.
            </p>
            {votingMembers.length > 0 &&
              <Table
                dataSource={votingMembers}
                columns={screen.lessThan.medium ? representativeColumns.slice(0, 2) : representativeColumns}
                rowKey={record => record.name}
                // expandedRowRender={expandedRowRender}
                // defaultExpandAllRows={screen.greaterThan.medium}
                pagination={false}
                size='middle'
              />
            }
          </Col>
          <Col xs={24} lg={12}>
            <h1>Ex-Officios</h1>
            <p>Ex-Officios are non-voting members that represent other campus institutions, like UW-IT, Learning Technologies, Library Programs, so on and forth.</p>
            {exOfficios.length > 0 &&
              <Table
                dataSource={exOfficios}
                columns={screen.lessThan.medium ? representativeColumns.slice(0, 2) : representativeColumns}
                rowKey={record => record.name}
                // expandedRowRender={expandedRowRender}
                // defaultExpandAllRows={screen.greaterThan.medium}
                pagination={false}
                size='middle'
              />
            }
            <h1>Administration</h1>
            <p>The Staff and advisors that manage committee operations.</p>
            {admins.length > 0 &&
              <Table
                dataSource={admins}
                columns={screen.lessThan.medium ? adminColumns.slice(0, 2) : adminColumns}
                rowKey={record => record.name}
                // expandedRowRender={expandedRowRender}
                // defaultExpandAllRows={screen.greaterThan.medium}
                pagination={false}
                size='middle'
              />
            }
          </Col>
        </Row>
      </article>
    )
  }
}

export default Members
