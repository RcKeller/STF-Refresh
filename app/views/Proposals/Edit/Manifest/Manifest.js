import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { message } from 'antd'
import api from '../../../../services'

import SpreadSheet, { Editors } from '../../../../components/SpreadSheet'
const { SimpleNumber, TaxRate } = Editors

const columns = [{
  name: 'Name',
  key: 'name',
  editable: true,
  width: 300
}, {
  name: 'Description',
  key: 'description',
  editable: true
  //  Takes up remaining width.
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
}, {
  name: 'Priority',
  key: 'priority',
  editable: true,
  editor: SimpleNumber,
  width: 85
}]

//  TODO: Testing with http://localhost:3000/edit/596e8a522465c05140e07d8f
@connect(
  state => ({
    proposal: state.db.proposal._id,
    manifest: state.db.proposal.manifests[0]
  }),
  dispatch => ({ api: bindActionCreators(api, dispatch) })
)
class Manifest extends React.Component {
  handleSubmit = (items, total) => {
    console.log('HANDLE SUBMIT', items, total)
    let { api, proposal, manifest } = this.props
    const budget = { proposal, type: 'original', items, total }
    const id = manifest && manifest._id
    const update = {  //  Replace publication status only.
      proposal: (prev, next) =>
        next && next.manifests
        ? Object.assign(prev, { manifests: next.manifests })
        : prev
    }
    manifest
    ? api.patch('manifest', budget, { id, update })
    : api.post('manifest', budget, { update })
    .then(message.success(`Updated budget manifest!`))
    .catch(err => {
      message.warning(`Failed to update budget manifest - Unexpected client error`)
      console.warn(err)
    })
  }
  render ({ manifest } = this.props) {
    const data = manifest ? manifest.items : []
    const newData = { tax: 10.1, quantity: 1, price: 0 }
    const total = manifest && manifest.total
    return (
      <div>
        <p>Enter your budget requirements here. Tax MUST be included and will automatically default at 10.1% (Seattle's tax rate)</p>
        <SpreadSheet financial
          columns={columns}
          data={data}
          newData={newData}
          onSubmit={this.handleSubmit}
          total={total}
        />
      </div>
    )
  }
}
Manifest.propTypes = {
  api: PropTypes.object,
  proposal: PropTypes.string,
  manifest: PropTypes.object
}
export default Manifest
