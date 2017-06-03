import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Helmet from 'react-helmet'
import { Link, browserHistory } from 'react-router'

import { Layout } from 'antd'
const { Content, Sider } = Layout

import Header from './Header/Header'
import Login from './Login/Login'
import Nav from './Nav/Nav'
import Body from './Body/Body'

// @connect(
//   state => ({user: state.user}),
//   dispatch => ({ actions: bindActionCreators(duck, dispatch) })
// )
// or
// @connect(
//   state => ({user: state.user}),
//   dispatch => ({
//     actions: { testAction }
//   })
// )
import styles from './Template.css'
class Template extends React.Component {
  render () {
    // React-router is separated from redux store - too heavy to persist.
    const { children, router, routes, user } = this.props
    return (
      <Layout className={styles['template']}>
        <Helmet
          title='UW Student Tech Fee Commitee'
          titleTemplate='%s - Student Tech Fee'
        />
        <Header />
        <Layout className={styles['body']}>
          <Sider breakpoint='md'
            width={240} collapsedWidth='0'
            className={styles['nav']}>
            <Login router={router} />
            <Nav router={router} />
          </Sider>
          <Content>
            <Body routes={routes} children={children} />
          </Content>
        </Layout>
      </Layout>
    )
  }
}
Template.propTypes = {
  children: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  routes: PropTypes.array.isRequired,
  user: PropTypes.object
}
export default Template
