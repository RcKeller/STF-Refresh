import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'

import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'

import Button from 'react-bootstrap/lib/Button'

import Jumbotron from '../../components/Jumbotron/Jumbotron'

// Import Style
import styles from './FrontPage.css'
class FrontPage extends React.Component {
  render () {
    return (
      <div>
        <Jumbotron image={'test'} title='Student Tech Fee' />
        <Row>
          <Col sm={9}>
            <section>
              <h2>Hearing Spring Proposals</h2>
              <p>
              The committee is in the process of hearing Spring proposals. Please wait for an email from techfee@uw.edu detailing your proposal date.
            </p>
              <Row>
                <Col sm={6}>
                  <LinkContainer to='/docs/Summary of Changes.pdf'>
                    <Button bsStyle='primary' bsSize='small'>Summary of Changes</Button>
                  </LinkContainer>
                </Col>
                <Col sm={6}>
                  <LinkContainer to='/docs/Current Request for Proposals.pdf'>
                    <Button bsStyle='primary' bsSize='small'>Request for Proposals</Button>
                  </LinkContainer>
                </Col>
              </Row>
              <hr />
            </section>
          </Col>
          <Col sm={9}>
            <section>
              <h2>STF Workshops</h2>
              <p>
              Workshops are a great oppurtunity to meet STF leadership, ask questions in a low-stakes setting, and craft a proposal. We are holding workshops on <b>March 10th, 14th, and 29th</b>. View our <Link to='/calendar'>calendar</Link> for details
            </p>
            </section>
          </Col>
          <Col sm={9}>
            <section>
              <h3>Supplemental Reminder</h3>
              <p>
              If you plan on writing a supplemental, make sure to submit it when you are finished ('Submit Supplemental' on the Edit Supplemental page). If you are have any issues or questions, please email us.
            </p>
              <hr />
            </section>
          </Col>
          <div style={{display: 'table-cell', float: 'none'}} className='col-sm-3'>
            <h3>Meetings</h3>
            <ul className={styles['no-style']}>
              <li>Every Monday, 3:30 - 5:30 PM</li>
              <li>Location: HUB 303</li>
            </ul><Link to='/calendar'>View All Events</Link>
          </div>
          <Col sm={9}>
            <section>
              <h3>About</h3>
              <p>
              The Student Technology Fee and its committee appropriate over $4 million to the students of the University of Washington. Every student enrolled at UW pays a small fee per quarter, which is aggregated and then paid out to supplement the technological requirements of the student body.
            </p>
              <Row style={{paddingBottom: 15}}>
                <Col sm={6}>
                  <LinkContainer to='/about'>
                    <Button bsStyle='primary' bsSize='small'>Read More</Button>
                  </LinkContainer>
                </Col>
              </Row>
            </section>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}
const mapDispatchToProps = (dispatch) => {
  return {}
}
// FrontPage.propTypes = {
// }
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FrontPage)
