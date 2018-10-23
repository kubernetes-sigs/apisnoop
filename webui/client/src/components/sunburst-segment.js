import React, { Component } from 'react'

import SunburstChart from './sunburst-chart'

class SunburstSegment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      agentFilter: 'e2e',
      filteredSunburst: {},
      sunburst: {}
    }
  }

  componentdidMount(){
  }

render() {
  const sunburst = this.props.sunburst.sunburst
  return (
      <div id='sunburst-segment' className='bg_washed-red pa4'>
      <h2>{this.props.version} Sunburst Graph</h2>
      <SunburstChart sunburst={sunburst}/>
    </div>
  )
}
}

export default SunburstSegment
