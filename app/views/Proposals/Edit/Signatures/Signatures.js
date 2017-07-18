import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Row, Col, Alert, Form, Button, Switch, Icon } from 'antd'
const FormItem = Form.Item

const contactTypes = [
  {
    role: 'primary',
    title: 'Primary Author'
  }, {
    role: 'budget',
    title: 'Budget Director'
  }, {
    role: 'organization',
    title: 'Organizational Head'
  }, {
    role: 'student',
    title: 'Student Lead'
  }
]

const layout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
}

@connect(state => ({
  contacts: state.db.proposal.contacts,
  user: state.user
}))
class Signatures extends React.Component {
  //  NOTE: Antd switches can activate toggle
  toggle = (checked, contact) => {
    console.log('SWITCH', checked, contact)
    // this.setState({
    //   disabled: !this.state.disabled,
    // });
  }
  render ({ user, form, contacts } = this.props) {
    // const disableUnaffiliated = c.netID !== user.netID
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
          {contacts.map((c, i) => (
            <Col key={i} className='gutter-row' xs={24}>
              <Switch size='large' unCheckedChildren={c.title} checkedChildren={c.title}
                disabled={c.netID !== user.netID} onChange={(checked) => this.toggle(checked, c)}
              />
            </Col>
          ))}
        </Col>
      </Row>
    )
  }
}
export default Signatures
