//  React and its typechecking
import React from 'react'
import Helmet from 'react-helmet'

import { Tabs, Alert } from 'antd'
const TabPane = Tabs.TabPane
import Budgeting from './Budgeting/Budgeting'
import Supplementals from './Supplementals/Supplementals'
import Metrics from './Metrics/Metrics'
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
          <TabPane tab='Query Tool' key='1'>
            {window && <Queries />}
          </TabPane>
          <TabPane tab='Overview' key='2'>
            <Alert type='info' banner showIcon={false}
              message='A message from Keller, your developer.'
              description='Welcome to Dashboard, our internal business intelligence tools. Each of these tools has been built to assist the committee with essential functions beyond the core webapp. Feel free to consult with me if you are in need of anything. Note, these features are beyond my core scope, and as such, are experimental.'
            />
          </TabPane>
          <TabPane tab='Awards & Reports' key='3'>
            <Budgeting />
          </TabPane>
          <TabPane tab='Supplementals' key='4'>
            <Supplementals />
          </TabPane>
          <TabPane tab='Metrics' key='5'>
            <Metrics />
          </TabPane>
          {/* <TabPane tab={<span>Activity Report (<em>WIP</em>)</span>} disabled key='3'>
            <h2>Under Development</h2>
          </TabPane> */}
        </Tabs>
      </article>
    )
  }
}
export default Dashboard
