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
import { buildJsonHierarchy } from '../lib/utils'
import { connect } from 'react-redux'
import { Sunburst, LabelSeries } from 'react-vis'

const LABEL_STYLE = {
  fontSize: '20px',
  textAnchor: 'middle'
}

class BasicSunburst extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pathValue: false,
      data: {},
      finalValue: 'SUNBURST',
      clicked: false
    }
    this.decoratedData = {}
    this.updateData = this.updateData.bind(this)
    this.getKeyPath = this.getKeyPath.bind(this)
  }
  
  
  componentDidMount() {
    this.decoratedData = this.updateData(this.props.flareData, false)
    this.setState({data: this.decoratedData})
  }
  /**
   * Recursively work backwards from highlighted node to find path of valid nodes
   * @param {Object} node - the current node being considered
   * @returns {Array} - an array of strings describing the key route to teh current node.
   */
  
  getKeyPath (node) {
    if (!node.parent) {
      return ['root']
    }
  
    return [(node.data && node.data.name) || node.name].concat(
      this.getKeyPath(node.parent)
    )
  }
  updateData (data, keyPath) {
    if (data.children) {
      data.children.map(child => this.updateData(child,  keyPath))
    }
    // add a fill to all the uncolored cells
    if (!data.hex) {
      data.style = { fill: 'lightgray' }
    }
    data.style = {
      ...data.style,
      fillOpacity: keyPath && !keyPath[data.name] ? 0.2 : 1
      // if there's a keypath AND that keypath has a data.name, then 0.2
    }
  
    return data
  }
  
  render() {
    const {clicked, data, finalValue, pathValue} = this.state
    const updateData = this.updateData
    const decoratedData = this.decoratedData
    const getKeyPath = this.getKeyPath
    buildJsonHierarchy(this.props.audits)
    return (
        <div className='basic-sunburst-wrapper'>
            <div>
            {clicked ? 'click to unlock selection' : 'click to lock selection'}
          </div>
          <Sunburst
            animation
            className='basic-sunburst-example'
            hideRootNode
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
            colorType="literal" // a style for react-vis. literal means 'literally the color palette given'
            getSize={d => d.value} // d refers to data, will need to be set differently for audit log
            getColor={d => d.hex}  // same
            data={data} // Make sure you're actually providing data to the chart!
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

function mapStateToProps (state) {
  return {
    flareData: state.D3FlareStore.data,
    audits: state.auditsStore.audits
  }
}

export default connect(mapStateToProps)(BasicSunburst)
