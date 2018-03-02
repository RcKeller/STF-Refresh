import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectRequest } from 'redux-query'

import api from '../../../services'
import { Loading } from '../../../components'

import { Row, Col, Progress, Alert } from 'antd'

const currency = value => `$${Number.parseInt(value).toLocaleString()}`

/*
BLOCK PAGE: .../blocks/:number
Renders a block / continuous funding article.
They're like short proposals with a general scope.
Per bylaws, the content and format CAN NEVER CHANGE.
*/
import styles from './Block.css'
@compose(
  connect((state, props) => ({
    ...state.db.block
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
  static defaultProps = {
    _id: '',
    year: 2000,
    number: 0,
    title: 'Block',
    category: '',
    organization: '',
    status: '',
    asked: 0,
    received: 0,
    contacts: [],
    invitation: '',
    body: {
      invitation: '',
      overview: {
        history: '',
        vision: '',
        goals: ''
      },
      plan: {
        structure: '',
        services: '',
        accessibility: ''
      },
      funding: {
        budget: '',
        scope: '',
        external: ''
      },
      reliability: {
        risks: '',
        mitigations: ''
      }
    }
  }
  render (
    { params, block } = this.props
  ) {
    const { _id: id, date, year, number, title, category, organization, status, asked, received, contacts, body } = block || {}
    const { invitation, overview, plan, funding, reliability } = body || {}
    const { history, vision, goals } = overview || {}
    const { structure, services, accessibility } = plan || {}
    const { budget, scope, external } = funding || {}
    const { risks, mitigations } = reliability || {}
    console.warn(this.props)
    return (
      <article className={styles['article']}>
        <Helmet title={title || 'Block'} />
        <Loading render={id}
          title='Block Agreement'
          tip={`Loading Block ${params.number}...`}
        >
          <div>
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
              {Array.isArray(contacts) && contacts.map(c => (
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
                  <p>{history}</p>
                </Col>
                <Col className='gutter-row' xs={24} md={12}>
                  <h4>Vision Statement</h4>
                  <p>{vision}</p>
                  <h4>Goals & Objectives</h4>
                  <p>{goals}</p>
                </Col>
              </Row>
            </section>
            <section>
              <h1>Project Plan</h1>
              <Row gutter={32}>
                <Col className='gutter-row' xs={24} md={12}>
                  <h3>Organizational Structure</h3>
                  <p>{structure}</p>
                </Col>
                <Col className='gutter-row' xs={24} md={12}>
                  <h4>Services Provided</h4>
                  <p>{services}</p>
                  <h4>Access & Availability</h4>
                  <p>{accessibility}</p>
                </Col>
              </Row>
            </section>
            <section>
              <h1>{`Annual Funding: ${currency(asked || received)}*`}</h1>
              <em>*Estimated based on budget projections and project scope</em>
              <Row gutter={32}>
                <Col className='gutter-row' xs={24} md={12}>
                  <h3>Justification</h3>
                  <p>{budget}</p>
                </Col>
                <Col className='gutter-row' xs={24} md={12}>
                  <h4>Scope of Funding</h4>
                  <p>{scope}</p>
                  <h4>External Support</h4>
                  <p>{external}</p>
                </Col>
              </Row>
            </section>
            <section>
              <h2>Reliability</h2>
              <Row gutter={32}>
                <Col className='gutter-row' xs={24} md={12}>
                  <h3>Turnover Plan</h3>
                  <p>{risks}</p>
                </Col>
                <Col className='gutter-row' xs={24} md={12}>
                  <h3>Contingency Plan</h3>
                  <p>{mitigations}</p>
                </Col>
              </Row>
            </section>
          </div>
        </Loading>
      </article>
    )
  }
}

export default Block
