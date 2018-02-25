import React from 'react'
import PropTypes from 'prop-types'

import { Sunburst, Hint } from 'react-vis'

const DIVERGING_COLOR_SCALE = ['#00939C', '#85C4C8', '#EC9370', '#C22E00']

const jss = {
  tooltip: {
    display: 'flex',
    color: '#fff',
    background: '#000',
    alignItems: 'center',
    padding: '5px'
  },
  box: { height: '16px', width: '16px', marginRight: 8 }
}
class PercentFunded extends React.Component {
  static propTypes = {
    year: PropTypes.number,
    statistics: PropTypes.array.isRequired
  }
  static defaultProps = {
    year: 2018
  }
  state = {
    //  Data follows D3 data conventions, look at the flare dataset for an example.
    data: {
      // That hex code tho
      color: '#d3d3d3',
      size: 0,
      children: []
    },
    hoveredCell: {}
  }
  componentWillReceiveProps (nextProps) {
    const { year, statistics } = nextProps
    //  statistics data loaded? Calculate funds per quarter
    if (Array.isArray(statistics) && statistics.length >= 0) {
      let { data } = this.state
      //  The kind of "status" indicators may change. Using given data,
      // iterate, then dynamically add child nodes to the newData
      let statusCounts = statistics.reduce(
        (accumulator, proposal) => {
          const { status } = proposal || {}
          Number.isInteger(accumulator[status])
            ? accumulator[status] += 1
            : accumulator[status] = 1
          return accumulator
        },
        {}
      )
      let newData = {
        title: `Proposals (${year})`,
        size: statistics.length,
        children: []
      }
      // Apply metadata / styles as you begin injecting child nodes into our dataset
      // const UW_COLORS = ['#00939C', '#85C4C8', '#EC9370', '#C22E00']
      for (let key of Object.keys(statusCounts)) {
        newData.children.push({ title: key, size: statusCounts[key] })
      }
      console.warn('Status Data', data)
      // Apply to our D3 dataset
      Object.assign(data, newData)
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
    { year, statistics } = this.props,
    { data, hoveredCell } = this.state
  ) {
    return (
      <div>
        <h2>{`Proposals Received: ${statistics.length}`}</h2>
        <Sunburst
          data={data}
          colorType='category'
          colorRange={DIVERGING_COLOR_SCALE}
          style={{ stroke: '#FFF' }}
          height={300}
          width={350}
          onValueMouseOver={this.onValueMouseOver}
          onValueMouseOut={this.onValueMouseOut}
          title='TEST'
        >
          {hoveredCell
            // Generates tooltips onMouseOver w/ dynamic JSS styles
            ? <Hint value={this.buildValue(hoveredCell)}>
              <div style={jss.tooltip}>
                <div style={{ ...jss.box, background: hoveredCell.color }} />
                {`${hoveredCell.size} ${hoveredCell.title}`}
              </div>
            </Hint>
          : null}
        </Sunburst>
      </div>
    )
  }
}

export default PercentFunded
