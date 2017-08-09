import React from 'react'
import PropTypes from 'prop-types'

import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import api from '../../../../../services'
import { layout } from '../../../../../util/form'
import _ from 'lodash'

import { Form, message } from 'antd'
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
  handleSubmit = (items) => {
    let { api, proposal, manifest, report } = this.props
    report = { proposal, manifest: manifest._id, items }
    console.log('REPORT', report)
  }

  render ({ awardNumber, manifest, report } = this.props) {
    //  Use the associated manifest for initial data if report has not been created.
    //  Make sure to omit mongo data, preventing the original from being mutated.
    let data = (report && report.items)
      ? report.items
      : manifest.items.map((item) =>
        _.omit(item, ['_id', '__v', 'manifest', 'description', 'priority', 'tax', 'report']))
    return (
      <section>
        <h2>{`${_.capitalize(manifest.type)} Award (#${awardNumber})`}</h2>
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
  report: PropTypes.object
}
export default Report
