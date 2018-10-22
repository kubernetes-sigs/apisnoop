import React, { Component } from 'react'

import SunburstChart from './sunburst-chart'

class SunburstSegment extends Component {
  render() {
    return (
        <div id='sunburst-segment' className='bg_washed-red pa4'>
        <h2>{this.props.version} Sunburst Graph</h2>
        <SunburstChart sunburst={this.props.sunburst}/>
        </div>
   )
  }
}

export default SunburstSegment
