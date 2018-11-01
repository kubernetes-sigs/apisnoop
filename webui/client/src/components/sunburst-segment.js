import React, { Component } from 'react'
import SunburstChart from './sunburst-chart'


class SunburstSegment extends Component {
  render() {
    const {sunburst,
           focusChart,
           focusPathAsString,
           unfocusChart} = this.props

    return (
        <div id='sunburst-segment' className='bg_washed-red pa4'>
        <h2>{this.props.release}</h2>
        {focusPathAsString.length > 0 ? <div>{focusPathAsString}</div>
               : <div>'Hover over Chart for Path'</div>
      }
        <SunburstChart
          sunburst={sunburst}
          focusChart={focusChart}
          unfocusChart={unfocusChart}
          focusPathAsString={focusPathAsString}
        />
        </div>
    )
  }
}

export default SunburstSegment
