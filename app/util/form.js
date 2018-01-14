import React from 'react'
import { Tooltip, Icon } from 'antd'
/*
ANTD / RC-FORM UTILS
Ant uses a very cumbersome controlled form wrapper. To use it, you have to do the following:
1. Use the appropriate form wrapper on your form component:
    const EndorseForm = Form.create()(Endorse)
2. Define your form:
    <Form onSubmit={this.handleSubmit}>...</Form>
3. Wrap each formitem with a decorator containing configs.
    (example using these utils)
    {form.getFieldDecorator('comment', rules.required)(
      <Input type='textarea' rows={6} />
    )}
4. Provide an onSubmit in the class:
    handleSubmit = (e) => {
      e.preventDefault()
      let { form, proposalID, user } = this.props
      form.validateFields((err, values) => {
        console.log('SUBMITTING', err, values, proposalID, user)
      })
    }
5. Validate your fields on component mount, preventing premature submissions.
    componentDidMount () { this.props.form.validateFields() }

Unfortuanately, Antd does NOT play well with Redux form.
However, we can work with RC form by reducing boilerplate, hence these utils.
RC-Form means well. It helps provide custom feedback while reducing the need for manual boilerplate.
For more information:
    https://ant.design/components/form/
    http://react-component.github.io/form/
*/

//  Well-situated default layout for forms
//  <FormItem {...layout}
const layout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
}

//  Check a form for errors. Returns bool
const hasErrors = (fields) => Object.keys(fields).some(field => fields[field])
//  Feedback checker util, usage in FormItem:
//  <FormItem hasFeedback={feedback('comment')}
//  <FormItem hasFeedback={feedback(form, 'comment')} ...
const feedback = (form, field) => form.isFieldTouched(field)
//  Help text for FormItems. Doesn't display anything if it hasn't been touched (aka just loaded)
//  <FormItem help={help(form, 'comment')} ...
// const help = (form, field) => (form.isFieldTouched(field) && form.getFieldError(field)) || ''
const help = (form, field) => form.getFieldError(field)

//  Set of useful default form rules, reduces boilerplate. Does NOT fill all use cases.
//  {form.getFieldDecorator('comment', rule.required)(<input... />)}
const validateNetID = (rule, value, callback) => {
  (value && value.length > 0 && !/[^a-zA-Z0-9]/.test(value))
    ? callback()
    : callback('A valid netID is required!')
}
const rules = {
  required: { rules: [{ required: true, message: 'Required' }] },
  netID: {
    rules: [
      { required: true, message: 'A netID is required!' },
      { validator: validateNetID }
    ]
  }
}

//  Disable a form's submit button
//  <Button htmlType='submit' disabled={disableSubmit(form)} />
const disableSubmit = (form) => hasErrors(form.getFieldsError())

const Label = ({title, message}) => (
  <span>
    {title}&nbsp;
    <Tooltip title={message}>
      <Icon type='question-circle-o' />
    </Tooltip>
  </span>
)

/*
label={
  <span>
    Organizations&nbsp;
    <Tooltip title='This includes budget codes as well, separated by a colon. Format: <name>:<budgetcode>'>
      <Icon type='question-circle-o' />
    </Tooltip>
  </span>
  }
*/

export {
  layout,
  hasErrors,
  feedback,
  help,
  rules,
  disableSubmit,
  Label
}
