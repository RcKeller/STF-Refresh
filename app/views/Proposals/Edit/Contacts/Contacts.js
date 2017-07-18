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
    subtitle: '(Optional) We recommend that there be at least one student representing a project, as STF funds are intended for student use.'
  }
]

// import styles from './Body.css'
const jss = {
  icon: { fontSize: 13 }
}
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
  componentDidMount () {
    const { form, contacts } = this.props
    if (contacts) {
      form.setFieldsValue({ contacts })
    }
    form.validateFields()
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let { form, api, parent, contacts } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        values = values.contacts
        console.log(values)
        //  Student contacts are optional. Remove their fields if not completed.
        const student = 3
        if (!values[student] || !values[student].name || !values[student].netID) {
          values.splice(student, 1)
        }
        //  Iterate over each contact, setting roles as appropriate.
        values.forEach((contact, i) => {
          values.role = contactFields[i].field
          //  Patch contacts if they already exist. Create them otherwise.
          contacts[i]
          ? api.patch(
            'contact',
            { proposal: parent, ...values[i] },
            { id: contacts[i]._id }
          )
          : api.post(
            'contact',
            { proposal: parent, ...values[i] }
          )
          .then(message.success(`Updated ${contactFields[i].title}!`))
          .catch(err => {
            message.warning(`Failed to update ${contactFields[i].title} - Unexpected client error`)
            console.warn(err)
          })
        })
      }
    })
  }

  render ({ form, contacts } = this.props) {
    const requireForStaff = (index) => index !== 3 ? rules.required : null
    return (
      <Form layout='inline' onSubmit={this.handleSubmit}>
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
                {form.getFieldDecorator(`contacts[${c.index}].name`, requireForStaff(c.index))(
                  <Input prefix={<Icon type='edit' style={jss.icon} />} placeholder='Name' />
                )}
              </FormItem>
              <FormItem
                hasFeedback={feedback(form, `contacts[${c.index}].netID`)}
                help={help(form, `contacts[${c.index}].netID`)}
              >
                {form.getFieldDecorator(`contacts[${c.index}].netID`, requireForStaff(c.index))(
                  <Input prefix={<Icon type='idcard' style={jss.icon} />} placeholder='NetID' />
                )}
              </FormItem>
              <FormItem
                hasFeedback={feedback(form, `contacts[${c.index}].title`)}
                help={help(form, `contacts[${c.index}].title`)}
              >
                {form.getFieldDecorator(`contacts[${c.index}].title`, requireForStaff(c.index))(
                  <Input prefix={<Icon type='info-circle-o' style={jss.icon} />} placeholder='Title' />
                )}
              </FormItem>
              <FormItem
                hasFeedback={feedback(form, `contacts[${c.index}].phone`)}
                help={help(form, `contacts[${c.index}].phone`)}
              >
                {form.getFieldDecorator(`contacts[${c.index}].phone`, requireForStaff(c.index))(
                  <Input prefix={<Icon type='phone' style={jss.icon} />} placeholder='Phone' />
                )}
              </FormItem>
              <FormItem
                hasFeedback={feedback(form, `contacts[${c.index}].mailbox`)}
                help={help(form, `contacts[${c.index}].mailbox`)}
              >
                {form.getFieldDecorator(`contacts[${c.index}].mailbox`)(
                  <Input prefix={<Icon type='inbox' style={jss.icon} />} placeholder='Mailbox #' />
                )}
              </FormItem>
            </Col>
          ))}
        </Row>
        <FormItem>
          <Button size='large' type='primary' width='100%' style={{width: '100%'}}
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
