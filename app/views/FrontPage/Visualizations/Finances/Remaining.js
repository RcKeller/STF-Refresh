import React from 'react'

import { Sunburst } from 'react-vis'

const data = {
  'title': 'analytics',
  'color': '#12939A',
  'children': [
    {
      'title': 'cluster',
      'children': [
    {'title': 'AgglomerativeCluster', 'color': '#12939A', 'size': 3938},
    {'title': 'CommunityStructure', 'color': '#12939A', 'size': 3812},
    {'title': 'HierarchicalCluster', 'color': '#12939A', 'size': 6714},
    {'title': 'MergeEdge', 'color': '#12939A', 'size': 743}
      ]
    },
    {
      'title': 'graph',
      'children': [
    {'title': 'BetweennessCentrality', 'color': '#12939A', 'size': 3534},
    {'title': 'LinkDistance', 'color': '#12939A', 'size': 5731},
    {'title': 'MaxFlowMinCut', 'color': '#12939A', 'size': 7840},
    {'title': 'ShortestPaths', 'color': '#12939A', 'size': 5914},
    {'title': 'SpanningTree', 'color': '#12939A', 'size': 3416}
      ]
    },
    {
      'title': 'optimization',
      'children': [
    {'title': 'AspectRatioBanker', 'color': '#12939A', 'size': 7074}
      ]
    }
  ]
}

const DIVERGING_COLOR_SCALE = ['#00939C', '#85C4C8', '#EC9370', '#C22E00']

class Remaining extends React.Component {
  static propTypes = {}
  static defaultProps = {}
  render (
    { config } = this.props
  ) {
    return (
      <div>
        {/* <Sunburst
          hideRootNode
          colorType='literal'
          data={data}
          height={300}
          width={350}
        /> */}
        {/* <Sunburst
          animation={{damping: 20, stiffness: 300}}
          data={data}
          colorType={'category'}
          colorRange={DIVERGING_COLOR_SCALE}
          style={{stroke: '#fff'}}
          height={300}
          width={350} /> */}
      </div>
    )
  }
}

export default Remaining
