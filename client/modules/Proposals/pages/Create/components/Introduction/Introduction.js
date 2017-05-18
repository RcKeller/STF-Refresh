import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {Field, reduxForm} from 'redux-form'

// import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd'
// const FormItem = Form.Item
// const Option = Select.Option
// const AutoCompleteOption = AutoComplete.Option
//
// const renderInput = ({input, label}) => (
//   <Input
//     placeholder={label}
//     value={input.value}
//     onChange={input.onChange}
//   />
// )

import { Input } from '../../../../../../components/Form/Form'

const Introduction = props => {
  const {handleSubmit, pristine, reset, submitting} = props
  return (
    <form onSubmit={handleSubmit}>
      <Field name='name' label='Name'
        component={Input}
        />
    </form>
  )
}

const validate = values => {
  const errors = {}
  return errors
}
export default reduxForm({
  form: 'ProposalsCreateIntroduction',
  validate
})(Introduction)
