import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import api from '../../../../../services'
import { layout, feedback, help, rules, disableSubmit } from '../../../../../util/form'
import _ from 'lodash'

import { Form, Input, message } from 'antd'
const FormItem = Form.Item
const connectForm = Form.create()

import Spreadsheet, { Editors } from '../../../../../components/Spreadsheet'
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
      manifest: state.db.proposal.manifests[props.indexInStore],
      report: state.db.proposal.manifests[props.indexInStore].report || {},
      user: state.user._id
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Report extends React.Component {
  static propTypes = {
    indexInStore: PropTypes.number,
    awardNumber: PropTypes.number,  //  used as the manifest index in store for this report.
    form: PropTypes.object,
    api: PropTypes.object,
    proposal: PropTypes.string, //  _id
    user: PropTypes.string,
    manifest: PropTypes.object,
    report: PropTypes.object
  }
  componentDidMount () {
    const { form, report } = this.props
    if (report) {
      const { budget, title, body } = report
      form.setFieldsValue({ budget, title, body })
    }
    form.validateFields()
  }
  handleSubmit = (items, total) => {
    let { form, api, proposal, indexInStore,
      user: author,
      manifest: { _id: manifest }
    } = this.props
    //  Verify that the budget number (and hopefully other data) is there, add it to what we know.
    form.validateFields((err, values) => {
      if (!err) {
        items = items.map((item) => _.omit(item, ['_id', '__v']))
        let report = { proposal, manifest, author, items, total, ...values }
        const { _id: id } = this.props.report
        const params = {
          id,
          populate: ['items'],
          transform: proposal => ({ proposal }),
          update: ({ proposal: (prev, next) => {
            let change = Object.assign({}, prev)
            change.manifests[indexInStore].report = next
            return change
          }})
        }
        params.id
        ? api.patch('report', report, params)
        .then(message.success('Report updated!'))
        .catch(err => {
          message.warning('Report failed to update - Unexpected client error')
          console.warn(err)
        })
        : api.post('report', report, params)
        .then(message.success('Report created!'))
        .catch(err => {
          message.warning('Report failed to post - Unexpected client error')
          console.warn(err)
        })
      } else {
        message.warning('We need the budget number for charging to this budget.')
      }
    })
  }

  render ({ form, awardNumber, manifest, report } = this.props) {
    //  Use the associated manifest for initial data if report has not been created.
    //  Make sure to omit mongo data, preventing the original from being mutated.
    let data = (report && report.items)
      ? report.items
      : manifest.items.map((item) =>
        _.omit(item, ['_id', '__v', 'manifest', 'description', 'priority', 'tax']))
    const newData = { quantity: 1, price: 0 }
    const total = report && report.total
    return (
      <section>
        <h1>Expense Reporting</h1>
        <FormItem label='Budget Number' {...layout} hasFeedback={feedback(form, 'budget')} help={help(form, 'budget')} >
          {form.getFieldDecorator('budget', rules.required)(
            <Input />
          )}
        </FormItem>
        <FormItem label='Brief Summary' {...layout}>
          {form.getFieldDecorator('title')(
            <Input />
          )}
        </FormItem>
        <FormItem label='Details' {...layout}>
          {form.getFieldDecorator('body')(
            <Input type='textarea' rows={6} />
          )}
        </FormItem>
        <Spreadsheet financial
          columns={columns}
          data={data}
          onSubmit={this.handleSubmit}
          newData={newData}
          disabled={disableSubmit(form)}
          total={total}
        />
      </section>
    )
  }
}

export default Report
