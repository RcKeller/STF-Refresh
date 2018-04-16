import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Menu, Icon } from 'antd'
const SubMenu = Menu.SubMenu

import { endSession } from '../../../services/authentication'
import { environment } from '../../../services/'
const { ENV } = environment

@connect(
  state => ({ user: state.user }),
  dispatch => ({ signOut: bindActionCreators(endSession, dispatch) })
)
class Login extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    signOut: PropTypes.func
  }
  render (
    { user, signOut } = this.props
  ) {
    return (
      <div className='header-right'>
        {!user.authenticated
          ? <a href={ENV === 'production' ? '/login' : '/auth/google'} >
            <span><Icon type='user' /> Log In</span>
          </a>
          : <span onClick={() => signOut()}>
            <Icon type='user' /> {user.netID | 'UW User'}
          </span>
        }
      </div>
    )
  }
}
export default Login
