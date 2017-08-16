import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { endSession } from '../../../services/authentication'

// import { Avatar } from 'antd'

import styles from './Login.css'
@connect(
  state => ({ user: state.user }),
  dispatch => ({ signOut: bindActionCreators(endSession, dispatch) })
)
class Login extends React.Component {
  render ({ user, signOut } = this.props) {
    return (
      <div className={styles['login']}>
        {!user.authenticated
          ? <a href='/auth/google'>
            <button className={styles['button']} >
              <strong>UW NetID</strong>
              <small>WEBLOGIN</small>
            </button>
          </a>
          : <button className={styles['button']}
            onClick={() => signOut()}
          >
            <strong>{user.netID}</strong>
            <small>Signed In</small>
          </button>
        }
      </div>
    )
  }
}

Login.propTypes = {
  user: PropTypes.object,
  signOut: PropTypes.func
}
export default Login
