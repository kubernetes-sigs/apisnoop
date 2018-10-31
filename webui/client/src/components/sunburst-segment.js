import React, { Component } from 'react'
import SunburstChart from './sunburst-chart'


class SunburstSegment extends Component {
  render() {
    var {sunburst, focusChart} = this.props
    return (
        <div id='sunburst-segment' className='bg_washed-red pa4'>
        <h2>{this.props.release}</h2>
        <SunburstChart
          sunburst={sunburst}
          focusChart={focusChart}
        />
        </div>
    )
  }
}

export default SunburstSegment
