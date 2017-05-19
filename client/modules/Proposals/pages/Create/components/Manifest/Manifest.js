import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {Field, reduxForm} from 'redux-form'

import { Row, Col, Button } from 'antd'

import { Input } from '../../../../../../components/Form/Form'

class Manifest extends React.Component {
  constructor (props) {
    super(props)
    this.state = { items: [{}] }
    this.add = this.add.bind(this)
  }
  add () {
    let items = this.state.items.push({})
    this.setState({ items })
  }
  render () {
    const {handleSubmit, pristine, reset, submitting} = this.props
    return (
      <form onSubmit={handleSubmit}>
          {this.state.items.map((item, i) => (
            <div key={i}>
              <Row gutter={16}>
              <Col key={i} className='gutter-row' xs={24} sm={12} md={8}>
                <h3>Item Name</h3>
                <Field name={`name-${i}`} component={Input} />
                <h4>Quantity</h4>
                <Field name={`quantity-${i}`} component={Input} />
                <h4>Price</h4>
                <Field name={`price-${i}`} component={Input} />
                <h4>Priority Order (descending)</h4>
                <Field name={`priority-${i}`} component={Input} />
              </Col>
              <Col className='gutter-row' xs={24} sm={12} md={8}>
                <h4>Description</h4>
                <Field name={`description-${i}`} component={Input} type='textarea' size='small' autosize />
              </Col>
              <Col className='gutter-row' xs={24} sm={12} md={8}>
                <h4>Justification</h4>
                <Field name={`justification-${i}`} component={Input} type='textarea' size='small' autosize />
              </Col>
              <hr/>
            </Row>
            <hr />
          </div>
          ))}
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
  validate
})(Manifest)
