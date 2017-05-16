import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class Signatures extends React.Component {
  // constructor (props) {
  //   super(props)
  //   this.state = { }
  // }
  render () {
    return (
      <div>
        Intro
      </div>
    )
  }
}

const mapStateToProps = (state) => { return {} }
const mapDispatchToProps = (dispatch) => { return {} }
// Signatures.propTypes = {}
export default connect(mapStateToProps, mapDispatchToProps)(Signatures)