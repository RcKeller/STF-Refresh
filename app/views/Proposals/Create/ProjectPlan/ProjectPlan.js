import React from 'react'

import { Row, Col, Collapse, Icon, Alert, Form, Input, Switch, Select } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
const Panel = Collapse.Panel

const state = [
  {
    field: 'plan.state.current',
    title: 'Current State',
    subtitle: 'Describe the resources currently available, and how students utilize these resources.'
  }, {
    field: 'plan.state.future',
    title: 'Future State',
    subtitle: 'Describe the new resources being made available to students, including any advantages over current technology.'
  }
]

const availability = [
  {
    field: 'plan.availability.current',
    title: 'Current Availability',
    subtitle: 'How many students use these resources per quarter? Include any restrictions that are involved, including hours of operations, mandatory training, and associations with organizations'
  }, {
    field: 'plan.availability.future',
    title: 'Future Availability',
    subtitle: 'How will students be able to use the proposed resources? Include any restrictions that are involved, including hours of operations, mandatory training, and associations with organizations.'
  }
]
const strategy = [
  {
    field: 'plan.strategy.current',
    title: 'Organizational Backing',
    subtitle: 'What sort of resources will your organization make available to ensure the success of this project?'
  }, {
    field: 'plan.strategy.future',
    title: 'Implementation Strategy',
    subtitle: 'Briefly describe the implementation process, and include a timeline if possible.'
  }
]
const outreach = [
  {
    field: 'plan.outreach.current',
    title: 'Prior Efforts',
    subtitle: 'Describe efforts to receive departmental funding and community endorsements for this project and similar initiatives.'
  }, {
    field: 'plan.outreach.future',
    title: 'Outreach Strategy',
    subtitle: 'If approved, how will you reach out to the student community and inform them about this resource.'
  }
]
const risk = [
  {
    field: 'plan.risk.current',
    title: 'Current Risks',
    subtitle: 'Are there any current concerns regarding privacy or security? Have you scoped out insurance for the proposed technology?'
  }, {
    field: 'plan.risk.future',
    title: 'Proposed Mitigations',
    subtitle: 'If approved, how will you secure the systems and technology for this project.'
  }
]

import styles from './ProjectPlan.css'
class ProjectPlan extends React.Component {
  render ({ form, proposal } = this.props) {
    //  Helper functions - these return bools for styling components based on validation
    const feedback = (field) => form.isFieldTouched(field)
    const help = (field) => (form.isFieldTouched(field) && form.getFieldError(field)) || ''
    // NOTE: If you don't use a collapse, this looks like a massive, unorganized wall of text. Hence the usage.
    return (
      <div>
        <h1>Project Plan</h1>
        <p>
          <Collapse>
            <Panel header={<h2> State Analysis</h2>} key='1'>
              <Row gutter={32}>
                <p>Tell us...</p>
                {state.map((element, i) => (
                  <Col key={i} className='gutter-row' xs={24} md={12} >
                    <h3>{element.title}</h3>
                    <em>{element.subtitle}</em>
                    <FormItem
                      hasFeedback={feedback(element.field)} help={help(element.field)}
                    >
                      {form.getFieldDecorator(element.field, {
                        rules: [{ required: true, message: 'Required.' }]
                      })(
                        <Input type='textarea' rows={6} />
                      )}
                    </FormItem>
                  </Col>
                ))}
              </Row>
            </Panel>
          </Collapse>
        </p>
      </div>
    )
  }
}

export default ProjectPlan

/*

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

*/
