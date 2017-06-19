import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {Field, reduxForm} from 'redux-form'

import { Input } from '../../../../components/Form/Form'

import { Row, Col } from 'antd'

const state = [
  {
    title: 'Current State',
    subtitle: 'Describe the resources currently available, and how students utilize these resources.',
    prefix: 'currentState'
  }, {
    title: 'Future State',
    subtitle: 'Describe the new resources being made available to students, including any advantages over current technology.',
    prefix: 'futureState'
  }
]

const availability = [
  {
    title: 'Current Availability',
    subtitle: 'How many students use these resources per quarter? Include any restrictions that are involved, including hours of operations, mandatory training, and associations with organizations',
    prefix: 'currentAvailability'
  }, {
    title: 'Future State',
    subtitle: 'How will students be able to use the proposed resources? Include any restrictions that are involved, including hours of operations, mandatory training, and associations with organizations.',
    prefix: 'futureAvailability'
  }
]

const plan = [
  {
    title: 'Organizational Backing',
    subtitle: 'What sort of resources will your organization make available to ensure the success of this project?',
    prefix: 'currentPlan'
  }, {
    title: 'Future State',
    subtitle: 'Briefly describe the implementation process, and include a timeline if possible.',
    prefix: 'futurePlan'
  }
]
const outreach = [
  {
    title: 'Prior Outreach',
    subtitle: 'Describe efforts to receive departmental funding and community endorsements for this project and similar initiatives.',
    prefix: 'currentOutreach'
  }, {
    title: 'Outreach Strategy',
    subtitle: 'If approved, how will you reach out to the student community and inform them about this resource.',
    prefix: 'futureOutreach'
  }
]

import styles from './ProjectPlan.css'
const ProjectPlan = props => {
  const {handleSubmit, pristine, reset, submitting} = props
  return (
    <form onSubmit={handleSubmit}>
      <Row gutter={64}>
        <h2>State of Technology</h2>
        <p><em>
          Tell us about how the state of student technology can change.
        </em></p>
        {state.map((e, i) => (
          <Col key={i} className='gutter-row' xs={24} md={12}>
            <h2 className={styles['subheader']}>{e.title}</h2>
            <p className={styles['prompt']}><em>
              {e.subtitle}
            </em></p>
            <Field name={`${e.prefix}`} component={Input} type='textarea' rows={6} />
          </Col>
        ))}
      </Row>
      <Row gutter={64}>
        <h2>Service Availability</h2>
        <p><em>
          How are students using this technology without this project, and how could that change?
        </em></p>
        {availability.map((e, i) => (
          <Col key={i} className='gutter-row' xs={24} md={12}>
            <h2 className={styles['subheader']}>{e.title}</h2>
            <p className={styles['prompt']}><em>
              {e.subtitle}
            </em></p>
            <Field name={`${e.prefix}`} component={Input} type='textarea' rows={6} />
          </Col>
        ))}
      </Row>
      <Row gutter={64}>
        <h2>Project Strategy</h2>
        <p><em>
          How can your organization back this project? What's the overall strategy?
        </em></p>
        {plan.map((e, i) => (
          <Col key={i} className='gutter-row' xs={24} md={12}>
            <h2 className={styles['subheader']}>{e.title}</h2>
            <p><em>
              {e.subtitle}
            </em></p>
            <Field name={`${e.prefix}`} component={Input} type='textarea' rows={6} />
          </Col>
        ))}
      </Row>
      <Row gutter={64}>
        <h2>Student Outreach</h2>
        <p><em>
          How does your organization interact with the student community?
        </em></p>
        {outreach.map((e, i) => (
          <Col key={i} className='gutter-row' xs={24} md={12}>
            <h2 className={styles['subheader']}>{e.title}</h2>
            <p className={styles['prompt']}><em>
              {e.subtitle}
            </em></p>
            <Field name={`${e.prefix}`} component={Input} type='textarea' rows={6} />
          </Col>
        ))}
      </Row>
    </form>
  )
}

const validate = values => {
  const errors = {}
  return errors
}
export default reduxForm({
  form: 'ProposalsCreateProjectPlan',
  validate
})(ProjectPlan)
