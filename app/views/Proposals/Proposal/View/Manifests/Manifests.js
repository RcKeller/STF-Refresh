import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { connect } from 'react-redux'

import { Alert, Select } from 'antd'
const Option = Select.Option

import Items from './Items/Items'

import { indexOfApprovedManifest } from '../../../../../selectors'
/*
MANIFESTS VIEW: Renders the budgets associated with a proposal, starting with the most recent (or approved) manifest
*/
@connect(state => ({
  manifests: state.db.proposal ? state.db.proposal.manifests : [],
  asked: state.db.proposal.asked,
  initialIndex: indexOfApprovedManifest(state)
}))
class Manifests extends React.Component {
  static propTypes = {
    manifests: PropTypes.array,
    asked: PropTypes.number,
    initialIndex: PropTypes.number
  }
  static defaultProps = {
    manifests: [],
    asked: 0
    // initialIndex
  }
  constructor (props) {
    super(props)
    this.state = { index: props.initialIndex }
  }
  handleChange (value) {
    this.setState({ index: value })
  }
  componentWillReceiveProps (nextProps) {
    if (this.props.initialIndex !== nextProps.initialIndex) {
      this.setState({ index: nextProps.initialIndex })
    }
  }
  render (
    { asked, manifests, screen } = this.props,
    { index } = this.state
  ) {
    let manifest = manifests[index] || {}
    return (
      <div>
        {manifests.length > 1 &&
          <Alert type='info' banner showIcon={false}
            message='Multiple Budgets'
            description={<div>
              <p>
                This proposal has multiple manifests as a result of partial awards or supplementals. The most recent one has automatically been selected. Feel free to select another below.
              </p>
              <Select size='large' style={{ width: '100%' }}
                defaultValue={index.toString()}
                onChange={(value) => this.handleChange(value)}
              >
                {manifests.map((m, i) =>
                  <Option key={i} value={i.toString()}><h4>{`
                    ${m.title ? m.title : _.capitalize(m.type)}
                    ${m.author ? ` by ${m.author.name} - ` : ' - '}
                    ${m.decision ? m.decision.approved ? 'Approved' : 'Denied' : 'Proposed'}
                  `
                }</h4></Option>
                )}
              </Select>
            </div>
          } />
        }
        <Items {...manifest} originalTotal={asked} />
      </div>
    )
  }
}

export default Manifests
