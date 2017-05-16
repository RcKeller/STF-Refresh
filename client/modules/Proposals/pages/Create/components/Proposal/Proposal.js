import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class Proposal extends React.Component {
  // constructor (props) {
  //   super(props)
  //   this.state = { }
  // }
  render () {
    return (
      <div>
        Proposal Page
      </div>
    )
  }
}

const mapStateToProps = (state) => { return {} }
const mapDispatchToProps = (dispatch) => { return {} }
// Proposal.propTypes = {}
export default connect(mapStateToProps, mapDispatchToProps)(Proposal)