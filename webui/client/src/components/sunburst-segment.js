import React, { Component } from 'react'
import SunburstChart from './sunburst-chart'


class SunburstSegment extends Component {
render() {
  var {endpoints, release, sunburst} = this.props
  return (
      <div id='sunburst-segment' className='bg_washed-red pa4'>
      <h2>{release}</h2>
      <SunburstChart
        release={release}
        sunburst={sunburst}
        endpoints={endpoints}
      />
    </div>
  )
}
}

export default SunburstSegment
