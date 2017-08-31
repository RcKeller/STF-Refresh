import React from 'react'
import Helmet from 'react-helmet'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../services'
import { Link } from 'react-router'
import { Row, Col, Card, Timeline, Carousel, Collapse, Avatar } from 'antd'
const Item = Timeline.Item
const Panel = Collapse.Panel

import styles from './FrontPage.css'
@compose(
  connect(state => ({
    stage: state.db.config && state.db.config.stage,
    endorsements: state.db.comments
  })),
  // connectRequest(() => api.get('comments'))
  connectRequest(() => api.get('comments', {
      join: ['proposal']
  }))
)
class FrontPage extends React.Component {
  render (
    { endorsements } = this.props
  ) {
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
              <p>Lorem ipsum, instructions, etc.</p>
              <Timeline pending='See more'>
                <Item color='green'>Process A</Item>
                <Item color='green'>Process B</Item>
                <Item color='blue'>Hearing Proposals</Item>
              </Timeline>
            </Col>
            <Col className='gutter-row' span={24} md={8}>
              <h4>See what people are saying...</h4>
                <Collapse accordion bordered={false} defaultActiveKey={['0']}>
                  {endorsements && endorsements.map((m, i) => (
                    <Panel key={i} header={`${m.user.name} (${m.user.netID})`} key={i}>
                      <span>
                        <p>
                          {m.body}
                        </p>
                        <em>For <Link to={`${m.proposal.year}/${m.proposal.number}`}>{m.proposal.title}</Link></em>
                      </span>
                    </Panel>
                  ))}
                  {/* {endorsements && endorsements.map(m => (
                    <Panel header='This is panel header 1' key='1'>
                    <div key={m._id}>
                      <span>{`${m.user.name} (${m.user.netID})`}</span>
                      <em>For <Link to={`${m.proposal.year}/${m.proposal.number}`}></Link></em>
                    </div>
                  ))} */}
                </Collapse>
            </Col >
          </Row>
        </section>
      </article>
    )
  }
}

export default FrontPage
