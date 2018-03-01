import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Row, Col, Alert, Form, Checkbox, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

import api from '../../../../services'

import styles from './Signatures.css'
/*
NOTE:
Instead of instantiating 4 different forms for a single field, we're using AntD's
API for submission, but using connectForm to instantiate initial values.
*/
@compose(
  connect(state => ({
    contacts: state.db.proposal.contacts.filter(c => c._id),
    link: `https://uwstf.org${state.routing.locationBeforeTransitions.pathname}`,
    user: state.user
  }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Signatures extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    api: PropTypes.object,
    contacts: PropTypes.array,
    user: PropTypes.object
  }
  componentDidMount () {
    //  Take contacts, make an object with role-to-signature bool, use this to set initial vals.
    const { form, contacts } = this.props
    if (contacts) {
      let fields = {}
      for (const c of contacts) {
        fields[c.role] = c.signature
      }
      form.setFieldsValue(fields)
    }
  }
  handleToggle = (signature, contact) => {
    const { api } = this.props
    const id = contact._id
    const update = { proposal: (prev, next) => {
      let newData = Object.assign({}, prev)
      const index = newData.contacts.findIndex(c => c._id === id)
      newData.contacts[index].signature = signature
      return newData
    }}
    api.patch('contact', { signature }, { id, update })
    .then(message.success(`You have signed and approved this proposal !`))
    .catch(err => {
      message.warning(`Failed to update - Unexpected client error`)
      console.warn(err)
    })
  }
  render ({ form, contacts, link, user } = this.props) {
    return (
      <Form>
        <Alert type='info' banner
          message='Have your authors sign!'
          description={<span><a href={link}>Your signers can access this page by signing in with their netID.</a> You will NOT be able to sign as another person's netID.</span>}
        />
        <Row gutter={32}>
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
            <Row>
              {contacts.map((c, i) => (
                <Col key={i} xs={24}>
                  <FormItem>
                    {form.getFieldDecorator(c.role, { valuePropName: 'checked' })(
                      //  Valueprop is a selector for antd switches, it's in the docs.
                      <Checkbox size='large'
                        onChange={(e) => this.handleToggle(e.target.checked, c)}
                      >
                        <span className={styles['checkbox-text']}>
                          {`${c.name} - ${c.title}`}
                        </span>
                      </Checkbox>
                    )}
                  </FormItem>
                </Col>
              ))}
            </Row>
            {contacts && contacts.length > 1 && <Alert type='warning' banner
              message='Other authors must log in separately to sign.'
            />}
          </Col>
        </Row>
      </Form>
    )
  }
}

export default Signatures
