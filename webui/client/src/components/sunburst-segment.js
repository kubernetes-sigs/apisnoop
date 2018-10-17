import React, { Component } from 'react';
import Sunburst from './sunburst-chart';
import data from './sample-data'

class SunburstSegment extends Component {
  onSelect(event){
    console.log(event);
  }
  render() {
    console.log('hiiii from sunbusrt segment')
    return (
        <div>
        <h2>Sunburst</h2>
        <Sunburst
      data={data}
      onSelect={this.onSelect}
      scale="linear" // or exponential
      tooltipContent={<div class="sunburstTooltip" style="position:absolute; color:'black'; z-index:10; background: #e2e2e2; padding: 5px; text-align: center;" />} // eslint-disable-line
      tooltip
      tooltipPosition="right"
      keyId="anagraph"
      width="600"
      height="580"
        />
        </div>
    );
  }
}

export default SunburstSegment
