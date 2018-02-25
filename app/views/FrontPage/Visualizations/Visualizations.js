import React from 'react'
// import PropTypes from 'prop-types'
// import { connect } from 'react-redux'

import { Row, Col } from 'antd'

import Funding from './Funding/Funding'
import Statistics from './Statistics/Statistics'

/*
DATA VISUALIZATIONS
Higher order component, layout for frontpage data vis
*/
// @connect(state => ({
//   screen: state.screen
// }))
class Visualizations extends React.Component {
  static propTypes = {}
  static defaultProps = {}
  render (
    { screen } = this.props
  ) {
    // {/* Data Vis
    // - Funding Allocated this Year
    // - Funding Remaining
    // - Chance of funding
    // - Projects Visualized
    // - Items Visualized */}
    //  TODO: Abstract higher level facts to config
    return (
      <section>
        <br />
        <Row type='flex' justify='space-between' align='bottom'>
          <Col sm={24} lg={10}>
            <Funding />
          </Col>
          <Col sm={24} lg={14}>
            <Statistics />
          </Col>
        </Row>
      </section>
    )
  }
}

export default Visualizations
