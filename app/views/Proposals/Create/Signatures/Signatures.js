import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Row, Col, Alert, Form, Button, Switch } from 'antd'
const FormItem = Form.Item

const contactTypes = [
  {
    title: 'Primary Author',
    field: 'primary'
  }, {
    field: 'budget',
    title: 'Budget Director'
  }, {
    field: 'organization',
    title: 'Organizational Head'
  }, {
    field: 'student',
    title: 'Student Lead'
  }
]

const layout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
}

// import styles from './Introduction.css'
@connect(state => ({
  user: state.user,
  //  Selecting proposal from store, not form. Good for partially preventing spoofing.
  //  This way, the server must be a part of ID verification.
  proposal: state.db.proposal
}))
class Signatures extends React.Component {
  render ({ user, form, proposal } = this.props) {
    return (
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
          {proposal.contacts.map((c, i) => (
            // Mapping over contacts, creating buttons that only they can sign.
            <Col key={i} className='gutter-row' xs={24}>
              {c.name && c.netID && c.title &&
                <FormItem label={c.title} {...layout} >
                  {form.getFieldDecorator(`contacts[${i}].signature`, { valuePropName: 'checked' })(
                    // valuePropName is documented in the antd docs, that's a selector for switch vals.
                    <Switch size='large' />
                  )}
                </FormItem>
              }
            </Col>
          ))}
        </Col>
      </Row>
    )
  }
}
export default Signatures

/*

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
      {contactTypes.map((c, i) => (
        // Mapping over contacts, creating buttons that only they can sign.
        <Col key={i} className='gutter-row' xs={24}>
          {contacts[c.field] &&
            <h5>{c.title}: <Field name={`signatures.${c.field}`}
              component={Switch} size='large'
              checkedChildren={contacts[c.field].name}
              unCheckedChildren={contacts[c.field].name}
              disabled={contacts[c.field].netID !== user.netID}
              />
            </h5>
        }
        </Col>
      ))}
    </Col>
  </Row>
*/
