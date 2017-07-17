import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import _ from 'lodash'

import { Row, Col, Form, Input, Button, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

import { layout, feedback, help, rules, disableSubmit } from '../../../../util/form'
import api from '../../../../services'

const impactFields = [
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
const projectFields = [
  {
    title: 'State Analysis',
    subtitle: 'Tell us about...',
    current: {
      field: 'plan.state.current',
      title: 'Current State',
      subtitle: 'Describe the resources currently available, and how students utilize these resources.'
    },
    future: {
      field: 'plan.state.future',
      title: 'Future State',
      subtitle: 'Describe the new resources being made available to students, including any advantages over current technology.'
    }
  },
  {
    title: 'Service Availability',
    subtitle: 'What sort of technology is currently available, and how will this change?',
    current: {
      field: 'plan.availability.current',
      title: 'Current Availability',
      subtitle: 'How many students use these resources per quarter? Include any restrictions that are involved, including hours of operations, mandatory training, and associations with organizations'
    },
    future: {
      field: 'plan.availability.future',
      title: 'Future Availability',
      subtitle: 'How will students be able to use the proposed resources? Include any restrictions that are involved, including hours of operations, mandatory training, and associations with organizations.'
    }
  },
  {
    title: 'Student Outreach',
    subtitle: 'Student technology is great, but we also need to connect with the community. How are you working to make sure students are aware of these resources?',
    current: {
      field: 'plan.outreach.current',
      title: 'Prior Efforts',
      subtitle: 'Describe efforts to receive departmental funding and community endorsements for this project and similar initiatives.'
    },
    future: {
      field: 'plan.outreach.future',
      title: 'Outreach Strategy',
      subtitle: 'If approved, how will you reach out to the student community and inform them about this resource.'
    }
  },
  {
    title: 'Implementation Strategy',
    subtitle: 'What sort of support have you gathered?',
    current: {
      field: 'plan.strategy.current',
      title: 'Organizational Backing',
      subtitle: 'What sort of resources will your organization make available to ensure the success of this project?'
    },
    future: {
      field: 'plan.strategy.future',
      title: 'Implementation Strategy',
      subtitle: 'Briefly describe the implementation process, and include a timeline if possible.'
    }
  },
  {
    title: 'Risk Assessment',
    subtitle: 'How are we accounting for scenarios such as abuse, theft, or negigent use of technology?',
    current: {
      field: 'plan.risk.current',
      title: 'Current Risks',
      subtitle: 'Are there any current concerns regarding privacy or security? Have you scoped out insurance for the proposed technology?'
    },
    future: {
      field: 'plan.risk.future',
      title: 'Proposed Mitigations',
      subtitle: 'If approved, how will you secure the systems and technology for this project.'
    }
  }
]

@compose(
  connect(
    state => ({
      parent: state.db.proposal._id,
      body: state.db.proposal.body
      //  Direct accessing subdoc props that may not exist === crash
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class ProposalBody extends React.Component {
  componentDidMount () {
    const { form, body } = this.props
    if (body) {
      const { overview, plan } = body
      form.setFieldsValue({ overview, plan })
    }
    form.validateFields()
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let { form, api, parent, body } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        //  Update if the document exists, otherwise create it anew.
        body
        ? api.put(
          'project',
          { proposal: parent, ...values },
          { id: body._id }
        )
        : api.post(
          'project',
          { proposal: parent, ...values }
        )
        .then(message.success('Proposal Body updated!'))
        .catch(err => {
          message.warning('Proposal Body failed to update - Unexpected client error')
          console.warn(err)
        })
      }
    })
  }

  // render ({ form, overview = {}, plan = {} } = this.props) {
  render ({ form, body } = this.props) {
    // console.log('DATA IN:', overview, plan)
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <h1>Overview</h1>
          <FormItem label='Abstract' {...layout} hasFeedback={feedback(form, 'overview.abstract')} help={help(form, 'overview.abstract')} >
            {form.getFieldDecorator('overview.abstract', rules.required)(
              <Input type='textarea' rows={6} />
            )}
          </FormItem>
          <FormItem label='Objectives' {...layout} hasFeedback={feedback(form, 'overview.objectives')} help={help(form, 'overview.objectives')} >
            {form.getFieldDecorator('overview.objectives', rules.required)(
              <Input type='textarea' rows={4} />
            )}
          </FormItem>
          <FormItem label='Core Justification' {...layout} hasFeedback={feedback(form, 'overview.justification')} help={help(form, 'overview.justification')} >
            {form.getFieldDecorator('overview.justification', rules.required)(
              <Input type='textarea' rows={4} />
            )}
          </FormItem>
          <h2>Impact</h2>
          <Row gutter={32}>
            {impactFields.map((impact, i) => (
              <Col key={i} className='gutter-row' xs={24} md={8}>
                <h4>{impact.title}</h4>
                <p><em>{impact.subtitle}</em></p>
                <FormItem hasFeedback={feedback(form, impact.field)} help={help(form, impact.field)} >
                  {form.getFieldDecorator(impact.field, rules.required)(
                    <Input type='textarea' rows={3} />
                  )}
                </FormItem>
              </Col>
            ))}
          </Row>
          <hr />
          <h1>Project Plan</h1>
          {projectFields.map((area, i) => (
            <div key={i}>
              <h2>{area.title}</h2>
              <p>{area.subtitle}</p>
              <Row gutter={32}>
                <Col className='gutter-row' xs={24} md={12} >
                  <h4>{area.current.title}</h4>
                  <em>{area.current.subtitle}</em>
                  <FormItem hasFeedback={feedback(form, area.current.field)} help={help(form, area.current.field)} >
                    {form.getFieldDecorator(area.current.field, rules.required)(
                      <Input type='textarea' rows={4} />
                    )}
                  </FormItem>
                </Col>
                <Col className='gutter-row' xs={24} md={12} >
                  <h4>{area.future.title}</h4>
                  <em>{area.future.subtitle}</em>
                  <FormItem hasFeedback={feedback(form, area.future.field)} help={help(form, area.future.field)} >
                    {form.getFieldDecorator(area.future.field, rules.required)(
                      <Input type='textarea' rows={4} />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
          ))}
          <FormItem>
            <Button size='large' type='primary'
              htmlType='submit' disabled={disableSubmit(form)}
              >Update</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

ProposalBody.propTypes = {
  form: PropTypes.object,
  api: PropTypes.object,
  parent: PropTypes.string,
  body: PropTypes.object
}
export default ProposalBody
