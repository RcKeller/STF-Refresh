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
      manifest: state.db.proposal.manifests[props.indexInStore],
      report: state.db.proposal.manifests[props.indexInStore].report
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  ),
  connectForm
)
class Report extends React.Component {
  componentDidMount () {
    const { form, report } = this.props.report
    if (report.budget) {
      const { budget } = report
      form.setFieldsValue({ budget })
    }
    form.validateFields()
  }
  handleSubmit = (items) => {
    let { form, api, proposal, manifest } = this.props
    //  Verify that the budget number (and hopefully other data) is there, add it to what we know.
    form.validateFields((err, values) => {
      if (!err) {
        let report = { proposal, manifest: manifest._id, items }
        //  Hydrate the report with form data
        report = Object.assign(report, values)
        console.log('REPORT', report)
      }
    })
  }
  //  NOTE: Good for testing:
  //  http://localhost:3000/proposals/2017/39061
  //  http://localhost:3000/proposals/2017/94939

  render ({ form, awardNumber, manifest, report } = this.props) {
    //  Use the associated manifest for initial data if report has not been created.
    //  Make sure to omit mongo data, preventing the original from being mutated.
    let data = (report && report.items)
      ? report.items
      : manifest.items.map((item) =>
        _.omit(item, ['_id', '__v', 'manifest', 'description', 'priority', 'tax', 'report']))
    return (
      <section>
        <hr />
        <h2>{`${_.capitalize(manifest.type)} Award (#${awardNumber})`}</h2>
        <h3>Budget Number</h3>
        <FormItem label='Budget Number' {...layout} hasFeedback={feedback(form, 'budget')} help={help(form, 'budget')} >
          {form.getFieldDecorator('budget', rules.required)(
            <Input onPressEnter={(e) => this.handleBudget(e.target.value)} />
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

Report.propTypes = {
  awardNumber: PropTypes.number,  //  used as the manifest index in store for this report.
  form: PropTypes.object,
  api: PropTypes.object,
  proposal: PropTypes.string, //  _id
  manifest: PropTypes.object,
  report: PropTypes.object
}
export default Report
