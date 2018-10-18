// Copyright (c) 2016 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, { Component } from 'react';
import { Sunburst, LabelSeries } from 'react-vis'
import flareData from '../sample-data/flareData.json'

const LABEL_STYLE = {
  fontSize: '20px',
  textAnchor: 'middle'
}

/**
* Recursively work backwards from highlighted node to find path of valid nodes
* @param {Object} node - the current node being considered
* @returns {Array} - an array of strings describing the key route to teh current node.
*/

function getKeyPath (node) {
  if (!node.parent) {
    return ['root']
  }

  return [(node.data && node.data.name) || node.name].concat(
    getKeyPath(node.parent)
  )
}

/**
  * Recursivey modify data depending on whetehr or not each cell has been selected by the hover/hlighlight
  * @param {Object} data - the current node being considered
  * @param {Object|Boolean} keyPath - a map of keys that are in the highlight path
  * if this is false then all nodes are marked as selected.
  * @returns {Object} Updated tree structure
  */

function updateData (data, keyPath) {
  if (data.children) {
    data.children.map(child => updateData(child,  keyPath))
  }
  // add a fill to all the uncolored cells
  if (!data.hex) {
    data.style = { fill: 'aliceBlue' }
  }
  data.style = {
    ...data.style,
    fillOpacity: keyPath && !keyPath[data.name] ? 0.2 : 1
    // if there's a keypath AND that keypath has a data.name, then 0.2
  }

  return data
}

// sets up initial coloring of chart.
const decoratedData = updateData(flareData, false)

export default class BasicSunburst extends Component {
  constructor(props) {
    super(props)
      this.state = {
        pathValue: false,
        data: decoratedData,
        finalValue: 'SUNBURST',
        clicked: false
      }
  }


  render() {
    const {clicked, data, finalValue, pathValue} = this.state
    return (
        <div className='basic-sunburst-wrapper'>
          <div>
          {clicked ? 'click to unlock selection' : 'click to lock selection'}
        </div>
        <Sunburst
      animation
      className='basic-sunburst-example'
      hideRootNode
      // when you click on the chart, set clicked to the opposite of what it is currently.
      onValueMouseOver={node => {
        if (clicked) {
          return
        }
        const path = getKeyPath(node).reverse()
        const pathAsMap = path.reduce((res, row) => {
          console.log({res,row})
          console.log({resRow: res[row]})
          res[row] = true
          return res
        }, {})
        this.setState({
          finalValue: path[path.length - 1],
          pathValue: path.join(' > '),
          data: updateData(decoratedData, pathAsMap)
        })
      }}
      onValueMouseOut={()=>
          clicked
          ? () => {} // an empty function, essentially 'do nothing'
          : this.setState({
            pathValue: false,
            finalValue: false,
            data: updateData(decoratedData, false)
          })
        }
      onValueClick={()=> this.setState({clicked: !clicked})}
      style={{
        stroke: '#ddd',
        strokeOpacity: 0.3,
        strokeWidth: '0.5'
      }}
      // colorType is a style for react-vis. literal means 'literally the color palette given'
      colorType="literal"
      getSize={d => d.value}
      getColor={d => d.hex}
      data={data}
      height={600}
      width={700}
      >
{finalValue && (
    <LabelSeries
  data={[{x: 0, y: 0, label: finalValue, style: LABEL_STYLE}]}
    />
)}
</Sunburst>
        <div className='basic-sunburst-example-path-name'>{pathValue}</div>
        </div>
    )
  }
}
