import React from 'react'
import { Field } from 'redux-form'

import { Input } from '../../../../components/Form/Form'

import { Row, Col } from 'antd'

const state = [
  {
    title: 'Current State',
    subtitle: 'Describe the resources currently available, and how students utilize these resources.',
    field: 'state.current'
  }, {
    title: 'Future State',
    subtitle: 'Describe the new resources being made available to students, including any advantages over current technology.',
    field: 'state.future'
  }
]

const availability = [
  {
    title: 'Current Availability',
    subtitle: 'How many students use these resources per quarter? Include any restrictions that are involved, including hours of operations, mandatory training, and associations with organizations',
    field: 'availability.current'
  }, {
    title: 'Future Availability',
    subtitle: 'How will students be able to use the proposed resources? Include any restrictions that are involved, including hours of operations, mandatory training, and associations with organizations.',
    field: 'availability.future'
  }
]
const strategy = [
  {
    title: 'Organizational Backing',
    subtitle: 'What sort of resources will your organization make available to ensure the success of this project?',
    field: 'strategy.current'
  }, {
    title: 'Implementation Strategy',
    subtitle: 'Briefly describe the implementation process, and include a timeline if possible.',
    field: 'strategy.future'
  }
]
const outreach = [
  {
    title: 'Prior Efforts',
    subtitle: 'Describe efforts to receive departmental funding and community endorsements for this project and similar initiatives.',
    field: 'outreach.current'
  }, {
    title: 'Outreach Strategy',
    subtitle: 'If approved, how will you reach out to the student community and inform them about this resource.',
    field: 'outreach.future'
  }
]
const risk = [
  {
    title: 'Current Risks',
    subtitle: 'Are there any current concerns regarding privacy or security? Have you scoped out insurance for the proposed technology?',
    field: 'risk.current'
  }, {
    title: 'Proposed Mitigations',
    subtitle: 'If approved, how will you secure the systems and technology for this project.',
    field: 'risk.future'
  }
]

import styles from './ProjectPlan.css'
class ProjectPlan extends React.Component {
  render () {
    return (
      <div>
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
              <Field name={`body.plan.${e.field}`} component={Input} type='textarea' rows={6} />
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
              <Field name={`body.plan.${e.field}`} component={Input} type='textarea' rows={6} />
            </Col>
          ))}
        </Row>
        <Row gutter={64}>
          <h2>Project Strategy</h2>
          <p><em>
            How can your organization back this project? What's the overall strategy?
          </em></p>
          {strategy.map((e, i) => (
            <Col key={i} className='gutter-row' xs={24} md={12}>
              <h2 className={styles['subheader']}>{e.title}</h2>
              <p><em>
                {e.subtitle}
              </em></p>
              <Field name={`body.plan.${e.field}`} component={Input} type='textarea' rows={6} />
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
              <Field name={`body.plan.${e.field}`} component={Input} type='textarea' rows={6} />
            </Col>
          ))}
        </Row>
        <Row gutter={64}>
          <h2>Risk Factors</h2>
          <p><em>
            How are you managing risks and concerns?
          </em></p>
          {risk.map((e, i) => (
            <Col key={i} className='gutter-row' xs={24} md={12}>
              <h2 className={styles['subheader']}>{e.title}</h2>
              <p className={styles['prompt']}><em>
                {e.subtitle}
              </em></p>
              <Field name={`body.plan.${e.field}`} component={Input} type='textarea' rows={6} />
            </Col>
          ))}
        </Row>
      </div>
    )
  }
}

export default ProjectPlan
