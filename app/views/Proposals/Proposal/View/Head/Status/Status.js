import React from 'react'
import PropTypes from 'prop-types'
// import _ from 'lodash'
import { connect } from 'react-redux'

import { indexOfApprovedManifest, proposalDecision } from '../../../../../../selectors'
import { Boundary } from '../../../../../../components'

import { Sunburst, LabelSeries, Hint } from 'react-vis'

const currency = value => `$${Number.parseInt(value).toLocaleString()}`

/*
STATUS COMPONENT:
Visualizes the proposal's status as a sunburst, broken down by items
Data source: The original proposal OR most recently approved budget
*/
@connect(state => ({
  manifests: state.db.proposal ? state.db.proposal.manifests : [],
  asked: state.db.proposal.asked,
  status: state.db.proposal.status,
  index: indexOfApprovedManifest(state),
  decision: proposalDecision(state)
}))
class Status extends React.Component {
  static propTypes = {
    manifests: PropTypes.array,
    asked: PropTypes.number,
    index: PropTypes.number,
    decision: PropTypes.object
  }
  static defaultProps = {
    manifests: [],
    asked: 0,
    index: 0,
    decision: {}
  }
  jss = {
    labels: {
      primary: { fill: '#4b2e83', fontSize: '46px', textAnchor: 'middle' },
      secondary: { fill: '#444444', fontSize: '16px', textAnchor: 'middle' }
    }
  }
  state = {
    //  Data follows D3 data conventions, look at the flare dataset for an example.
    data: {
      // That hex code tho
      color: '#d9d9d9',
      size: 0,
      children: []
    },
    hoveredCell: {},
    statusColor: '#4b2e83'
  }
  componentWillMount (props) {
    this.transformData(this.props)
  }
  componentWillReceiveProps (nextProps) {
    this.transformData(nextProps)
  }
  transformData (nextProps) {
    const { manifests, index, asked, decision } = nextProps
    const { items, total } = manifests[index] || {}

    //  Status colors
    const statusColor = (typeof decision.approved === 'boolean')
      ? (decision.approved ? '#4caf50' : '#ff7961')
      : '#4b2e83'

    //  D3 data transformation
    if (Array.isArray(items) && items.length >= 0) {
      const { data } = this.state
      let children = items.map(item => {
        const { price, quantity, tax, name } = item
        let size = price * quantity * (1 + (tax || 0) / 100)
        return { title: name, size, color: statusColor }
      })
      // Push a child with the remaining balance - corrects the vis size
      if ((asked - total) > 0) {
        children.push({
          title: 'Unfunded',
          color: '#FFF',
          size: (asked - total)
        })
      }
      Object.assign(data, { children })
      this.setState({ data, statusColor })
    }
  }

  // D3 utility - pulls the angle of a hovered cell, used to generate D3's styles
  buildValue (hoveredCell) {
    const { radius, angle, angle0 } = hoveredCell
    const truedAngle = (angle + angle0) / 2
    return {
      x: radius * Math.cos(truedAngle),
      y: radius * Math.sin(truedAngle)
    }
  }
  //  D3 events for selecting cells to pull data from for hints
  onValueMouseOver = (v) => this.setState({ hoveredCell: v.x && v.y ? v : false })
  onValueMouseOut = (v) => this.setState({ hoveredCell: false })
  color = (bool) => bool ? '#4caf50' : '#ff7961'

  render (
    { jss } = this,
    { manifests, index, asked, decision, status } = this.props,
    { data, hoveredCell, statusColor } = this.state
  ) {
    let { items, total } = manifests[index] || {}
    let percentage = Number.parseInt((total / asked) * 100)
    const caption = (typeof decision.approved === 'boolean' && decision.approved)
      ? status === 'Funded' ? 'Fully Funded' : `${percentage}% Funded`
      : status
    const labels = [
      { x: 0, y: -5, label: currency(total), style: Object.assign(jss.labels.primary, { fill: statusColor }) },
      { x: 0, y: -20, label: caption, style: jss.labels.secondary }
    ]
    return (
      <Boundary title='Status Visualization'>
        <Sunburst
          data={data}
          hideRootNode
          colorRange={[statusColor]}
          style={{ stroke: '#FFF' }}
          height={300}
          width={300}
          onValueMouseOver={this.onValueMouseOver}
          onValueMouseOut={this.onValueMouseOut}
        >
          <LabelSeries data={labels} />
          {hoveredCell && hoveredCell.title
            // Generates tooltips onMouseOver w/ dynamic JSS styles
            ? <Hint value={this.buildValue(hoveredCell)}>
              <div className='rv-tooltip'>
                {hoveredCell.title}
                <br />
                {currency(hoveredCell.size)}
              </div>
            </Hint>
          : null}
        </Sunburst>
      </Boundary>
    )
  }
}

export default Status
