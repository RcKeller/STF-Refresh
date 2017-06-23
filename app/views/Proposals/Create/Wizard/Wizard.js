import React from 'react'
import PropTypes from 'prop-types'

import Introduction from './Introduction/Introduction'
// import Overview from './Overview/Overview'
// import ProjectPlan from './ProjectPlan/ProjectPlan'
// import Manifest from './Manifest/Manifest'
// import Signatures from './Signatures/Signatures'

import { Form, Steps, Icon, Button } from 'antd'
const Step = Steps.Step
const FormItem = Form.Item
const ButtonGroup = Button.Group

// const AntForm = (component) => Form.create(component)

function hasErrors (fields) {
  return Object.keys(fields).some(field => fields[field])
}

const steps = [
  { title: 'Introduction', icon: 'team' },
  { title: 'Overview', icon: 'solution' },
  { title: 'Plan', icon: 'book' },
  { title: 'Manifest', icon: 'wallet' },
  { title: 'Signatures', icon: 'edit' }
]
// import validate from './validate'
// import styles from './Create.css'
// @reduxForm({
//   form: 'create',
//   destroyOnUnmount: false,
//   validate: validate
// })

/*
connectRequest should get proposal by ID
If there is no ID, or there is an ID but you're a contact...
Render form components. Run validation and api.patch() to update the remote as necessary
*/
// @AntForm
class Wizard extends React.Component {
  constructor (props) {
    super(props)
    this.state = { current: 0 }
  }
  // Disable submit button at the beginning.
  componentDidMount () {
    this.props.form.validateFields()
  }
  /*
  handleSubmit will handle the FINAL submission, which includes
  marking a proposal as complete / not a draft.
  */
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) console.log('FORM', values)
    })
  }
  /*
  Moving forwards or backwards triggers form validation
  You can only move by validating your data.
  This prevents stuff like signaure spoofing, etc
  */
  handleStep (direction) {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        switch (direction) {
          case 'next':
            this.setState({ current: ++this.state.current })
            break
          case 'prev':
            this.setState({ current: --this.state.current })
            break
        }
        console.log('FORM', values)
      } else {
        console.warn(err)
      }
    })
  }
  render ({handleSubmit, form} = this.props) {
    return (
      <article>
        <h1>Creating Proposal</h1>
        <Steps current={this.state.current}>
          {steps.map((s, i) => (
            <Step key={i} title={s.title}
              icon={<Icon type={s.icon} />}
            />
          ))}
        </Steps>
        <Form onSubmit={handleSubmit}>
          <Introduction {...form} />
          {/* {steps[this.state.current].content} */}
          <section className='steps-action'>
            <ButtonGroup>
              <Button size='large' type='primary'
                disabled={this.state.current === 0}
                onClick={() => this.handleStep('prev')}
              >
                <Icon type='left' />Previous
              </Button>
              <Button size='large' type='primary'
                disabled={this.state.current >= steps.length - 1}
                onClick={() => this.handleStep('next')}
              >
                Next<Icon type='right' />
              </Button>
            </ButtonGroup>
            <FormItem>
              <Button size='large' type='primary'
                htmlType='submit'
                disabled={hasErrors(form.getFieldsError())}
              >Submit</Button>
            </FormItem>
            {/* {next}
            {submit}
            {previous} */}
          </section>
        </Form>
      </article>
    )
  }
}
Wizard.propTypes = {
  form: PropTypes.object
}
// export default Wizard
const WizardForm = Form.create()(Wizard)
export default WizardForm
