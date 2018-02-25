import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import { Row, Col } from 'antd'

import api from '../../../services'

import Funding from './Funding/Funding'
import Statistics from './Statistics/Statistics'

/*
DATA VISUALIZATIONS
Higher order component, layout for frontpage data vis
*/
@connect(state => ({
  funding: state.db.funding,
  year: state.config.year,
  screen: state.screen
}))
class Visualizations extends React.Component {
  static propTypes = {
    screen: PropTypes.object
  }
  static defaultProps = {
    screen: {}
  }
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
        <Row type='flex' justify='space-between' align='top'>
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
