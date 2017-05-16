import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class Introduction extends React.Component {
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
// Introduction.propTypes = {}
export default connect(mapStateToProps, mapDispatchToProps)(Introduction)