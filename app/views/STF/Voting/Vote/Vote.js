import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import api from '../../../../services'

import { Row, Col, Spin, Collapse } from 'antd'
const Panel = Collapse.Panel
/*
There are two kinds of meetings:
- QA meetings (metrics, no votes)
- Voting meetings (votes, may have metrics but probably not)
*/
@connect(
    //  Might seem counterintuitive, but we're connecting to a manifest and pulling its proposal data.
    (state, props) => ({
      manifest: state.db.manifests[props.index],
      user: state.user
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
)
class Vote extends React.Component {
  render (
    { manifest } = this.props
  ) {
    const { proposal } = manifest
    const { id, title, organization, uac, year, number, date, comments, body } = proposal
    console.log(body)
    body && Object.keys(body.plan).forEach((key, i) => console.log(body.plan[key].current, body.plan[key].future))
    return (
      <section>
        {!proposal
          ? <Spin size='large' tip='Loading...' />
          : <div>
            <h1>{uac ? title : `${title} (UAC)`}</h1>
            {uac && <h2>Universal Access Committee</h2>}
            <h3>For {organization}</h3>
            <h6 id={id}>{`ID: ${year}-${number}`}</h6>
            <ul>
              <li>Date: {date}</li>
              <li>Endorsements: {comments.length}</li>
            </ul>
            {body &&
              <div>
                <Row gutter={32}>
                  <Col className='gutter-row' xs={24} md={12}>
                    <h1>Overview</h1>
                    <p>{body.overview.abstract}</p>
                  </Col>
                  <Col className='gutter-row' xs={24} md={12}>
                    <h3>Objectives</h3>
                    <p>{body.overview.objectives}</p>
                    <h3>Core Justification</h3>
                    <p>{body.overview.justification}</p>
                  </Col>
                </Row>
                <h2>Impact</h2>
                <Row gutter={32}>
                  <Col className='gutter-row' xs={24} md={8}>
                    <h5><em>Academic Experience</em></h5>
                    <p>{body.overview.impact.academic}</p>
                  </Col>
                  <Col className='gutter-row' xs={24} md={8}>
                    <h5><em>Research Opportunities</em></h5>
                    <p>{body.overview.impact.research}</p>
                  </Col>
                  <Col className='gutter-row' xs={24} md={8}>
                    <h5><em>Career Development</em></h5>
                    <p>{body.overview.impact.career}</p>
                  </Col>
                </Row>
                <h1>Project Plan</h1>
                {body.plan &&
                  <Collapse bordered={false} >
                    {Object.keys(body.plan).forEach((key, i) => (
                      <Panel header={i} key={i}>
                        <div>
                        <h3>Current</h3>
                        <p>
                          {body.plan[key].current}
                        </p>
                        <h3>Future</h3>
                        <p>
                          {body.plan[key].future}
                        </p>
                      </div>
                      </Panel>
                    ))}
                  </Collapse>
                }
              </div>
            }
          </div>
        }
      </section>
    )
  }
}
Vote.propTypes = {
  manifest: PropTypes.object,
  user: PropTypes.object
}
export default Vote
