import React from 'react'
import PropTypes from 'prop-types'

import { Sunburst } from 'react-vis'

// const data = {
//   'title': 'analytics',
//   'color': '#12939A',
//   'children': [
//     {
//       'title': 'cluster',
//       'children': [
//     {'title': 'AgglomerativeCluster', 'color': '#12939A', 'size': 3938},
//     {'title': 'CommunityStructure', 'color': '#12939A', 'size': 3812},
//     {'title': 'HierarchicalCluster', 'color': '#12939A', 'size': 6714},
//     {'title': 'MergeEdge', 'color': '#12939A', 'size': 743}
//       ]
//     },
//     {
//       'title': 'graph',
//       'children': [
//     {'title': 'BetweennessCentrality', 'color': '#12939A', 'size': 3534},
//     {'title': 'LinkDistance', 'color': '#12939A', 'size': 5731},
//     {'title': 'MaxFlowMinCut', 'color': '#12939A', 'size': 7840},
//     {'title': 'ShortestPaths', 'color': '#12939A', 'size': 5914},
//     {'title': 'SpanningTree', 'color': '#12939A', 'size': 3416}
//       ]
//     },
//     {
//       'title': 'optimization',
//       'children': [
//     {'title': 'AspectRatioBanker', 'color': '#12939A', 'size': 7074}
//       ]
//     }
//   ]
// }

const DIVERGING_COLOR_SCALE = ['#00939C', '#85C4C8', '#EC9370', '#C22E00']

class Allocated extends React.Component {
  static propTypes = {
    annualFunds: PropTypes.number.isRequired,
    blockFunding: PropTypes.number,
    funding: PropTypes.array.isRequired
  }
  static defaultProps = {
    annualFunds: 0,
    blockFunding: 0
  }
  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
  }
  componentWillReceiveProps (nextProps) {
    const { annualFunds, blockFunding, funding } = nextProps
    if (Array.isArray(funding) && funding.length >= 0) {
      // const Autumn = funding.reduce((accumulator, proposal) =>
      //   proposal.quarter === 'Autumn' && proposal.received > 0
      //   ? accumulator + proposal.received
      //   : accumulator
      // )
      const Autumn = funding
        .filter(proposal => proposal.quarter === 'Autumn')
        .reduce(
          (accumulator, proposal) => accumulator + (proposal.received || 0),
          0
        )
      const Winter = funding
        .filter(proposal => proposal.quarter === 'Winter')
        .reduce(
          (accumulator, proposal) => accumulator + (proposal.received || 0),
          0
        )
      const Summer = funding
        .filter(proposal => proposal.quarter === 'Summer')
        .reduce(
          (accumulator, proposal) => accumulator + (proposal.received || 0),
          0
        )
      const Blocks = blockFunding || 0
      console.warn('Awards per quarter', Autumn, Winter, Summer, Blocks)
      let data = {
        title: 'Funding Allocated',
        color: '#b7a57a',
        size: annualFunds,
        children: [
          { title: 'Autumn', color: '#bf360c', size: Autumn },
          { title: 'Winter', color: '#01579b', size: 200000 },
          { title: 'Summer', color: '#1b5e20', size: 300000 },
          { title: 'Blocks', color: '#4b2e83', size: Blocks }
        ]
      }
      // let placeholder = []
      this.setState({ data })
    }
  }
  render (
    { funding } = this.props,
    { data } = this.state
  ) {
    console.warn('ALLOCATED', funding, data)
    return (
      <div>
        {/* <Sunburst
          hideRootNode
          colorType='literal'
          data={data}
          height={300}
          width={350}
        /> */}
        <h2>2018 Funding Cycle</h2>
        <Sunburst
          data={data}
          animation={{ damping: 20, stiffness: 300 }}
          colorType='literal'
          style={{ stroke: '#FFF' }}
          height={300}
          width={350} />
      </div>
    )
  }
}

export default Allocated
