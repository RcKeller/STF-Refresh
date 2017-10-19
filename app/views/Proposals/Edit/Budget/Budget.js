import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { message } from 'antd'
import api from '../../../../services'

import Spreadsheet, { Editors } from '../../../../components/Spreadsheet'
const { SimpleNumber, TaxRate } = Editors

const columns = [{
  name: 'Priority #',
  key: 'priority',
  editable: true,
  editor: SimpleNumber,
  width: 85
}, {
  name: 'Name',
  key: 'name',
  editable: true,
  width: 300
}, {
  name: 'Description',
  key: 'description',
  editable: true
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
  name: 'Quantity',
  key: 'quantity',
  editable: true,
  editor: SimpleNumber,
  width: 85
}]

//  TODO: Testing with http://localhost:3000/edit/596e8a522465c05140e07d8f
@connect(
  state => ({
    proposal: state.db.proposal._id,
    manifest: state.db.proposal.manifests[0],
    type: 'original',
    id: state.db.proposal.manifests[0] ? state.db.proposal.manifests[0]._id : undefined
  }),
  dispatch => ({ api: bindActionCreators(api, dispatch) })
)
class Budget extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    api: PropTypes.object,
    proposal: PropTypes.string,
    manifest: PropTypes.object
  }
  handleSubmit = (items, total) => {
    if (total && total > 0) {
      let { api, proposal, type, id } = this.props
      const budget = { proposal, type, items, total }

      const params = {
        id,
        populate: ['items'],
        transform: proposal => ({ proposal }),
        update: ({ proposal: (prev, next) => {
          let change = Object.assign({}, prev, { manifests: [next] })
          return change
        }})
      }
      params.id
      ? api.patch('manifest', budget, params)
      .then(message.success('Budget updated!', 10))
      .catch(err => {
        message.warning('Budget failed to update - Unexpected client error', 10)
        console.warn(err)
      })
      : api.post('manifest', budget, params)
      .then(message.success('Budget created!', 10))
      .catch(err => {
        message.warning('Budget failed to update - Unexpected client error', 10)
        console.warn(err)
      })
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
