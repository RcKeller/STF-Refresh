import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'

// Import Style
import styles from './ContactUs.css'
class ContactUs extends React.Component {
  render () {
    return (
      <div className={styles['contact-us']}>
        <p id='simple-first'>
          We're here if you need us. Before reaching out, please consider learning more <Link to='/about'>about the STF</Link> first, and then viewing our <Link to='/faq'>Frequently Asked Questions</Link>. Otherwise, feel free to contact us at any of the locations below.
        </p>
        <Row>
          <Col xs={12} sm={6} md={4}>
            <ul className={styles['no-style']}>
              <li>Bryce Knolton | Chair</li>
              <li><Link to='mailto:STFChair@uw.edu'>STFChair@uw.edu</Link></li>
            </ul>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <ul className={styles['no-style']}>
              <li>Rajiv Raina | Operations and Finance Manager</li>
              <li><Link to='mailto:TechFee@uw.edu'>
                TechFee@uw.edu
              </Link></li>
            </ul>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <ul className={styles['no-style']}>
              <li>Sanjay Sagar | Web Developer</li>
              <li><Link to='mailto:STFCWeb@uw.edu'>
                STFCWeb@uw.edu
              </Link></li>
            </ul>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <ul className={styles['no-style']}>
              <li>Alec Meade | Proposal Officer</li>
              <li><Link to='mailto:STFAgent@uw.edu'>STFAgent@uw.edu</Link></li>
            </ul>
          </Col>
        </Row>
        <h3>Physical Location</h3>
        <ul className={styles['no-style']}>
          <li>University of Washington</li>
          <li>Husky Union Building, RM 305B</li>
          <li>4001 NE Stevens Way</li>
          <li>Seattle, WA 98195</li>
        </ul>
      </div>
    )
  }
}

const mapStateToProps = (state) => { return {} }
const mapDispatchToProps = (dispatch) => { return {} }
ContactUs.propTypes = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactUs)
