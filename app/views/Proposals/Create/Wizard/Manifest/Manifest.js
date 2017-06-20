import React from 'react'
import { Field } from 'redux-form'

import { Row, Col, Alert, Button, Icon } from 'antd'

import { Input, InputNumber, InputCurrency, InputTax } from '../../../../../components/Form/Form'

//  This is the first of potentially many "partial" manifests.
//  Partial manifests are made to fund a section of an award.
// form: 'create.manifests[0]',
class Manifest extends React.Component {
  constructor (props) {
    super(props)
    this.state = { items: [{}] }
    this.add = this.add.bind(this)
    this.remove = this.remove.bind(this)
  }
  add () {
    let items = this.state.items
    items.push({}) && this.setState({ items })
  }
  remove (i) {
    let items = this.state.items
    items.splice(i, 1) && this.setState({ items })
  }
  render () {
    return (
      <div>
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
      </div>
    )
  }
}
export default Manifest
