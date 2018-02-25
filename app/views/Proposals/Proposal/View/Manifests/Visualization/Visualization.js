import React from 'react'
import PropTypes from 'prop-types'
// import _ from 'lodash'

import { Sunburst, LabelSeries, Hint, DiscreteColorLegend } from 'react-vis'

import { connect } from 'react-redux'

const jss = {
  tooltip: {
    display: 'flex',
    color: '#fff',
    background: '#000',
    alignItems: 'center',
    padding: '5px'
  },
  box: { height: '16px', width: '16px', marginRight: 8 },
  labels: {
    primary: { fontSize: '46px', textAnchor: 'middle' },
    secondary: { fontSize: '16px', textAnchor: 'middle' }
  }
}

const DIVERGING_COLOR_SCALE = ['#00939C', '#85C4C8', '#EC9370', '#C22E00']

const currency = value => `$${Number.parseInt(value).toLocaleString()}`
/*
MANIFESTS VIEW: Renders the budgets associated with a proposal, starting with the most recent (or approved) manifest
*/
@connect(state => ({
  screen: state.screen
}))
class Visualization extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    screen: PropTypes.object
  }
  static defaultProps = {
    items: [],
    total: 0,
    screen: {}
  }
  state = {
    //  Data follows D3 data conventions, look at the flare dataset for an example.
    data: {
      // That hex code tho
      color: '#d9d9d9',
      size: 0,
      children: []
    },
    hoveredCell: {}
  }
  componentWillMount (props) {
    console.warn('CWM', this.props)
    this.transformData(this.props)
  }
  componentWillReceiveProps (nextProps) {
    const { items, total } = nextProps
    console.error('CWRP', items, total)
    this.transformData(nextProps)
  }
  transformData (nextProps) {
    const { items, total, originalTotal } = nextProps
    const { data } = this.state
    if (Array.isArray(items) && items.length >= 0) {
      // let { data } = this.state || {}
      let children = items.map(item => {
        const { price, quantity, tax, name } = item
        let size = price * quantity * (1 + (tax || 0) / 100)
        return { title: name, size }
      })
      // Push a child with the remaining balance - corrects the vis size
      children.push({
        title: '',
        color: '#FFF',
        size: originalTotal - total
      })
      Object.assign(data, { children })
      console.warn('DATA', data)
      this.setState({ data })
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
  onValueMouseOut= (v) => this.setState({ hoveredCell: false })

  render (
    { items, total, originalTotal, screen } = this.props,
    { data, hoveredCell } = this.state
  ) {
    let percentage = Number.parseInt((total / originalTotal) * 100)
    const labels = [
      { x: 0, y: -5, label: currency(total), style: jss.labels.primary },
      { x: 0, y: -20, label: percentage < 100 ? `${percentage}% of Original` : 'Fully Funded', style: jss.labels.secondary }
    ]
    return (
      <div>
        {items &&
          <Sunburst
            className='inline-visualization'
            data={data}
            // colorType='category'
            colorRange={DIVERGING_COLOR_SCALE}
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
                <div style={jss.tooltip}>
                  <em>{hoveredCell.title}</em>
                  <br />
                  {currency(hoveredCell.size)}
                </div>
              </Hint>
            : null}
          </Sunburst>
        }
      </div>
    )
  }
}

export default Visualization
