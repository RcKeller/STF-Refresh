import React from 'react'
import PropTypes from 'prop-types'

import { Sunburst, LabelSeries, Hint, DiscreteColorLegend } from 'react-vis'
import { quarterColors, brandColors } from '../../colors'
import { quarterlyFundingLegend } from '../../legends'

const currency = value => `$${Number.parseInt(value).toLocaleString()}`

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
    primary: { fill: brandColors['Purple'], fontSize: '28px', textAnchor: 'middle' },
    secondary: { fill: brandColors['Dark Gray'], fontSize: '16px', textAnchor: 'middle' }
  }
}
class Allocated extends React.Component {
  static propTypes = {
    annualFunds: PropTypes.number.isRequired,
    blockFunding: PropTypes.number,
    year: PropTypes.number,
    funding: PropTypes.array.isRequired
  }
  static defaultProps = {
    annualFunds: 0,
    blockFunding: 0,
    year: 2018
  }
  state = {
    //  Data follows D3 data conventions, look at the flare dataset for an example.
    data: {
      color: brandColors.Gold
    },
    remainingFunding: 0,
    hoveredCell: {}
  }
  componentWillReceiveProps (nextProps) {
    const { annualFunds, blockFunding, funding } = nextProps
    //  Funding data loaded? Calculate funds per quarter
    if (Array.isArray(funding) && funding.length >= 0) {
      let { data } = this.state
      // Create a mapping of quarters and block funding to funding this year
      const fundingByType = funding.reduce(
        (accumulator, proposal) => {
          const { quarter, received } = proposal || {}
          accumulator[quarter] += (received || 0)
          return accumulator
        },
        { Autumn: 0, Winter: 0, Summer: 0, Blocks: blockFunding || 0 }
      )
      const remainingFunding = annualFunds - Object.keys(fundingByType).reduce(
        (accumulator, key) => accumulator + fundingByType[key],
        0
      )
      // Apply to our D3 dataset
      Object.assign(data, {
        children: [
          { title: 'Autumn', color: quarterColors.Autumn, size: fundingByType.Autumn },
          { title: 'Winter', color: quarterColors.Winter, size: fundingByType.Winter },
          { title: 'Spring', color: quarterColors.Spring, size: fundingByType.Spring },
          { title: 'Blocks / Special Projects', color: brandColors['Purple'], size: fundingByType.Blocks },
          { title: 'Remaining Funding', color: brandColors['Light Gray'], size: remainingFunding }
        ]
      })
      this.setState({ data, remainingFunding })
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
    { annualFunds, year, funding } = this.props,
    { data, hoveredCell } = this.state
  ) {
    const labels = [
      { x: 0, y: 0, label: currency(annualFunds), style: jss.labels.primary },
      { x: 0, y: -20, label: `${year} Budget`, style: jss.labels.secondary }
    ]
    return (
      <div>
        <Sunburst
          data={data}
          colorType='literal'
          style={{ stroke: '#FFF' }}
          height={250}
          width={300}
          onValueMouseOver={this.onValueMouseOver}
          onValueMouseOut={this.onValueMouseOut}
          title='TEST'
        >
          <LabelSeries data={labels} />
          {hoveredCell && hoveredCell.size > 0
            // Generates tooltips onMouseOver w/ dynamic JSS styles
            ? <Hint value={this.buildValue(hoveredCell)}>
              <div style={jss.tooltip}>
                <div style={{ ...jss.box, background: hoveredCell.color }} />
                {hoveredCell.title}
                <br />
                {currency(hoveredCell.size)}
              </div>
            </Hint>
          : null}
        </Sunburst>
        <DiscreteColorLegend items={quarterlyFundingLegend} orientation='horizontal' />
      </div>
    )
  }
}

export default Allocated
