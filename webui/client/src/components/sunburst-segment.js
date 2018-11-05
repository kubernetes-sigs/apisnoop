import React, { Component } from 'react'
import SunburstChart from './sunburst-chart'


class SunburstSegment extends Component {
  render() {
    const {endpoints,
           focusChart,
           focusPath,
           focusPathAsString,
           interiorLabel,
           sunburst,
           unfocusChart} = this.props

    return (
        <div id='sunburst-segment' className='bg_washed-red pa4'>
        <h2>{this.props.release}</h2>
        {focusPathAsString.length > 0 ? <div>{focusPathAsString}</div>
               : <div>'Hover over Chart for Path'</div>
      }
        <SunburstChart
          sunburst={sunburst}
          endpoints={endpoints}
          focusChart={focusChart}
          focusPath={focusPath}
          focusPathAsString={focusPathAsString}
          interiorLabel={interiorLabel}
          unfocusChart={unfocusChart}
        />
        </div>
    )
  }
}

export default SunburstSegment
