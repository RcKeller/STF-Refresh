import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import api from '../../../../../services'
// import { layout, feedback, help, rules } from '../../../../../util/form'
import _ from 'lodash'

import { message } from 'antd'

import SpreadSheet, { Editors } from '../../../../../components/SpreadSheet'
const { SimpleNumber } = Editors

//  BUG: Selectors cannot select child props. Is this case handled in the data-grid docs?
const columns = [{
  name: 'Name',
  key: 'name',
  editable: true
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
    (state, props) => ({
      proposal: state.db.proposal._id,
      //  Use the most recent manifest as a baseline for this partial.
      manifest: state.db.proposal.manifests.slice(-1)[0]
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  )
class Partial extends React.Component {
  handleSubmit = (items) => {
    const { api, proposal, manifest } = this.props
    console.log('ITEMS', items)
    const partial = { proposal, type: 'partial', items }
    //  Nullify the update for proposal data.
    const update = { proposal: (prev, next) => prev }
    //  Post it - partials are a one-time deal, they aren't patched after the fact.
    api.post('manifest', partial, { update })
    .then(message.success(`Partial budget created! Please add it to the docket.`))
    .catch(err => {
      message.warning(`Failed to create partial budget - Unexpected client error`)
      console.warn(err)
    })


    //  Verify that the budget number (and hopefully other data) is there, add it to what we know.
    // form.validateFields((err, values) => {
    //   if (!err) {
    //     items = items.map((item) => _.omit(item, ['_id', '__v']))
    //     let report = { proposal, manifest: manifest._id, items }
    //     //  Hydrate the report with form data
    //     report = Object.assign(report, values)
    //     console.log('REPORT', report)
    //     this.props.report
    //     ? api.patch('report', report, { id: this.props.report._id })
    //     : api.post('report', report)
    //     .then(message.success('Report updated!'))
    //     .catch(err => {
    //       message.warning('Report failed to update - Unexpected client error')
    //       console.warn(err)
    //     })
    //   } else {
    //     message.warning('We need the budget number for charging to this budget.')
    //   }
    // })
  }
  //  NOTE: Good for testing:
  //  http://localhost:3000/proposals/2017/39061
  //  http://localhost:3000/proposals/2017/94939

  render ({ manifest } = this.props) {
    //  Use the associated manifest for initial data for creating a partial
    let data = manifest.items.map((item) =>
        _.omit(item, ['_id', '__v', 'manifest', 'report']))
    console.log('DATA', data)
    return (
      <section>
        <SpreadSheet
          columns={columns}
          data={data}
          onSubmit={this.handleSubmit}
        />
      </section>
    )
  }
}

Partial.propTypes = {
  api: PropTypes.object,
  proposal: PropTypes.string, //  _id
  manifest: PropTypes.object
}
export default Partial
