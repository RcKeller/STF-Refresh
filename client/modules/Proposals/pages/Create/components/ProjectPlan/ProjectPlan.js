import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class ProjectPlan extends React.Component {
  // constructor (props) {
  //   super(props)
  //   this.state = { }
  // }
  render () {
    return (
      <div>
        Project Plan
      </div>
    )
  }
}

const mapStateToProps = (state) => { return {} }
const mapDispatchToProps = (dispatch) => { return {} }
// ProjectPlan.propTypes = {}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectPlan)