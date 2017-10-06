//  React and its typechecking
import React from 'react'
import Helmet from 'react-helmet'

import { Tabs } from 'antd'
const TabPane = Tabs.TabPane
import Budgeting from './Budgeting/Budgeting'
import Queries from './Queries/Queries'

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
            <h2>Instructions</h2>
            <p>Directions here.</p>
          </TabPane>
          <TabPane tab='Awards & Budgeting' key='2'>
            <Budgeting />
          </TabPane>
          <TabPane tab='Query Tool' key='3'>
            <Queries />
          </TabPane>
        </Tabs>
      </article>
    )
  }
}
export default Dashboard
