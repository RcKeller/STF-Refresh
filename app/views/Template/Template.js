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
@connect(
  state => state.user,
  dispatch => ({
    actions: {
      test: console.log('Placeholder action')
    }
  })
)
class Template extends React.Component {
  render () {
    return (
      <div>Template!</div>
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
