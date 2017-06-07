import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import {
  connectRequest
} from 'redux-query';
import { Link, browserHistory } from 'react-router'
import { logOut } from './ducks'

import { Button } from 'antd'

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
@connect(
  state => ({ user: state.user }),
  dispatch => ({ logOut: bindActionCreators(logOut, dispatch) })
)
class Login extends React.Component {
  render ({ user, logOut } = this.props) {
    return (
      <div>
        {user.authenticated
          ? <Button size='large' onClick={logOut}>
              Log Out
            </Button>
          : <a href='/auth/google'>
              <Button size='large' href='/auth/google'>
              Log in with Google
              </Button>
            </a>
        }
      </div>
    )
  }
}

Login.propTypes = {
  // router: PropTypes.object.isRequired
  user: PropTypes.object,
  logOut: PropTypes.func
};
export default Login
