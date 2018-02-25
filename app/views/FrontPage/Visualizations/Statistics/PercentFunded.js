import React from 'react'
import PropTypes from 'prop-types'

import { Sunburst, Hint } from 'react-vis'

const DIVERGING_COLOR_SCALE = ['#00939C', '#85C4C8', '#EC9370', '#C22E00']
const statusColors = {
  'Draft': '#d3d3d3',
  'Submitted': '#8eacbb',
  'In Review': '#6ec6ff',
  'Awaiting Decision': '#2196f3',
  'Funded': '#4caf50',
  'Partially Funded': '#80e27e',
  'Denied': '#ff7961',
  'Withdrawn': '#34515e'
}

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
      color: '#4b2e83',
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
      // Iterate over stats, creating a list of quarters with children
      // that count the amount of proposals with Y status indicator.
      // e.g. { Winter: children: [{ title: 'In Review', size: 3 }]}
      let statusByQuarter = statistics.reduce(
        (accumulator, proposal) => {
          const { quarter, status } = proposal || {}
          // Find index of the "size" node per quarter and status indicator
          console.log(quarter, status, accumulator[quarter])
          // NOTE: If you accumulate sizes per quarter here, it alters the vis.
          // accumulator[quarter].size += 1
          const indexOfStatusForQuarter = accumulator[quarter]
            .children.findIndex(child => child.title === status)
          // Update or initialize the child node in question
          indexOfStatusForQuarter >= 0
            ? accumulator[quarter]
              .children[indexOfStatusForQuarter].size += 1
            : accumulator[quarter]
              .children.push({ title: status, color: statusColors[status], size: 1 })
          return accumulator
        },
        {
          Autumn: { color: '#bf360c', children: [], size: 0 },
          Winter: { color: '#01579b', children: [], size: 0 },
          Spring: { color: '#1b5e20', children: [], size: 0 }
        }
      )
      let newData = {
        title: `Proposals (${year})`,
        // size: statistics.length,
        children: []
      }
      // Apply metadata / styles as you begin injecting child nodes into our dataset
      // const UW_COLORS = ['#00939C', '#85C4C8', '#EC9370', '#C22E00']
      for (let key of Object.keys(statusByQuarter)) {
        const { color, children } = statusByQuarter[key]
        newData.children.push({ title: key, color, children })
      }
      console.warn('Quarter / Status Data', data)
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

  // Per D3 schema, size is only kept in child leaves
  // getSize iterates through a parent and counts its
  // size via closure and a recursive function
  getSizeOfParent = (parent) => {
    if (parent.size) {
      return parent.size
    } else {
      let count = 0
      // Recursively count child nodes, the size prop is the target val
      const countLeaves = (node) => {
        if (node.children) {
          for (let child of node.children) {
            // Has children
            if (child.children) {
              countLeaves(child)
            // Has leaves
            } else if (child.size) {
              count += child.size
            }
          }
        }
      }
      countLeaves(parent)
      return count
    }
  }

  render (
    { year, statistics } = this.props,
    { data, hoveredCell } = this.state
  ) {
    return (
      <div>
        <h2>{`Proposals Received: ${statistics.length}`}</h2>
        <Sunburst
          data={data}
          colorType='literal'
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
                {`${this.getSizeOfParent(hoveredCell)} ${hoveredCell.title}`}
              </div>
            </Hint>
          : null}
        </Sunburst>
      </div>
    )
  }
}

export default PercentFunded
