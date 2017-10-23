import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'

import { Row, Col, Spin, Progress, Collapse, Alert } from 'antd'
const Panel = Collapse.Panel

const currency = value => `$${Number.parseInt(value).toLocaleString()}`
const capitalize = (word) => word[0].toUpperCase() + word.substr(1)

import styles from './Block.css'
@compose(
  connect((state, props) => ({
    block: state.db.block || {}
  })),
  connectRequest(props => api.get('block', {
    query: { number: props.params.number },
    populate: ['contacts']
  }))
)
class Block extends React.Component {
  static propTypes = {
    block: PropTypes.object
  }
  render ({ block } = this.props) {
    const { _id: id, date, year, number, title, category, organization, status, asked, received, contacts, body } = block
    const { invitation, overview, plan, funding, reliability } = body || {}
    return (
      <article className={styles['article']}>
        <Helmet title={title || 'Block'} />
        {!id
          ? <Spin size='large' tip='Loading...' />
          : <div>
            <Row gutter={32} type='flex' justify='space-between' align='top' >
              <Col className='gutter-row' xs={24} md={12} lg={16} >
                <h1>{title}</h1>
                <h3>For {organization}</h3>
                <h6 id={id} >{`ID: ${year}-${number}`}</h6>
                <Alert type='warning' showIcon={false} banner
                  message={<span><b>Block Funding</b>: This is a block-funding proposal, which is an invite-only funding plan for continuous recepients of STF funding. Block funding often goes to computer labs, technology rental programs, so on and forth.</span>}
                />
              </Col>
              <Col className='gutter-row' xs={24} md={12} lg={8}>
                <div style={{ textAlign: 'right' }}>
                  {status === 'Approved'
                      ? <Progress type='circle' width={200}
                        status='success'
                        percent={100}
                        format={percent => <span>
                          {currency(received)}
                          <h5>{status}</h5>
                        </span>}
                      />
                    : <Progress type='circle' width={200}
                      status='active'
                      format={percent => <span>
                        Status:
                        <h5>{status}</h5>
                      </span>}
                      percent={100}
                    />
                  }
                </div>
              </Col>
            </Row>
            <hr />
            <h5><em>Contact Information</em></h5>
            <ul style={{
              listStyleType: 'disc',
              listStylePosition: 'inside'
            }}>
              {contacts.map(c => (
                <li key={c._id}>
                  <em>{`${c.name}, ${c.title}`}</em>
                </li>
              ))}
            </ul>
            <hr />
            {invitation
              ? <Alert type='success' showIcon={false} banner
                message='Block Induction Invitation'
                description={invitation}
              />
              : <Alert type='info' showIcon={false} banner
                message='In Review'
                description='This block is currently undergoing review, and will have a decision by the end of the academic year.'
              />
            }
            <section>
              <h1>Overview</h1>
              <Row gutter={32}>
                <Col className='gutter-row' xs={24} md={12}>
                  <h3>History</h3>
                  <p>{overview.history}</p>
                </Col>
                <Col className='gutter-row' xs={24} md={12}>
                  <h4>Vision Statement</h4>
                  <p>{overview.vision}</p>
                  <h4>Goals & Objectives</h4>
                  <p>{overview.goals}</p>
                </Col>
              </Row>
            </section>
            <section>
              <h1>Project Plan</h1>
              <Row gutter={32}>
                <Col className='gutter-row' xs={24} md={12}>
                  <h3>Organizational Structure</h3>
                  <p>{plan.structure}</p>
                </Col>
                <Col className='gutter-row' xs={24} md={12}>
                  <h4>Services Provided</h4>
                  <p>{plan.services}</p>
                  <h4>Access & Availability</h4>
                  <p>{plan.accessibility}</p>
                </Col>
              </Row>
            </section>
            <section>
              <h1>{`Annual Funding: ${currency(asked || received)}*`}</h1>
              <em>*Estimated based on budget projections and project scope</em>
              <Row gutter={32}>
                <Col className='gutter-row' xs={24} md={12}>
                  <h3>Justification</h3>
                  <p>{funding.budget}</p>
                </Col>
                <Col className='gutter-row' xs={24} md={12}>
                  <h4>Scope of Funding</h4>
                  <p>{funding.scope}</p>
                  <h4>External Support</h4>
                  <p>{funding.external}</p>
                </Col>
              </Row>
            </section>
            <section>
              <h2>Reliability</h2>
              <Row gutter={32}>
                <Col className='gutter-row' xs={24} md={12}>
                  <h3>Turnover Plan</h3>
                  <p>{reliability.risks}</p>
                </Col>
                <Col className='gutter-row' xs={24} md={12}>
                  <h3>Contingency Plan</h3>
                  <p>{reliability.mitigations}</p>
                </Col>
              </Row>
            </section>
          </div>
        }
      </article>
    )
  }
}

export default Block
