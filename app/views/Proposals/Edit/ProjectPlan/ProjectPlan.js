import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Row, Col, Icon, Alert, Form, Input, Button, message } from 'antd'
const { TextArea } = Input
const FormItem = Form.Item
const connectForm = Form.create()

import { layout, feedback, rules, disableSubmit } from '../../../../util/form'
import api from '../../../../services'

@compose(
  connect(
    state => ({
      id: state.db.proposal.body && state.db.proposal.body._id,
      proposal: state.db.proposal._id,
      body: state.db.proposal.body
      //  Direct accessing subdoc props that may not exist === crash
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class ProjectPlan extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    form: PropTypes.object,
    api: PropTypes.object,
    proposal: PropTypes.string,
    body: PropTypes.object
  }
  impactFields = [
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
  projectFields = [
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
  componentDidMount () {
    const { form, body } = this.props
    if (body) {
      const { overview, plan } = body
      form.setFieldsValue({ overview, plan })
    } else {
      console.log('placeholder')
      // form.validateFields()
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let { form, api, id, proposal } = this.props
    const values = form.getFieldsValue()
    const project = { proposal, ...values }
    const params = {
      id,
      transform: proposal => ({ proposal }),
      update: ({ proposal: (prev, next) => {
        let change = Object.assign({}, prev)
        change.body = next
        return change
      }})
    }
    params.id
    ? api.patch('project', project, params)
    .then(message.success('Proposal Body updated!', 10))
    .catch(err => {
      message.warning('Proposal Body failed to update - Unexpected client error', 10)
      console.warn(err)
    })
    : api.post('project', project, params)
    .then(message.success('Saved your new plan!', 10))
    .catch(err => {
      message.warning('Proposal Body failed to update - Unexpected client error', 10)
      console.warn(err)
    })
  }

  render (
    { impactFields, projectFields } = this,
    { form, body } = this.props
  ) {
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Alert type='info' banner
            message='Project Plan Format'
            description='We are using a traditional project plan format for our proposals going forward. The committee has decided on this because it covers the questions traditionally addressed in Q&A, and ensures that proposals are comprehensive, covering the full lifecycle of the project. We understand that a lot of these questions may not apply directly to all cases, so for those fields, feel free to write "N/A".'
          />
          <h1>Overview</h1>
          <FormItem label='Abstract' {...layout} hasFeedback={feedback(form, 'overview.abstract')}>
            {form.getFieldDecorator('overview.abstract', rules.required)(
              <TextArea rows={6} />
            )}
          </FormItem>
          <FormItem label='Objectives' {...layout} hasFeedback={feedback(form, 'overview.objectives')}>
            {form.getFieldDecorator('overview.objectives', rules.required)(
              <TextArea rows={4} />
            )}
          </FormItem>
          <FormItem label='Core Justification' {...layout} hasFeedback={feedback(form, 'overview.justification')}>
            {form.getFieldDecorator('overview.justification', rules.required)(
              <TextArea rows={4} />
            )}
          </FormItem>
          <h2>Impact</h2>
          <Row gutter={32}>
            {impactFields.map((impact, i) => (
              <Col key={i} className='gutter-row' xs={24} md={8}>
                <h4>{impact.title}</h4>
                <p><em>{impact.subtitle}</em></p>
                <FormItem hasFeedback={feedback(form, impact.field)}>
                  {form.getFieldDecorator(impact.field, rules.required)(
                    <TextArea rows={3} />
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
                  <FormItem hasFeedback={feedback(form, area.current.field)}>
                    {form.getFieldDecorator(area.current.field, rules.required)(
                      <TextArea rows={4} />
                    )}
                  </FormItem>
                </Col>
                <Col className='gutter-row' xs={24} md={12} >
                  <h4>{area.future.title}</h4>
                  <em>{area.future.subtitle}</em>
                  <FormItem hasFeedback={feedback(form, area.future.field)}>
                    {form.getFieldDecorator(area.future.field, rules.required)(
                      <TextArea rows={4} />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
          ))}
          <FormItem>
            <Button size='large' type='primary'
              onMouseEnter={() => form.validateFields()}
              htmlType='submit' disabled={disableSubmit(form)}
              style={{ width: '100%' }}
              ><Icon type='cloud-upload-o' />Update</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default ProjectPlan
