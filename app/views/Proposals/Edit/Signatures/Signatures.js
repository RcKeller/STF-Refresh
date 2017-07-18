import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Row, Col, Alert, Form, Button, Switch, Icon, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

import { layout, feedback, help, rules, disableSubmit } from '../../../../util/form'
import api from '../../../../services'

/*
NOTE:
Instead of instantiating 4 different forms for a single field, we're using AntD's
API for submission, but using connectForm to instantiate initial values.
*/
@compose(
  connect(state => ({
    contacts: state.db.proposal.contacts,
    user: state.user
  }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Signatures extends React.Component {
  componentDidMount () {
    //  Take contacts, make an object with role-to-signature bool, use this to set initial vals.
    const { form, contacts } = this.props
    if (contacts) {
      let fields = {}
      contacts.forEach(c => fields[c.role] = c.signature)
      form.setFieldsValue(fields)
    }
  }
  handleToggle = (signature, contact) => {
    let { api } = this.props
    api.patch(
      'contact',
      { signature },
      { id: contact._id }
    )
    .then(message.success(`You have signed and approved this proposal !`))
    .catch(err => {
      message.warning(`Failed to update - Unexpected client error`)
      console.warn(err)
    })
  }
  render ({ form, contacts, user } = this.props) {
    return (
      <Form>
        <Row gutter={32} type='flex' justify='space-between' align='bottom'>
          <Col className='gutter-row' xs={24} sm={12}>
            <h2>Final Signatures</h2>
            <p>
              To submit your proposal to the Committee, all contacts must sign this proposal signature page.
            </p>
            <p>
              By signing this proposal, a department pledges general, physical, and financial support to this proposal. Submitting a proposal also represents the department and contact's agreement with STF policies and procedures.
            </p>
          </Col>
          <Col className='gutter-row' xs={24} sm={12}>
            <Alert message='Last Step:'
              description='Send this link to the contacts listed in your proposal introduction. Ensure their NetID are spelled correctly. Each contact, with the exception of the optional student lead, will need to sign the proposal.'
              type='info' showIcon
            />
            {contacts.map((c, i) => (
              <Col key={i} className='gutter-row' xs={24}>
                <FormItem {...layout} >
                  {form.getFieldDecorator(c.role, { valuePropName: 'checked' })(
                    //  Valueprop is a selector for antd switches, it's in the docs.
                    <Switch size='large' unCheckedChildren={c.title} checkedChildren={c.title}
                      disabled={c.netID !== user.netID} onChange={(checked) => this.handleToggle(checked, c)}
                    />
                  )}
                </FormItem>
              </Col>
            ))}
          </Col>
        </Row>
      </Form>
    )
  }
}
Signatures.propTypes = {
  form: PropTypes.object,
  api: PropTypes.object,
  contacts: PropTypes.array,
  user: PropTypes.object
}
export default Signatures
