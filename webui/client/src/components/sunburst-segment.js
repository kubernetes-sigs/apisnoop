import React, { Component } from 'react'
import SunburstChart from './sunburst-chart'


class SunburstSegment extends Component {
render() {
  var {endpoints, release, sunburst} = this.props
  return (
      <div id='sunburst-segment' className='bg_washed-red pa4'>
      <h2>NAME OF RELEASE SHOULD GO HERE</h2>
      <SunburstChart
        sunburst={sunburst}
      />
    </div>
  )
}
}

export default SunburstSegment
