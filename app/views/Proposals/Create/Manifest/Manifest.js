import React from 'react'
import { Field } from 'redux-form'

import { Row, Col, Icon, Alert, Form, Input, InputNumber, Button, Switch } from 'antd'
const FormItem = Form.Item
const ButtonGroup = Button.Group

const layout = {
  labelCol: { xs: { span: 24 }, sm: { span: 6 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
}

//  This is the first of potentially many "partial" manifests.
//  Partial manifests are made to fund a section of an award.
//  This is just a utility string to make code more readable.
const manifests = 'manifests[0].items'

class Manifest extends React.Component {
  constructor (props) {
    super(props)
    this.state = { count: 1 }
    this.add = this.add.bind(this)
    this.remove = this.remove.bind(this)
  }
  add () { this.setState({ count: ++this.state.count }) }
  remove () { this.setState({ count: --this.state.count }) }
  render ({ form, proposal } = this.props) {
    //  Helper functions - these return bools for styling components based on validation
    const feedback = (field) => form.isFieldTouched(field)
    const help = (field) => (form.isFieldTouched(field) && form.getFieldError(field)) || ''

    let items = []
    // TODO: Fix bizzare issue with render not iterating over this enough times.
    for (var i = 0; i < this.state.count; i++) {
      items.push(
        <Row gutter={32} key={i} >
          <Col className='gutter-row' xs={24} md={16} >
            <h2>Item {++i}</h2>
            <FormItem
              hasFeedback={feedback(`${manifests}[${i}].name`)}
              help={help(`${manifests}[${i}].name`)}
            >
              {form.getFieldDecorator(`${manifests}[${i}].name`, {
                rules: [{ required: true, message: 'Required' }]
              })(
                <Input prefix={<Icon type='laptop' />} />
              )}
            </FormItem>
            <h3>Description</h3>
            <FormItem
              hasFeedback={feedback(`${manifests}[${i}].description`)}
              help={help(`${manifests}[${i}].description`)}
            >
              {form.getFieldDecorator(`${manifests}[${i}].description`, {
                rules: [{ required: true, message: 'Required' }]
              })(
                <Input type='textarea' rows={2} />
              )}
            </FormItem>
          </Col>
          <Col className='gutter-row' xs={24} md={8}>
            <FormItem label='Quantity' {...layout}
              hasFeedback={feedback(`${manifests}[${i}].quantity`)}
              help={help(`${manifests}[${i}].quantity`)}
            >
              {form.getFieldDecorator(`${manifests}[${i}].quantity`, {
                rules: [{ required: true, message: 'Required', initialValue: 1 }]
              })(
                <InputNumber min={1} />
              )}
            </FormItem>
            <FormItem label='Priority #' {...layout}
              hasFeedback={feedback(`${manifests}[${i}].priority`)}
              help={help(`${manifests}[${i}].priority`)}
              >
              {form.getFieldDecorator(`${manifests}[${i}].priority`)(
                <InputNumber min={1} />
              )}
            </FormItem>
            <FormItem label='Price' {...layout}
              hasFeedback={feedback(`${manifests}[${i}].price`)}
              help={help(`${manifests}[${i}].price`)}
            >
              {form.getFieldDecorator(`${manifests}[${i}].price`, {
                rules: [{ required: true, message: 'Required', initialValue: 0 }]
              })(
                <InputNumber min={0} />
              )}
            </FormItem>
            <FormItem label='Tax' {...layout}
              hasFeedback={feedback(`${manifests}[${i}].tax`)}
              help={help(`${manifests}[${i}].tax`)}
            >
              {form.getFieldDecorator(`${manifests}[${i}].tax`, {
                rules: [{ required: true, message: 'Required', initialValue: 10.1 }]
              })(
                <InputNumber min={0} />
              )}
            </FormItem>
          </Col>
        </Row>
      )
      console.log(this.state.count, items.length)
    }

    return (
      <div>
        <Alert
          message='Regarding Taxes'
          description='A 10.1% tax rate will automatically be appended to your manifest. Please make adjustments to items that are tax exempt or purchased out-of-state before proceeding.'
          type='warning'
          showIcon
        />
        {items}
        <Col span={24}>
          <ButtonGroup size='large' >
            <Button type='danger'
              disabled={this.state.count <= 1}
              onClick={() => this.remove()}>
              <Icon type='minus-circle' />Remove Item
            </Button>
            <Button type='primary' onClick={() => this.add()}>
              Add Item<Icon type='plus-circle' />
            </Button>
          </ButtonGroup>
        </Col>
      </div>
    )
  }
}
export default Manifest

/*

  <Alert
    message='Regarding Taxes'
    description='A 10.1% tax rate will automatically be appended to your manifest. Please make adjustments to items that are tax exempt or purchased out-of-state before proceeding.'
    type='warning'
    showIcon
  />
  {this.state.items.map((item, i) => (
    <div key={i}>
      <Row gutter={16}>
        <Col className='gutter-row' xs={24} md={16} >
          <h2>Item Name</h2>
          <Field name={`manifests[0].items[${i}].name`} component={Input} />
          <h3>Description</h3>
          <Field name={`manifests[0].items[${i}].description`} component={Input} type='textarea' size='small' rows={2} />
        </Col>
        <Col className='gutter-row' xs={24} md={8}>
          <Row>
            <Col xs={12}>
              <h5>Quantity</h5>
              <Field name={`manifests[0].items[${i}].quantity`} component={InputNumber} initialValue={1} />
            </Col>
            <Col xs={12}>
              <Button type='dashed' style={{ color: 'crimson', marginTop: 28 }} onClick={() => this.remove(i)}>
                <Icon type='minus' /> Delete
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <h5>Price</h5>
              <Field name={`manifests[0].items[${i}].price`} component={InputCurrency} />
            </Col>
            <Col xs={12}>
              <h5>Tax Rate</h5>
              <Field name={`manifests[0].items[${i}].taxrate`} initialValue={10.1} component={InputTax} />
            </Col>
          </Row>
          <h5>Priority Order (descending)</h5>
          <Field name={`manifests[0].items[${i}].priority`} component={InputNumber} />
        </Col>
      </Row>
      <hr />
    </div>
    ))}
  <Row>
    <Col span={24}>
      <Button type='dashed' onClick={this.add}>
        <Icon type='plus' /> Add field
        </Button>
    </Col>
  </Row>
*/
