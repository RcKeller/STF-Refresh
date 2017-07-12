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
const feedback = (form, field) => form.isFieldTouched(field)

//  Help text for FormItems. Doesn't display anything if it hasn't been touched (aka just loaded)
//  help={help('body.overview.abstract')}
const help = (form, field) => (form.isFieldTouched(field) && form.getFieldError(field)) || ''

export {
  layout,
  hasErrors,
  feedback,
  help
}
