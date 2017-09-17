import React from 'react'
import Helmet from 'react-helmet'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../services'
import { Link } from 'react-router'
import { Row, Col, Spin, Timeline, Carousel, Collapse } from 'antd'
const Item = Timeline.Item
const Panel = Collapse.Panel

import styles from './FrontPage.css'
@compose(
  connect(state => ({
    endorsements: state.db.comments,
    stage: state.config && state.config.stage,
    news: state.config && state.config.news,
    timeline: state.config && state.config.timeline
  })),
  // connectRequest(() => api.get('comments'))
  connectRequest(() => api.get('comments', {
    join: ['proposal']
  }))
)
class FrontPage extends React.Component {
  render (
    { news, timeline, endorsements } = this.props
  ) {
    let past = Array.isArray(timeline) ? timeline.slice() : []
    let future = past.pop()
    return (
      <article className={styles['page']}>
        <Helmet title='Home' />
        <Carousel autoplay vertical >
          <div><h3>1</h3></div>
          <div><h3>2</h3></div>
          <div><h3>3</h3></div>
          <div><h3>4</h3></div>
        </Carousel>
        <section className={styles['page-content']}>
          <Row type='flex' justify='space-around' >
            <Col className='gutter-row' span={24} md={8}>
              <h1 className='demo-note' style={{ color: 'red' }}>CONTENT NEEDED</h1>
              <p className='demo-note' style={{ color: 'red' }}>This should be an elevator speech for what the STF is. But for now, you can see our typography. To the right is a timeline component that the admin can edit himself in the config panel, allowing him to show where we are in the proposal lifecycle (hearing proposals, voting on proposals, dispersing awards...)</p>
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
            <Col className='gutter-row' span={24} md={8}>
              <h4>See what people are saying...</h4>
              <Collapse accordion bordered={false} defaultActiveKey={['0']}>
                {endorsements
                  ? endorsements.map((e, i) => (
                    <Panel key={i} header={`${e.user.name} (${e.user.netID})`}>
                      <span>
                        <p>{e.body}</p>
                        <em>Endorsement of <Link to={`${e.proposal.year}/${e.proposal.number}`}>{e.proposal.title}</Link></em>
                      </span>
                    </Panel>
                  ))
                  : <Spin size='large' tip='Loading...' />
                }
              </Collapse>
            </Col >
          </Row>
        </section>
      </article>
    )
  }
}

export default FrontPage
