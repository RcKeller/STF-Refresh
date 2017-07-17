import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Row, Col, Form, Icon, Input, Button, Alert, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

import { layout, feedback, help, rules, disableSubmit } from '../../../../util/form'
import api from '../../../../services'

const contactFields = [
  {
    index: 0,
    field: 'primary',
    title: 'Primary Contact',
    subtitle: 'The primary lead and point-of-contact for this project.'
  }, {
    index: 1,
    field: 'budget',
    title: 'Budget Director',
    subtitle: 'Contact for budgetary concerns and handling transfers of funds.'
  }, {
    index: 2,
    field: 'organization',
    title: 'Organizational Head',
    subtitle: 'A departmental head or organization president to officiate this proposal.'
  }, {
    index: 3,
    field: 'student',
    title: 'Student Lead',
    subtitle: 'We recommend that there be at least one student representing a project, as STF funds are intended for student use.'
  }
]

// import styles from './Body.css'
@compose(
  connect(
    state => ({
      parent: state.db.proposal._id,
      contacts: state.db.proposal.contacts
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Contacts extends React.Component {
  // componentDidUpdate (prevProps, prevState) {
  //   //  Load fields from server
  //   console.log('REACHED UPDATE')
  //   if (!prevProps.parent && this.props.parent) {
  //     const { contacts } = this.props
  //     console.log(...[title, category, organization, uac])
  //     this.props.form.setFieldsValue(...[title, category, organization, uac])
  //     //  Run validation, disabling submit buttons
  //     this.props.form.validateFields()
  //   }
  // }
  handleSubmit = (e) => {
    e.preventDefault()
    let { form, api, parent, contacts } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
      }
      // if (!err) {
      //   //  Update if the document exists, otherwise create it anew.
      //   body
      //   ? api.put(
      //     'project',
      //     { proposal: parent, ...values },
      //     { id: body._id }
      //   )
      //   : api.patch(
      //     'project',
      //     { proposal: parent, ...values }
      //   )
      //   .then(message.success('Proposal Body updated!'))
      //   .catch(err => {
      //     message.warning('Proposal Body failed to update - Unexpected client error')
      //     console.warn(err)
      //   })
      // }
    })
  }

  render ({ form, contacts } = this.props) {
    return (
      <Form onSubmit={this.handleSubmit}>
        <h1>Contact Information</h1>
        <Row gutter={32}>
          {contactFields.map((c, i) => (
            <Col key={i} className='gutter-row' xs={24} md={12} lg={6} >
              <h3>{c.title}</h3>
              <p>{c.subtitle}</p>
              <FormItem
                hasFeedback={feedback(form, `contacts[${c.index}].name`)}
                help={help(form, `contacts[${c.index}].name`)}
              >
                {form.getFieldDecorator(`contacts[${c.index}].name`, rules.required)(
                  <Input prefix={<Icon type='edit' />} />
                )}
              </FormItem>
            </Col>
          ))}
        </Row>
        <FormItem>
          <Button size='large' type='primary'
            htmlType='submit' disabled={disableSubmit(form)}
            >Update</Button>
        </FormItem>
      </Form>
    )
  }
}

Contacts.propTypes = {
  form: PropTypes.object,
  api: PropTypes.object,
  parent: PropTypes.string,
  contacts: PropTypes.array
}
export default Contacts
