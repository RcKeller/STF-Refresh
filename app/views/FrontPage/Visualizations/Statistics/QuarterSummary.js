import React from 'react'

import { Sunburst } from 'react-vis'

class QuarterSummary extends React.Component {
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

export default QuarterSummary
