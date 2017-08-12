import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import api from '../../../../../services'
// import { layout, feedback, help, rules } from '../../../../../util/form'
import _ from 'lodash'

import { InputNumber, Select, message } from 'antd'
const Option = Select.Option

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
      manifest: state.db.proposal.manifests.slice(-1)[0],
      manifests: state.db.proposal.manifests
    }),
    dispatch => ({ api: bindActionCreators(api, dispatch) })
  )
class Partial extends React.Component {
  constructor (props) {
    super(props)
    //  The user can specify the manifest they want to import items from.
    //  We collect the index from them. To start, we use the most recent budget.
    let index = this.props.manifests.length - 1 || 0
    this.state = { index }
  }
  handleChange = (index) => this.setState({ index })
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
  }
  render (
    { manifests } = this.props,
    { index } = this.state
  ) {
    const { title, body, type, items } = manifests[index]
    const data = items.length > 0
      ? items.map(item => _.omit(item, ['_id', '__v', 'manifest', 'report']))
      : []
    console.log(data)
    return (
      <section>
        <p>Partial budgets are how we fund specific elements of a budget. The process involves us pulling data from a prior budget you can select below (the original proposal, a different partial, or supplemental award), making your modifications, and submitting it.</p>
        <p>When voting on a proposal, partials are a separate vote. This is for a variety of reasons, mostly so we can judge a proposal's merits objectively without factoring in any addenums that the committee has proposed.</p>
        {/* <h4>{`Budget #${index + 1} (${_.capitalize(type)})`}</h4>
        <h4>{title}</h4> */}
        <Select value={index} style={{ width: '100%' }} onChange={this.handleChange}>
          {manifests.map((budget, i) => (
            <Option key={i} value={i} ><h4>{
              `Budget #${i + 1} (${_.capitalize(budget.type)}) ${budget.title ? ' - ' + budget.title : ''}`}</h4></Option>
          ))}
        </Select>
        <h4>{title}</h4>
        <p>{body}</p>
        {/* <InputNumber min={1} max={manifests.length} value={selected} onChange={this.handleChange} /> */}
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
  //  Proposal ID
  proposal: PropTypes.string,
  manifests: PropTypes.array
}
export default Partial