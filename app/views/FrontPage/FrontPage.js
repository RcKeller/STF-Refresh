import React from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'

import { Row, Col, Timeline } from 'antd'
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
              <h1>About the STF Committee</h1>
              <p>
                The STFC is a committee composed of UW undergraduate and graduate students that appropriates funds to provide technology resources to UW students. Funds are allocated through a proposal/grant cycle, in which proposals submitted by UW departments and student groups are reviewed by the committee. Proposals are accepted at the beginning of each quarter in the form of a written request. Proposal authors are also asked to present their request at one of the STF’s weekly board meetings. At the end of each quarter, committee members vote on each proposal and a funding decision is issued.
              </p>
              <h2>New Web Platform</h2>
              <p>
                This website is the new platform for the committee, supporting proposal submissions, endorsements, committee review and award management. We have developed this new platform to improve the proposal experience. We encourage authors to review the new RFP in the navbar and reach out to the proposal officer with any questions.
              </p>
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
            </Col>
          </Row>
        </section>
      </article>
    )
  }
}

export default FrontPage
