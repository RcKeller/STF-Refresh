import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Avatar } from 'antd'

import { logOut } from '../../../services/authentication'
import styles from './Login.css'
@connect(
  state => ({ user: state.user }),
  dispatch => ({ signOut: bindActionCreators(logOut, dispatch) })
)
class Login extends React.Component {
  render ({ user, signOut } = this.props) {
    /*
    This function determines the highest authN level of the user.
    It's ugly and inefficient, because the schema was built as an object.
    However, this is the only time we need this information.
    */
    return (
      <div>
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
            {/* <Avatar shape="square" size="large" icon="user" /> */}
            <strong>{user.netID}</strong>
          </button>
        }
      </div>
    )
  }
}

Login.propTypes = {
  // router: PropTypes.object.isRequired
  user: PropTypes.object,
  signOut: PropTypes.func
}
export default Login
