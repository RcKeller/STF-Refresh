import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { message } from 'antd'
import api from '../../../../services'

import Spreadsheet, { Editors } from '../../../../components/Spreadsheet'
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
class Budget extends React.Component {
  static propTypes = {
    api: PropTypes.object,
    validate: PropTypes.func,
    proposal: PropTypes.string,
    manifest: PropTypes.object
  }
  handleSubmit = (items, total) => {
    if (total && total > 0) {
      let { api, proposal, manifest, validate, forceRequest } = this.props
      const budget = { proposal, type: 'original', items, total }
      const id = manifest && manifest._id
      const transform = res => ({ proposal: res })
      const update = { proposal: (prev, next) => {
        let newData = Object.assign({}, prev)
        newData.manifests[0] = next
        return newData
      }}
      manifest
      ? api.patch('manifest', budget, { id })
      : api.post('manifest', budget, { })
      .then(message.success(`Updated budget manifest!`))
      .catch(err => {
        message.warning(`Failed to update budget manifest - Unexpected client error`)
        console.warn(err)
      })
      //  Silent update of the proposal ask
      const updateAsk = { proposal: (prev, next) => {
        const newData = Object.assign({}, prev)
        newData.asked = next.asked
        return newData
      }}
      api.patch('proposal', { asked: total }, { id: proposal, update: updateAsk })
      // .then(forceRequest())
      .catch(err => {
        message.warning(`Failed to update proposal data - Unexpected client error`)
        console.warn(err)
      })
      validate()
    } else {
      message.error('Budgets must cost at least something!', 10)
    }
  }
  render ({ manifest } = this.props) {
    const data = manifest ? manifest.items : []
    const newData = { tax: 10.1, quantity: 1, price: 0 }
    const total = manifest && manifest.total
    return (
      <div>
        <Spreadsheet financial
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
export default Budget
