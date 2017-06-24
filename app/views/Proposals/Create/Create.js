import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRequest, querySelectors } from 'redux-query'

import api from '../../../services'

import Introduction from './Introduction/Introduction'
// import Overview from './Overview/Overview'
// import ProjectPlan from './ProjectPlan/ProjectPlan'
// import Manifest from './Manifest/Manifest'
// import Signatures from './Signatures/Signatures'

import { Form, Icon, Button, Tabs, message } from 'antd'
const TabPane = Tabs.TabPane
const FormItem = Form.Item

function hasErrors (fields) {
  return Object.keys(fields).some(field => fields[field])
}

/*
connectRequest should get proposal by ID
If there is no ID, or there is an ID but you're a contact...
Render form components. Run validation and api.patch() to update the remote as necessary
*/
import styles from './Create.css'
@compose(
  connect(
    state => ({
      proposal: state.entities.proposal
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectRequest(() => api.get('proposal', '594b49998dabd50e2c71762d', {
    populate: 'body,decision,contacts,manifests,reports,amendments,comments,'
  }))
)
class Create extends React.Component {
  // Disable submit button at the beginning by running validation.
  componentDidMount () { this.props.form.validateFields() }
  //  Load fields from server
  //  TODO: Refactor for efficiency, detect if f
  componentDidUpdate (prevProps, prevState) {
    if (!prevProps.proposal && this.props.proposal) {
      this.props.form.setFieldsValue(this.props.proposal)
    }
  }
  /*
  handleSubmit will handle the FINAL submission, which includes
  marking a proposal as complete / not a draft.
  */
  handleSubmit = (e) => {
    e.preventDefault()
    let { form, proposal, api } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        try {
          api.patch('proposal', proposal._id, values)
          message.success('Draft updated!')
          //  TODO: Once we add a bool for if proposals are drafts, update this to reflect that.
        } catch (err) {
          message.error('An error occured - Draft failed to update')
          console.warn(err)
        }
      }
    })
  }
  /*
  Util for silently updating the proposal on the backend.
  Leaving this be for now, until we decide on how aggressive our validation will be.
  */
  update () {
    let { form } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Update:', values)
      } else {
        console.warn('Update fails validation:', err)
      }
    })
  }
  render ({ handleSubmit, form, proposal } = this.props) {
    const invalidData = hasErrors(form.getFieldsError())
    return (
      <article className={styles['create']}>
        <h1>{proposal ? proposal.title : 'Creating New Proposal'}</h1>
        <Form onSubmit={this.handleSubmit}>
          <Tabs defaultActiveKey='1' onChange={() => this.update()}>
            <TabPane key='1' tab={<span>
              <Icon type='team' />
              Introduction</span>
            }>
              <Introduction form={form} proposal={proposal} />
            </TabPane>
            <TabPane key='2' tab={
              <span><Icon type='solution' />Overview</span>
            }>
              <p>Overview</p>
            </TabPane>
            <TabPane key='3' tab={
              <span><Icon type='book' />Plan</span>
            }>
              <p>Plan</p>
            </TabPane>
            <TabPane key='4' tab={
              <span><Icon type='wallet' />Manifest</span>
            }>
              <p>Manifest</p>
            </TabPane>
            <TabPane key='5' tab={
              <span><Icon type='edit' />Signatures</span>
            }>
              <p>Signatures</p>
            </TabPane>
          </Tabs>
          <FormItem>
            <Button size='large' type='primary'
              className={styles['submit-button']}
              htmlType='submit'
              disabled={invalidData}
            >Update</Button>
          </FormItem>
        </Form>
      </article>
    )
  }
}
Create.propTypes = {
  form: PropTypes.object,
  proposal: PropTypes.object,
  api: PropTypes.object
}
// Decoration doesn't work.
const CreateForm = Form.create()(Create)
export default CreateForm
