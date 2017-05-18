import React from 'react'
import PropTypes from 'prop-types'

import { Form, Input as AntInput, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd'
const FormItem = Form.Item
const Option = Select.Option
const AutoCompleteOption = AutoComplete.Option

export const Input = ({input, label, ...custom}) => (
  <AntInput size="large" placeholder={label}
    value={input.value} onChange={input.onChange}
    {...custom}
  />
)
