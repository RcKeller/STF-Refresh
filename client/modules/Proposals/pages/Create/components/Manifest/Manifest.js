import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class Manifest extends React.Component {
  // constructor (props) {
  //   super(props)
  //   this.state = { }
  // }
  render () {
    return (
      <div>
        Manifest
      </div>
    )
  }
}

const mapStateToProps = (state) => { return {} }
const mapDispatchToProps = (dispatch) => { return {} }
// Manifest.propTypes = {}
export default connect(mapStateToProps, mapDispatchToProps)(Manifest)