import React from 'react'
import PropTypes from 'prop-types'

import {
  Input as AntInput,
  InputNumber as AntInputNumber,
  Switch as AntSwitch
} from 'antd'
// import { Form, Input as AntInput, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd'
// const FormItem = Form.Item
// const Option = Select.Option
// const AutoCompleteOption = AutoComplete.Option

export const Input = ({input, label, ...custom}) => (
  <AntInput size='large'
    placeholder={label}
    value={input.value}
    onChange={input.onChange}
    {...custom}
  />
)

export const InputNumber = ({input, ...custom}) => (
  <AntInputNumber size='large'
    value={input.value}
    onChange={input.onChange}
    // {...defaultValue}
    {...custom}
  />
)

export const InputCurrency = ({input, ...custom}) => (
  <AntInputNumber size='large'
    value={input.value ? input.value : 0.00}
    onChange={input.onChange}
    // defaultValue={0}
    formatter={value => `$${value}`}
    parser={value => value.replace('$', '')}
    {...custom}
  />
)
export const InputTax = ({input, ...custom}) => (
  <AntInputNumber size='large'
    value={input.value ? input.value : 10.1}
    onChange={input.onChange}
    // defaultValue={10.1}
    min={0} max={100}
    step={0.1}
    formatter={value => `%${value}`}
    parser={value => value.replace('%', '')}
    {...custom}
  />
)

export const Switch = ({input, ...custom}) => (
  <AntSwitch size='large'
    value={input.value}
    //  Checked is like "value", can only accept bool hence the ternary
    checked={input.value ? true : false}
    onChange={input.onChange}
    {...custom}
  />
)
