import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import DevTools from '../../DevTools'

// Import Components
import Helmet from 'react-helmet'
import Headroom from 'react-headroom'
import Grid from 'react-bootstrap/lib/Grid'

import UWHeader from './components/UWHeader/UWHeader'
import STFHeader from './components/STFHeader/STFHeader'
import Footer from './components/Footer/Footer'

import { Button } from 'antd'

import styles from './Template.css'
const meta = [
  { charset: 'utf-8' },
  { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1' }
]
export class Template extends React.Component {
  constructor (props) {
    super(props)
    this.state = { mounted: false }
  }
  componentDidMount () { this.setState({mounted: true}) }
  render () {
    return (
      <div className={styles['site']}>
        {this.state.mounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && <DevTools />}
        <Helmet meta={meta}
          title='UW Student Tech Fee Commitee'
          titleTemplate='%s - Student Tech Fee'
         />
        <div className={styles['content']}>
          <UWHeader />
          <Headroom pinStart={55} wrapperStyle={{height: 'inherit !important'}}>
            <STFHeader />
          </Headroom>
          <Button type='primary'>Primary</Button>
          <Grid>{this.props.children}</Grid>
        </div>
        <Footer />
      </div>
    )
  }
}
/*
// Import Actions
import { toggleAddPost } from './TemplateActions'

<a className={styles['add-post-button']} href='#' onClick={() => this.props.dispatch(toggleAddPost())}>
  Debug Placeholder: Add a post!
</a>
// dispatch: PropTypes.func.isRequired
*/

Template.propTypes = { children: PropTypes.object.isRequired }
function mapStateToProps (store) { return {} }
export default connect(mapStateToProps)(Template)
