import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import api from '../../../../../services'
import _ from 'lodash'

import { Select, message } from 'antd'
const Option = Select.Option

import Spreadsheet, { Editors } from '../../../../../components/Spreadsheet'
const { SimpleNumber, TaxRate } = Editors

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
}, {
  name: 'Tax',
  key: 'tax',
  editable: true,
  editor: TaxRate,
  width: 85
}]
@connect(
    (state, props) => ({
      proposal: state.db.proposal._id,
      //  Use the most recent manifest as a baseline for this partial.
      manifest: state.db.proposal.manifests.slice(-1)[0],
      manifests: state.db.proposal.manifests,
      user: state.user._id
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  )
class Partial extends React.Component {
  static propTypes = {
    api: PropTypes.object,
    //  Proposal / Author-User ID
    user: PropTypes.string,
    proposal: PropTypes.string,
    manifests: PropTypes.array
  }
  constructor (props) {
    super(props)
    //  The user can specify the manifest they want to import items from.
    //  We collect the index from them. To start, we use the most recent budget.
    let index = this.props.manifests.length - 1 || 0
    this.state = { index }
  }
  handleChange = (index) => this.setState({ index })
  handleSubmit = (items, total) => {
    const { api, proposal, user } = this.props
    const partial = { proposal, type: 'partial', author: user, items, total }
    //  Nullify the update for proposal data.
    const update = { proposal: (prev, next) => prev }
    //  Post it - partials are a one-time deal, they aren't patched after the fact.
    api.post('manifest', partial, { update })
    .then(message.success(`Partial budget created! Please add it to the docket.`))
    .catch(err => {
      message.warning(`Failed to create partial budget - Unexpected client error`)
      console.warn(err)
    })
  }
  render (
    { manifests } = this.props,
    { index } = this.state
  ) {
    const { title, body, type, items, total } = manifests[index]
    const data = items.length > 0
      ? items.map(item => _.omit(item, ['_id', '__v', 'manifest', 'report']))
      : []
    const newData = { tax: 10.1, quantity: 1, price: 0 }
    return (
      <section>
        <h1>Partial Budgets</h1>
        <h4>For alternative budget choices, partial awards, etc.</h4>
        <p>Partial budgets are how we fund specific elements of a budget. The process involves us pulling data from a prior budget you can select below (the original proposal, a different partial, or supplemental award), making your modifications, and submitting it.</p>
        <p>When voting on a proposal, partials are a separate vote. This is for a variety of reasons, mostly so we can judge a proposal's merits objectively without factoring in any addenums that the committee has proposed.</p>
        <h4>Import items from:</h4>
        <Select value={index} style={{ width: '100%' }} onChange={this.handleChange}>
          {manifests.map((budget, i) => (
            <Option key={i} value={i} >{
              `Budget #${i + 1} (${_.capitalize(budget.type)}) ${budget.title ? ' - ' + budget.title : ''}`}</Option>
          ))}
        </Select>
        <h4>{title}</h4>
        <p>{body}</p>
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

export default Partial
