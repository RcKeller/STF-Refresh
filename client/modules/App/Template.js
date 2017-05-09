import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

// Import Components
import Helmet from 'react-helmet'
import DevTools from '../../DevTools'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'

import styles from './Template.css'

// Import Actions
import { toggleAddPost } from './TemplateActions'

const meta = [
  { charset: 'utf-8' },
  {
    'http-equiv': 'X-UA-Compatible',
    content: 'IE=edge'
  },
  {
    name: 'viewport',
    content: 'width=device-width, initial-scale=1'
  }
]

export class Template extends Component {
  constructor (props) {
    super(props)
    this.state = { isMounted: false }
  }

  componentDidMount () {
    this.setState({isMounted: true}); // eslint-disable-line
  }

  toggleAddPostSection () {
    this.props.dispatch(toggleAddPost())
  }

  render () {
    return (
      <div>
        {this.state.isMounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && <DevTools />}
        <div>
          <Helmet
            title='MERN Starter - Blog App'
            titleTemplate='%s - Blog App'
            meta={meta}
          />
          <Header toggleAddPost={this.toggleAddPostSection} />
          <div className={styles.container}>
            {this.props.children}
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}

Template.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
  // intl: PropTypes.object.isRequired,
}

// Retrieve data from store as props
function mapStateToProps (store) {
  return {
    // intl: store.intl,
  }
}

export default connect(mapStateToProps)(Template)
