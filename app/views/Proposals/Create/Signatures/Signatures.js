import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {Field, formValueSelector} from 'redux-form'

import { Input, Switch } from '../../../../../components/Form/Form'

import { Row, Col, Alert, Button, Icon } from 'antd'

const contactTypes = [
  {
    title: 'Primary Author',
    field: 'primary'
  }, {
    title: 'Student Lead',
    field: 'student'
  }, {
    title: 'Organizational Head',
    field: 'organization'
  }, {
    title: 'Budget Director',
    field: 'budget'
  }
]

// import styles from './Introduction.css'
const selector = formValueSelector('create') // <-- same as form name

//  https://stackoverflow.com/questions/43999623/how-to-provide-validations-for-react-js-form/44005986#44005986
@connect(
  state => {
    const contacts = selector(state, 'contacts')
    const user = state.user
    //  Object destructuring, e.g primary: primary
    return { contacts, user }
  }
)
class Signatures extends React.Component {
  render ({user, contacts} = this.props) {
    return (
      <div>
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
      </div>
    )
  }
}
export default Signatures
