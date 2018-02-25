import React from 'react'
import Helmet from 'react-helmet'

import { Row, Col, Tabs, Button } from 'antd'
const TabPane = Tabs.TabPane

import Events from './Events/Events'
import Overview from './Overview/Overview'
import Visualizations from './Visualizations/Visualizations'

/*
FRONT PAGE: .../
Splash page. This is semi-dynamic
Admins can set a basic schedule and announcement
Via the config panel. No coding required.
*/
import styles from './FrontPage.css'
class FrontPage extends React.Component {
  render ({ router } = this.props) {
    return (
      <article className={styles['page']}>
        <Helmet title='Home' />
        <section>
          <Row type='flex' justify='space-between' gutter={32} >
            <Col className='gutter-row' span={24} md={16}>
              <h1>The UW Student Technology Committee</h1>
              <p>
                ...Is an entirely student operated organization dedicated to meeting the technological needs of students beyond the boundaries of the classroom. Formed by the <a href='http://apps.leg.wa.gov/RCW/default.aspx?cite=28b.15.051'>Washington State Legislature</a> and <a href='https://www.washington.edu/regents/'>UW Board of Regents</a>, we advocate for students by working with campus departments and student organizations to identify innovative and impactful technology projects. Project proposals are vetted by a committee of students appointed by the <a href='http://asuw.org'>Associated Students of the University of Washington</a>, and the <a href='http://depts.washington.edu/gpss/home'>Graduate and Professional Student Senate</a> for their ability to benefit the student community.
              </p>
              <Tabs
                tabBarExtraContent={
                  <Button size='large'
                    ghost type='primary'
                    icon='question-circle-o'
                    onClick={() => router.push('/FAQ')}
                  >
                    Read FAQ
                  </Button>
                }
              >
                <TabPane tab='Operations Summary' key='1'>
                  <Visualizations />
                </TabPane>
                <TabPane tab='STF Explained' key='2'>
                  <Overview />
                </TabPane>
              </Tabs>
            </Col>
            <Col className='gutter-row' span={24} md={8}>
              <Events />
            </Col>
          </Row>
        </section>
      </article>
    )
  }
}

export default FrontPage
