import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import api from '../../../../../services'
import { layout, feedback, help, rules, disableSubmit } from '../../../../../util/form'
import _ from 'lodash'

import { Form, Input, Alert, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

import SpreadSheet, { Editors } from '../../../../../components/SpreadSheet'
const { SimpleNumber } = Editors

//  BUG: Selectors cannot select child props. Is this case handled in the data-grid docs?
const columns = [{
  name: 'Name',
  key: 'name',
  editable: true
}, {
  name: 'Vendor',
  key: 'vendor',
  editable: true,
  width: 300
}, {
  name: 'Quantity',
  key: 'quantity',
  editable: true,
  editor: SimpleNumber,
  width: 85
}, {
  name: 'Price',
  key: 'price',
  editable: true,
  editor: SimpleNumber,
  width: 85
}]
@compose(
  connect(
    (state, props) => ({
      proposal: state.db.proposal._id,
      //  Use the most recent report (target document) and recent manifest (initial data)
      manifest: state.db.proposal.manifests[props.indexInStore]
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Supplemental extends React.Component {
  componentDidMount () {
    const { form } = this.props
    // if (report) {
    //   const { budget } = report
    //   form.setFieldsValue({ budget })
    // }
    form.validateFields()
  }
  handleSubmit = (items) => {
    let { form, api, proposal, manifest } = this.props
    //  Verify that the budget number (and hopefully other data) is there, add it to what we know.
    form.validateFields((err, values) => {
      if (!err) {
        items = items.map((item) => _.omit(item, ['_id', '__v']))
        let supplemental = { proposal, type: 'supplemental', items }
        //  Hydrate the supplement with form data (title/body, totally optional)
        supplemental = Object.assign(supplemental, values)
        const update = { proposal: (prev, next) => prev }
        console.warn(supplemental)
        api.post('manifest', supplemental, { update })
        .then(message.success('Supplemental request submitted!'))
        .catch(err => {
          message.warning('Supplemental request failed - Unexpected client error')
          console.warn(err)
        })
      } else {
        message.warning('We need the budget number for charging to this budget.')
      }
    })
  }
  render ({ form, manifest, report } = this.props) {
    //  Use the most recent approved manifest for initial data
    //  Make sure to omit mongo data, preventing the original from being mutated.
    let data = manifest.items
      ? manifest.items.map((item) =>
        _.omit(item, ['_id', '__v', 'manifest', 'description', 'priority', 'tax', 'report']))
      : []
    return (
      <section>
        <h1>Request Supplemental</h1>
        <h6>For proposals that face an unforseen and minor increase in budgetary needs</h6>
        <p>Supplemental awards help cover common scenarios where equipment models have changed or project needs have changed slightly in comparison to an original proposal. We understand that these things happen, so supplementals requests are how you can request more funding. These are voted on by the STF committee in a separate, less intensive process.</p>
        <Alert type='info' banner showIcon={false}
          message='Important Note reg. Award Supplements'
          description='If you have underspent your award, there is no consequence - simply fill out the above budget report so we can log your spending. If your project has changed significantly, we ask that you create a new proposal instead of requesting a large supplement. By clicking "I agree", you signify that you understand these conditions.'
        />
        {/* <FormItem label='Budget Number' {...layout} hasFeedback={feedback(form, 'budget')} help={help(form, 'budget')} >
          {form.getFieldDecorator('budget', rules.required)(
            <Input onPressEnter={(e) => this.handleBudget(e.target.value)} />
          )}
        </FormItem> */}
        <FormItem label='Request Title' {...layout} >
          {form.getFieldDecorator('title')(
            <Input />
          )}
        </FormItem>
        <FormItem label='Reasoning' {...layout} >
          {form.getFieldDecorator('body')(
            <Input type='textarea' rows={6} />
          )}
        </FormItem>
        <SpreadSheet
          columns={columns}
          data={data}
          onSubmit={this.handleSubmit}
        />
      </section>
    )
  }
}

Supplemental.propTypes = {
  //  the manifest index in store that is the basis for this supplemental.
  indexInStore: PropTypes.number.isRequired,
  form: PropTypes.object,
  api: PropTypes.object,
  proposal: PropTypes.string, //  _id
  manifest: PropTypes.object
}
export default Supplemental
