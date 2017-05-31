import React from 'react'
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Link, browserHistory } from 'react-router'

import Helmet from 'react-helmet'

import { Layout } from 'antd'
const { Content, Sider } = Layout
// Nav === Sider from antd docs (horrid namespace)

import Header from './components/Header/Header'
import Login from './components/Login/Login'
import Nav from './components/Nav/Nav'
import Body from './components/Body/Body'

const testAction = () => console.log('Placeholder action')

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
// @connect(
//   state => ({user: state.user})
// )
class Template extends React.Component {
  render () {
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
};
export default Template
