import React from 'react'
import PropTypes from 'prop-types'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import api from '../../../../../services'
import _ from 'lodash'

import { Select, Alert, message } from 'antd'
const Option = Select.Option

import { Boundary, Spreadsheet } from '../../../../../components'
/*
PARTIAL TAB:
Allows you to create a subset of a budget with more/less items
These can be "alternate" awards for partial or additional funding
both of which are common use cases

e.g. we want to fund 60k of a 100k ask for cloud computing credits
Create a partial here for 60k, then vote and approve it
*/
@connect(
    (state, props) => ({
      proposal: state.db.proposal._id,
      //  Use the most recent manifest as a baseline for this partial.
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
  handleSubmit = (items) => {
    const { api, proposal, user: author } = this.props
    const partial = { proposal, type: 'partial', author, items }
    const params = {
      populate: ['items'],
      transform: proposal => ({ proposal }),
      update: ({ proposal: (prev, next) => {
        let changed = Object.assign({}, prev)
        changed.manifests.push(next)
        return changed
      }})
    }
    //  Post it - partials are a one-time deal, they aren't patched after the fact.
    api.post('manifest', partial, params)
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
    const { title, body, items, total } = manifests[index]
    const data = items.length > 0
      ? items.map(item => _.omit(item, ['_id', '__v', 'manifest', 'report']))
      : []
    const newData = { tax: 10.1, quantity: 1, price: 0 }
    return (
      <section>
        <Boundary title='Partial Budget Wizard'>
          <Alert type='info' showIcon banner
            message='Partial Budgets'
            description='For alternative budget choices, partial awards, etc.'
          />
          <br />
          <p>Partial budgets are how we fund specific elements of a budget. The process involves us pulling data from a prior budget you can select below (the original proposal, a different partial, or supplemental award), making your modifications, and submitting it.</p>
          <p>When voting on a proposal, partials are a separate vote. This is for a variety of reasons, mostly so we can judge a proposal's merits objectively without factoring in any addenums that the committee has proposed.</p>
          <h4>Import items from:</h4>
          <Select value={index.toString()} style={{ width: '100%' }} onChange={this.handleChange}>
            {manifests.map((budget, i) => (
              <Option key={i} value={i.toString()} >{
                `Budget #${i + 1} (${_.capitalize(budget.type)}) ${budget.title ? ' - ' + budget.title : ''}`}</Option>
            ))}
          </Select>
          <h4>{title}</h4>
          <p>{body}</p>
          <Spreadsheet
            data={data}
            onSubmit={this.handleSubmit}
            disabled={false}
          />
        </Boundary>
      </section>
    )
  }
}

export default Partial
