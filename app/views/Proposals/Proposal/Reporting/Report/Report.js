import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { message } from 'antd'
import api from '../../../../../services'

import SpreadSheet, { Editors } from '../../../../../components/SpreadSheet'
const { SimpleNumber } = Editors

//  BUG: Selectors cannot select child props. Is this case handled in the data-grid docs?
const columns = [{
  name: 'Name',
  key: 'name',
  editable: false
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

@connect(
  state => ({
    parent: state.db.proposal._id,
    budget: state.db.proposal.budget,
    //  Use the most recent report (target document) and recent manifest (initial data)
    report: state.db.proposal.reports && state.db.proposal.reports.slice(-1)[0],
    manifest: state.db.proposal.manifests && state.db.proposal.manifests.slice(-1)[0]
  }),
  dispatch => ({ api: bindActionCreators(api, dispatch) })
)
class Report extends React.Component {
  handleSubmit = (items) => {
    console.log('HANDLE SUBMIT', items)
    let { api, budget, report } = this.props
    report = {
      budget,
      items
    }
    console.log(report)
  }
  render ({ budget, report, manifest } = this.props) {
    //  Use the most recent manifest for initial data if report has not been created.
    const data = report && report.items ? report.items : manifest.items
    return (
      <section>
        <h1>Budget Reporting</h1>
        <h3>{`Organization Budget Code: ${budget}`}</h3>
        <p>Lorem ipsum, why we do this...</p>
        <SpreadSheet
          columns={columns}
          data={data}
          newData={{tax: 10.1}}
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
