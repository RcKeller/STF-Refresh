import React from 'react'

import { Row, Col, Icon, Alert, Form, Input, Switch, Select } from 'antd'
const FormItem = Form.Item
const Option = Select.Option

const impactTypes = [
  {
    field: 'overview.impact.academic',
    title: 'Academic Experience',
    subtitle: 'How will this project enrich a student’s learning environment and experience?'
  }, {
    field: 'overview.impact.research',
    title: 'Research Involvement',
    subtitle: 'Can this project be used for scholarly research?'
  }, {
    field: 'overview.impact.career',
    title: 'Career Development',
    subtitle: 'Can this technology be used to further a student’s career?'
  }
]

const wideLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
}
const slimLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 3 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 7 } }
}

function hasErrors (fields) {
  return Object.keys(fields).some(field => fields[field])
}

import styles from './Overview.css'
class Overview extends React.Component {
  render ({ form, proposal } = this.props) {
    //  Helper functions - these return bools for styling components based on validation
    const feedback = (field) => form.isFieldTouched(field)
    const help = (field) => (form.isFieldTouched(field) && form.getFieldError(field)) || ''
    return (
      <div>
        <h1>Proposal Overview</h1>
        <FormItem label='Abstract' {...wideLayout}
          hasFeedback={feedback('overview.abstract')} help={help('overview.abstract')}
        >
          {form.getFieldDecorator('overview.abstract', {
            rules: [{ required: true, message: 'An abstract is requried.' }]
          })(
            <Input type='textarea' rows={6} />
          )}
        </FormItem>
        <FormItem label='Objectives' {...wideLayout}
          hasFeedback={feedback('overview.objectives')} help={help('overview.objectives')}
        >
          {form.getFieldDecorator('overview.objectives', {
            rules: [{ required: true, message: 'Objectives are requried.' }]
          })(
            <Input type='textarea' rows={4} />
          )}
        </FormItem>
        <FormItem label='Justification' {...wideLayout}
          hasFeedback={feedback('overview.justification')} help={help('overview.justification')}
        >
          {form.getFieldDecorator('overview.justification', {
            rules: [{ required: true, message: 'The overall justification is requried.' }]
          })(
            <Input type='textarea' rows={4} />
          )}
        </FormItem>
        <Row gutter={32}>
          {impactTypes.map((impact, i) => (
            <Col key={i} className='gutter-row' xs={24} md={8}>
              <h3>{impact.title}</h3>
              <p className={styles['subtitle']}><em>{impact.subtitle}</em></p>
              <FormItem
                hasFeedback={feedback(impact.field)} help={help(impact.field)}
              >
                {form.getFieldDecorator(impact.field, {
                  rules: [{ required: true, message: `An overview for student ${impact.field} impact is required.` }]
                })(
                  <Input type='textarea' rows={4} />
                )}
              </FormItem>
            </Col>
          ))}
        </Row>
      </div>
    )
  }
}

export default Overview

/*
<div>
  <Row gutter={64}>
    <Col className='gutter-row' xs={24} md={12}>
      <h2>Abstract</h2>
      <p><em>
        A brief summary of the proposal and the technology being made available to students.
      </em></p>
      <Field name='body.overview.abstract' component={Input} type='textarea' rows={6} />
    </Col>
    <Col className='gutter-row' xs={24} md={12}>
      <h2>Key Objectives</h2>
      <p><em>
        The changes proposed and the desired outcome.
      </em></p>
      <Field name='body.overview.objectives' component={Input} type='textarea' rows={6} />
    </Col>
  </Row>
  <Row>
    <Col xs={24}>
      <h2>Core Justification</h2>
      <p><em>
        Briefly describe the outstanding student need for this technology and the justification for this project.
      </em></p>
      <Field name='body.overview.justification' component={Input} type='textarea' rows={4} />
    </Col>
  </Row>
  <Row gutter={32}>
    <Col xs={24}>
      <h2>Student Impact</h2>
      <p><em>
        Describe the impact on the student academic experience in the following areas. Not every proposal will affect all areas.
      </em></p>
    </Col>
    {impactTypes.map((impact, i) => (
      <Col key={i} className='gutter-row' xs={24} md={8}>
        <h3>{impact.title}</h3>
        <p className={styles['subtitle']}><em>{impact.subtitle}</em></p>
        <Field name={`body.overview.impact.${impact.field}`} component={Input} type='textarea' rows={4} />
      </Col>
    ))}
  </Row>
</div>
*/
