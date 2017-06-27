import React from 'react'

import { Row, Col, Collapse, Form, Input } from 'antd'
const FormItem = Form.Item
const Panel = Collapse.Panel

const plan = [
  {
    title: 'State Analysis',
    subtitle: 'Tell us about...',
    current: {
      field: 'body.plan.state.current',
      title: 'Current State',
      subtitle: 'Describe the resources currently available, and how students utilize these resources.'
    },
    future: {
      field: 'body.plan.state.future',
      title: 'Future State',
      subtitle: 'Describe the new resources being made available to students, including any advantages over current technology.'
    }
  },
  {
    title: 'Service Availability',
    subtitle: 'What sort of technology is currently available, and how will this change?',
    current: {
      field: 'body.plan.availability.current',
      title: 'Current Availability',
      subtitle: 'How many students use these resources per quarter? Include any restrictions that are involved, including hours of operations, mandatory training, and associations with organizations'
    },
    future: {
      field: 'body.plan.availability.future',
      title: 'Future Availability',
      subtitle: 'How will students be able to use the proposed resources? Include any restrictions that are involved, including hours of operations, mandatory training, and associations with organizations.'
    }
  },
  {
    title: 'Student Outreach',
    subtitle: 'Student technology is great, but we also need to connect with the community. How are you working to make sure students are aware of these resources?',
    current: {
      field: 'body.plan.outreach.current',
      title: 'Prior Efforts',
      subtitle: 'Describe efforts to receive departmental funding and community endorsements for this project and similar initiatives.'
    },
    future: {
      field: 'body.plan.outreach.future',
      title: 'Outreach Strategy',
      subtitle: 'If approved, how will you reach out to the student community and inform them about this resource.'
    }
  },
  {
    title: 'Implementation Strategy',
    subtitle: 'What sort of support have you gathered?',
    current: {
      field: 'body.plan.strategy.current',
      title: 'Organizational Backing',
      subtitle: 'What sort of resources will your organization make available to ensure the success of this project?'
    },
    future: {
      field: 'body.plan.strategy.future',
      title: 'Implementation Strategy',
      subtitle: 'Briefly describe the implementation process, and include a timeline if possible.'
    }
  },
  {
    title: 'Risk Assessment',
    subtitle: 'How are we accounting for scenarios such as abuse, theft, or negigent use of technology?',
    current: {
      field: 'body.plan.risk.current',
      title: 'Current Risks',
      subtitle: 'Are there any current concerns regarding privacy or security? Have you scoped out insurance for the proposed technology?'
    },
    future: {
      field: 'body.plan.risk.future',
      title: 'Proposed Mitigations',
      subtitle: 'If approved, how will you secure the systems and technology for this project.'
    }
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
        <Collapse className={styles['collapse']} defaultActiveKey={['0', '1', '2', '3', '4']} >
          {plan.map((area, i) => (
            <Panel key={i} header={<h2>{area.title}</h2>} >
              <p>{area.subtitle}</p>
              <Row gutter={32}>
                <Col className='gutter-row' xs={24} md={12} >
                  <h3>{area.current.title}</h3>
                  <em>{area.current.subtitle}</em>
                  <FormItem
                    hasFeedback={feedback(area.current.field)} help={help(area.current.field)}
                  >
                    {form.getFieldDecorator(area.current.field, {
                      rules: [{ required: true, message: 'Required.' }]
                    })(
                      <Input type='textarea' rows={6} />
                    )}
                  </FormItem>
                </Col>
                <Col className='gutter-row' xs={24} md={12} >
                  <h3>{area.future.title}</h3>
                  <em>{area.future.subtitle}</em>
                  <FormItem
                    hasFeedback={feedback(area.future.field)} help={help(area.future.field)}
                  >
                    {form.getFieldDecorator(area.future.field, {
                      rules: [{ required: true, message: 'Required.' }]
                    })(
                      <Input type='textarea' rows={6} />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Panel>
          ))}
        </Collapse>
      </div>
    )
  }
}

export default ProjectPlan

/*

{/* <p>
  <Collapse>
    <Panel header={<h2> State Analysis</h2>} key='1'>
      <Row gutter={32}>
        <p>Tell us...</p>
        {Object.keys(plan).forEach((element, i) => (
          <Col key={i} className='gutter-row' xs={24} md={12} >
            <h3>{plan[element].title}</h3>
            <em>{plan[element].subtitle}</em>
            <FormItem
              hasFeedback={feedback(plan[element].field)} help={help(plan[element].field)}
            >
              {form.getFieldDecorator(plan[element].field, {
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
*/

/*

{/* {area.elements.state.map((element, i) => (
  <Col key={i} className='gutter-row' xs={24} md={12} >
    <h3>{plan[element].title}</h3>
    <em>{plan[element].subtitle}</em>
    <FormItem
      hasFeedback={feedback(plan[element].field)} help={help(plan[element].field)}
    >
      {form.getFieldDecorator(plan[element].field, {
        rules: [{ required: true, message: 'Required.' }]
      })(
        <Input type='textarea' rows={6} />
      )}
    </FormItem>
  </Col>
))} }
*/

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
        <Field name={`body.body.plan.${e.field}`} component={Input} type='textarea' rows={6} />
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
        <Field name={`body.body.plan.${e.field}`} component={Input} type='textarea' rows={6} />
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
        <Field name={`body.body.plan.${e.field}`} component={Input} type='textarea' rows={6} />
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
        <Field name={`body.body.plan.${e.field}`} component={Input} type='textarea' rows={6} />
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
        <Field name={`body.body.plan.${e.field}`} component={Input} type='textarea' rows={6} />
      </Col>
    ))}
  </Row>

*/
