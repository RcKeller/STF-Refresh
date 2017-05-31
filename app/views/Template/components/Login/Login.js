import React from 'react'
import PropTypes from 'prop-types';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Link, browserHistory } from 'react-router'

import { Button } from 'antd'

@connect(
  state => ({
    user: state.user
    // Router comes from parent (not in redux)
  })
  // actions here
)
class Login extends React.Component {
  render ({ user, router } = this.props) {
    return (
      <div>
        {user.authenticated
          ? <Button size='large' onClick={() => console.log("Placeholder for action: logOut")}>
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
  user: PropTypes.object,
  router: PropTypes.object.isRequired
};
export default Login
