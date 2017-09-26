import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'

import { Row, Col, Timeline, Alert } from 'antd'
const Item = Timeline.Item

import styles from './FrontPage.css'
@connect(state => ({
    stage: state.config && state.config.stage,
    news: state.config && state.config.news,
    timeline: state.config && state.config.timeline
}))
class FrontPage extends React.Component {
  render (
    { news, timeline, endorsements } = this.props
  ) {
    let past = Array.isArray(timeline) ? timeline.slice() : []
    let future = past.pop()
    return (
      <article className={styles['page']}>
        <Helmet title='Home' />
        <section>
          <Row type='flex' justify='space-around' >
            <Col className='gutter-row' span={24} md={16}>
              <h1>The UW Student Technology Committee</h1>
              <p>
                ...Is an entirely student operated organization dedicated to meeting the technological needs of students beyond the boundaries of the classroom. Formed by the <a href='http://apps.leg.wa.gov/RCW/default.aspx?cite=28b.15.051'>Washington State Legislature</a> and <a href='https://www.washington.edu/regents/'>UW Board of Regents</a>, we advocate for students by working with campus departments and student organizations to identify innovative and impactful technology projects. Project proposals are vetted by a committee of students appointed by the <a href='http://asuw.org'>Associated Students of the University of Washington</a>, and the <a href='http://depts.washington.edu/gpss/home'>Graduate and Professional Student Senate</a> for their ability to benefit the student community.
              </p>
              <h2>Technology Fee</h2>
              <p>
                The Student Technology Fee is a $38 per quarter fee paid by all matriculated students of the University of Washington. The committee appropriates roughly $5 million in student funding across almost one hundred proposals annually. All projects funded by the STF are not-for-profit and for student use.
              </p>
              <h2>Proposal Process</h2>
              <p>
                Funding is allocated via a proposal/grant cycle run by the committee. At the beginning of the year, a Request for Proposals (RFP) is issued. Proposal submissions are accepted at the beginning of each quarter, and authors are asked to present the request at a weekly board meeting. At the end of each quarter, the committee votes and issues funding decisions. Those who receive awards must spend and report expenditures by the end of the academic year.
              </p>
              <h2>Student Outreach</h2>
              <p>
                All STF projects involve student outreach, where project leaders reach out and inform the student body about resources they can benefit from. The STF holds <a href='http://apps.leg.wa.gov/rcw/default.aspx?cite=42.30'>Open Meetings</a> every week during the academic year to hear, deliberate and vote on campus projects. We encourage students to attend.
              </p>
              <Alert type='info' showIcon banner
                message='Weekly Meetings'
                description={<ul>
                  <li>Every Monday</li>
                  <li>3:30-5:30PM</li>
                  <li>HUB 303</li>
                </ul>}
              />
            </Col>
            <Col className='gutter-row' span={24} md={8}>
              <h2>Announcements</h2>
              <p>{news || 'No news for now.'}</p>
              {past && future
                ? <Timeline pending={future}>
                  {past.map((e, i) => (
                    <Item key={i} color='green'>{e}</Item>
                  ))}
                </Timeline>
                : <em>We are currently developing our schedule.</em>
              }

              <h2>New Web Platform</h2>
              <p>
                This website is the new platform for the committee, supporting proposal submissions, endorsements, committee review and award management. We have developed this new platform to improve the proposal experience. We encourage authors to review the new RFP in the navbar and reach out to the proposal officer with any questions.
              </p>
            </Col>
          </Row>
        </section>
      </article>
    )
  }
}

export default FrontPage
