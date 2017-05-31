import React from 'react'
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Link, browserHistory } from 'react-router'

import Helmet from 'react-helmet'

import { Layout, Menu, Icon, Alert, Breadcrumb } from 'antd'
// Nav === Sider from antd docs (horrid namespace)
const { Content, Sider } = Layout
const SubMenu = Menu.SubMenu
const ItemGroup = Menu.ItemGroup
const Item = Menu.Item

import Header from './components/Header/Header'
import Nav from './components/Nav/Nav'
import Body from './components/Body/Body'

const testAction = () => console.log('Placeholder action')

// @connect(
//   state => ({user: state.user}),
//   dispatch => ({ actions: bindActionCreators(duck, dispatch) })
// )
import styles from './Template.css'
import duck from './ducks/'
@connect(
  state => ({user: state.user}),
  dispatch => ({
    actions: { testAction }
  })
)
class Template extends React.Component {
  constructor (props) {
    super(props)
    this.state = { selected: '/' }
    this.highlight = this.highlight.bind(this)
  }
  componentDidMount () { this.highlight() }
  componentWillReceiveProps () { this.highlight() }
  // TODO: Fix associated errors.
  highlight () {
    const selected = this.props.router.location.pathname
    this.setState({ selected }) }
  render () {
    const { children, router, routes, user } = this.props
    return (
      <Layout className={styles['template']}>
        <Helmet
          title='UW Student Tech Fee Commitee'
          titleTemplate='%s - Student Tech Fee'
        />
        <Header />
        <Layout>
          <Sider breakpoint='md'
            width={240} collapsedWidth='0'
            className={styles['nav']}>
            <Nav user={user} router={router} />
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
