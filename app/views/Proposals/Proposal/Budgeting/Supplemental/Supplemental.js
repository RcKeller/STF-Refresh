import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import api from '../../../../../services'
import { layout } from '../../../../../util/form'
import _ from 'lodash'

import { Form, Input, Alert, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

import Spreadsheet, { Editors } from '../../../../../components/Spreadsheet'
const { SimpleNumber, TaxRate } = Editors

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
}, {
  name: 'Tax',
  key: 'tax',
  editable: true,
  editor: TaxRate,
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
  static propTypes = {
    //  the manifest index in store that is the basis for this supplemental.
    indexInStore: PropTypes.number.isRequired,
    form: PropTypes.object,
    api: PropTypes.object,
    proposal: PropTypes.string, //  _id
    manifest: PropTypes.object
  }
  componentDidMount () {
    const { form } = this.props
    // if (report) {
    //   const { budget } = report
    //   form.setFieldsValue({ budget })
    // }
    form.validateFields()
  }
  handleSubmit = (items, total) => {
    let { form, api, proposal, manifest } = this.props
    //  Verify that the budget number (and hopefully other data) is there, add it to what we know.
    form.validateFields((err, values) => {
      if (!err) {
        items = items.map((item) => _.omit(item, ['_id', '__v']))
        let supplemental = { proposal, type: 'supplemental', items, total }
        //  Hydrate the supplement with form data (title/body, totally optional)
        supplemental = Object.assign(supplemental, values)
        // const update = { proposal: (prev, next) => prev }
        const transform = res => ({ proposal: res })
        const update = { proposal: (prev, next) => {
          let newData = Object.assign({}, prev)
          newData.manifests.push(next)
          return newData
        }}
        api.post('manifest', supplemental, { transform, update })
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
    const newData = { tax: 10.1, quantity: 1, price: 0 }
    const total = manifest && manifest.total
    return (
      <section>
        <h1>Request Supplemental</h1>
        <h6>For proposals that face an unforseen and minor increase in budgetary needs</h6>
        <p>
          Welcome to the Request Supplemental page. The purpose of a Supplemental is to request additional funding, additional technology, and/or modify specific details regarding the technology listed in the original proposal, <b>due to needs due to circumstances that could not have been reasonably anticipated.</b>

          We've copied all your proposal's items over into this new supplemental. Please use this pages to change items to reflect changes (or lack thereof) for all items initially funded, as well as add requests for additional technology.
        </p>
        <Alert type='warning' showIcon banner
          message={<span><b>Important:</b> The STF Committee will not consider Supplemental requests which ask for funding and/or technology outside of the range of the original proposal.</span>}
        />
        <p>
          Common acceptable reasons for a Supplemental request may include situations such as:
          <ul style={{
            listStyleType: 'circle',
            listStylePosition: 'inside'
          }}>
            <li>
              The cost of an item(s) changes due to unforeseen market changes
            </li>
            <li>
              Manufacturer discontinues item so an item of comparable capability is requested instead
            </li>
          </ul>
        </p>
        <p>
          Unacceptable reasons to ask for a supplemental may include:
          <ul style={{
            listStyleType: 'circle',
            listStylePosition: 'inside'
          }}>
            <li>
              Requests for additional technology outside the scope of the original project
            </li>
            <li>
              Requests for student labor
            </li>
            <li>
              Underspending of budget and subsequent request for multiples of item and/or more technology
            </li>
            <li>
              Reimbursement for items purchased from another budget
            </li>
          </ul>
        </p>
        <p>
          Once you submit, the committee will consider your proposal as soon as possible, usually by the next week's meeting.

          If you have additional questions, please contact the STF Proposal Officer at stfagent@uw.edu
        </p>
        <Alert type='info' showIcon banner
          message='Important Note reg. Award Supplements'
          description='If you have underspent your award, there is no consequence - simply fill out the above budget report so we can log your spending. If your project has changed significantly, we ask that you create a new proposal instead of requesting a large supplement. By requesting a supplement, you signify that you understand these conditions.'
        />
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
        <Spreadsheet financial
          columns={columns}
          data={data}
          newData={newData}
          onSubmit={this.handleSubmit}
          total={total}
        />
      </section>
    )
  }
}

export default Supplemental
