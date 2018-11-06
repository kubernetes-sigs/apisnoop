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
        <div id='sunburst-segment' className='bg_washed-red pa4 flex'>
        <div id='sunburst'>
        <h2>{this.props.release}</h2>
        {focusPathAsString.length > 0   ?
         <div>{focusPathAsString}</div> :
         <div>'Hover over Chart for Path'</div>
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
        <div id='test-tags'>
        {(interiorLabel && interiorLabel.test_tags) &&
         <ul className='list ph3 ph5-ns pv4'>
           {displayTestTags(interiorLabel.test_tags)}
         </ul>
        }
        </div>
      </div>
    )

    function displayTestTags (testTags) {
      return testTags.map(testTag => {
        return (<li key={testTag} className='dib mr1 mb2' >
                <p className='f6 f5-ns b db pa2 link dim dark-gray ba b--black-20'>
                {testTag}
                </p>
                </li>)
      })
    }
  }
}

export default SunburstSegment
