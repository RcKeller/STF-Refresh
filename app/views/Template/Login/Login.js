import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { compose, bindActionCreators } from 'redux'
// import { connectRequest } from 'redux-query'
// import { Link } from 'react-router'
import { logOut } from './ducks'

// import { Avatar } from 'antd'

// import { logout } from '../../../services/'
// import { authentication } from '../../../services/'
// @connect(
//   state => ({ user: state.user }),
//   dispatch => ({ logOut: bindActionCreators(logOut, dispatch) })
// )
// @connect( state => ({ user: state.user }) )
// @connectRequest( () => logout() )
// @compose(
//   connect( state => ({ user: state.user }) ),
//   dispatch => ({ logOut: bindActionCreators(logOut, dispatch) }),
//   connectRequest( () => authentication.logout() )
// )

import styles from './Login.css'

@connect(
  state => ({ user: state.user }),
  dispatch => ({ logOut: bindActionCreators(logOut, dispatch) })
)
class Login extends React.Component {
  render ({ user, logOut } = this.props) {
    /*
    This function determines the highest authN level of the user.
    It's ugly and inefficient, because the schema was built as an object.
    However, this is the only time we need this information.
    */
    const privleges = [
      user.committee.admin && 'Admin',
      user.committee.member && 'Member',
      user.committee.spectator && 'Ex-Officio'
    ]
    const role = privleges.filter((e) => { if (e) return e })[0]
    return (
      <div>
        {!user.authenticated
        ? <a href='/auth/google'>
            <button className={styles['button']} >
              <strong>UW NetID</strong>
              <small>WEBLOGIN</small>
            </button>
          </a>
        : <button className={styles['button']} onClick={logOut} >
            {/* <Avatar shape="square" size="large" icon="user" /> */}
            <strong>{user.netID}</strong>
            <small>{role ? role : 'Logged in'}</small>
          </button>
        }
      </div>
    )
  }
}

Login.propTypes = {
  // router: PropTypes.object.isRequired
  user: PropTypes.object,
  logOut: PropTypes.func
}
export default Login
