import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {Field, reduxForm} from 'redux-form'

import { Row, Col, Alert, Button, Icon } from 'antd'

import { Input, InputNumber, InputCurrency, InputTax } from '../../../../components/Form/Form'

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
    const {handleSubmit, pristine, reset, submitting} = this.props
    return (
      <form onSubmit={handleSubmit}>
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
                <Field name={`name-${i}`} component={Input} />
                <h3>Description</h3>
                <Field name={`description-${i}`} component={Input} type='textarea' size='small' rows={2} />
              </Col>
              <Col className='gutter-row' xs={24} md={8}>
                <Row>
                  <Col xs={12}>
                    <h5>Quantity</h5>
                    <Field name={`quantity-${i}`} component={Input} />
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
                    <Field name={`price-${i}`} component={InputCurrency} />
                  </Col>
                  <Col xs={12}>
                    <h5>Tax Rate</h5>
                    <Field name={`taxrate-${i}`} initialValue={10.1} component={InputTax} />
                  </Col>
                </Row>
                <h5>Priority Order (descending)</h5>
                <Field name={`priority-${i}`} component={Input} />
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
      </form>
    )
  }
}

const validate = values => {
  const errors = {}
  return errors
}
export default reduxForm({
  form: 'ProposalsCreateManifest',
  validate,
  enableReinitialize: true
})(Manifest)
