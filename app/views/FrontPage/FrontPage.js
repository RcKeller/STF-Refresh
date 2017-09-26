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
        <section className={styles['page-content']}>
          <Row type='flex' justify='space-around' >
            <Col className='gutter-row' span={24} md={16}>
              <h1>About the STF Committee</h1>
              <p>The STF committee...</p>
              <h2>H2</h2>
              <p>The STF committee...</p>
              <h3>H3</h3>
              <p>The STF committee...</p>
              <h4>H4</h4>
              <p>The STF committee...</p>
              <h5>H5</h5>
              <p>The STF committee...</p>
              <h6>H6</h6>
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
