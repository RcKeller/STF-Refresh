//  React and its typechecking
import React from 'react'
import Helmet from 'react-helmet'

import { Tabs, Alert } from 'antd'
const TabPane = Tabs.TabPane
import Budgeting from './Budgeting/Budgeting'
import Queries from './Queries/Queries'

/*
DASHBOARD PAGE: .../dashboard
Provides a bunch of EXPERIMENTAL tools,
such as massive budgeting views and query tools
*/
import styles from './Dashboard.css'
class Dashboard extends React.Component {
  //  Shorthand assignment of variables when defining render
  render () {
    return (
      <article className={styles['article']}>
        <Helmet title='Dashboard' />
        <h1>STF Dashboard</h1>
        <h6>For Internal Use Only.</h6>
        <Tabs>
          <TabPane tab='Overview' key='1'>
            <Alert type='info' banner showIcon={false}
              message='A message from Keller, your developer.'
              description='Welcome to Dashboard, our internal business intelligence tools. Each of these tools has been built to assist the committee with essential functions beyond the core webapp. Feel free to consult with me if you are in need of anything. Note, these features are beyond my core scope, and as such, are experimental.'
            />
          </TabPane>
          <TabPane tab='Awards & Budgeting' key='2'>
            <Budgeting />
          </TabPane>
          {/* <TabPane tab={<span>Activity Report (<em>WIP</em>)</span>} disabled key='3'>
            <h2>Under Development</h2>
          </TabPane> */}
          <TabPane tab='Query Tool' key='4'>
            <Queries />
          </TabPane>
        </Tabs>
      </article>
    )
  }
}
export default Dashboard
