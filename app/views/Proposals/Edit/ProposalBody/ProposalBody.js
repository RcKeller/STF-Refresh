import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Row, Col, Form, Input, Switch, Button, Alert, message } from 'antd'
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

@compose(
  connect(
    state => ({
      parent: state.db.proposal._id,
      body: state.db.proposal.body
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class ProposalBody extends React.Component {
  componentDidUpdate (prevProps, prevState) {
    //  Load fields from server
    if (!prevProps.parent && this.props.parent) {
      this.props.form.validateFields()
    }
  }
  // componentDidUpdate (prevProps, prevState) {
  //   //  Load fields from server
  //   console.log('REACHED UPDATE')
  //   if (!prevProps.parent && this.props.parent) {
  //     const { overview, plan } = this.props
  //     console.log(...[overview, plan])
  //     this.props.form.setFieldsValue(...[overview, plan])
  //     //  Run validation, disabling submit buttons
  //     this.props.form.validateFields()
  //   }
  // }
  handleSubmit = (e) => {
    e.preventDefault()
    let { form, api, parent } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
        api.patch('project',
          { proposal: parent, ...values },
          { id: parent }
        )
        .then(message.success('Introduction updated!'))
        .catch(err => {
          message.warning('Introduction failed to update - Unexpected client error')
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
              <Input type='textarea' rows={4} />
            )}
          </FormItem>
          <FormItem label='Objectives' {...layout} hasFeedback={feedback(form, 'overview.objectives')} help={help(form, 'overview.objectives')} >
            {form.getFieldDecorator('overview.objectives', rules.required)(
              <Input type='textarea' rows={4} />
            )}
          </FormItem>
          <FormItem label='Justification' {...layout} hasFeedback={feedback(form, 'overview.justification')} help={help(form, 'overview.justification')} >
            {form.getFieldDecorator('overview.justification', rules.required)(
              <Input type='textarea' rows={4} />
            )}
          </FormItem>
          <h2>Impact</h2>
          <Row gutter={32}>
            <Col className='gutter-row' xs={24} md={8}>
              <h3>Academic Experience</h3>
              <p><em>How will this project enrich a student’s learning environment and experience?</em></p>
              <FormItem hasFeedback={feedback(form, 'overview.impact.academic')} help={help(form, 'overview.impact.academic')} >
                {form.getFieldDecorator('overview.impact.academic', rules.required)(
                  <Input type='textarea' rows={4} />
                )}
              </FormItem>
            </Col>
            <Col className='gutter-row' xs={24} md={8}>
              <h3>Research Opportunities</h3>
              <p><em>Can this project be used for scholarly research?</em></p>
              <FormItem hasFeedback={feedback(form, 'overview.impact.research')} help={help(form, 'overview.impact.research')} >
                {form.getFieldDecorator('overview.impact.research', rules.required)(
                  <Input type='textarea' rows={4} />
                )}
              </FormItem>
            </Col>
            <Col className='gutter-row' xs={24} md={8}>
              <h3>Career Development</h3>
              <p><em>Can this technology be used to further a student’s career?</em></p>
              <FormItem hasFeedback={feedback(form, 'overview.impact.career')} help={help(form, 'overview.impact.career')} >
                {form.getFieldDecorator('overview.impact.career', rules.required)(
                  <Input type='textarea' rows={4} />
                )}
              </FormItem>
            </Col>
          </Row>
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
  parent: PropTypes.string
}
export default ProposalBody
