import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types'

// UI Components
// import { Layout, Menu, Icon, Alert } from 'antd'
// const { Content, Sider } = Layout
// const SubMenu = Menu.SubMenu
// const ItemGroup = Menu.ItemGroup
// const Item = Menu.Item

// import styles from './Template.css'
// @connect(
//   state => state.user,
//   dispatch => ({
//     actions: {
//       test: console.log('Placeholder action')
//     }
//   })
// )
@connect()
class Template extends React.Component {
  render () {
    const { user } = this.props
    console.log("USER", user)
    return (
      <div>
      <div>Template!</div>
      <ul>
      </ul>
      </div>
    )
  }
}

// Template.propTypes = { children: PropTypes.object.isRequired }
// Template.contextTypes = { router: React.PropTypes.object }
// export default Template

Template.propTypes = { user: PropTypes.object };
function mapStateToProps(state) {
  return {
    user: state.user
  };
}

// Read more about where to place `connect` here:
// https://github.com/rackt/react-redux/issues/75#issuecomment-135436563
export default connect(mapStateToProps)(Template);
