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
import { connect } from 'react-redux'
import { Sunburst, LabelSeries } from 'react-vis'
import * as _ from 'lodash'

const LABEL_STYLE = {
  fontSize: '20px',
  textAnchor: 'middle'
}
var colors = {
  'alpha': '#e6194b',
  'beta': '#0082c8',
  'stable': '#3cb44b',
  'unused': '#ffffff'
}

var categories = [
  "admissionregistration",
  "apiextensions",
  "apiregistration",
  "apis",
  "apps",
  "authentication",
  "authorization",
  "autoscaling",
  "batch",
  "certificates",
  "core",
  "events",
  "extensions",
  "logs",
  "networking",
  "policy",
  "rbacAuthorization",
  "scheduling",
  "settings",
  "storage",
  "version"
]

var more_colors = [
  "#b71c1c", "#880E4F", "#4A148C", "#311B92", "#1A237E", "#0D47A1",
  "#01579B", "#006064", "#004D40", "#1B5E20", "#33691E", "#827717",
  "#F57F17", "#FF6F00", "#E65100", "#BF360C", "#f44336", "#E91E63",
  "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4",
  "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107",
  "#FF9800", "#FF5722"
]

for (var catidx = 0; catidx < categories.length; catidx++) {
  var category = categories[catidx]
  colors['category.' + category] = more_colors[(catidx * 3) % more_colors.length]
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
      this.getDetails = this.getDetails.bind(this)
      this.updateData = this.updateData.bind(this)
      this.getKeyPath = this.getKeyPath.bind(this)
    }
    
    
    componentDidMount() {
      var sunburst = this.props.sunburst
        this.decoratedData = this.updateData(sunburst, false)
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
    updateData (data, keyPath, parent=false) {
      if (data.children) {
        data.children.map(child => this.updateData(child,  keyPath, data))
      }
      // add a fill to all the uncolored cells
      if (!data.color) {
        var color = colors[data.name]
        if (!color) {
          data.style = { fill: 'lightgray' }
        }
        data.style = { fill: color}
      }
      if (!keyPath) {
        return data
      }
      if (parent && keyPath.length > 1) {
        var lastTwoInPath = [keyPath[keyPath.length - 2], keyPath[keyPath.length - 1]]
        var isActive = (parent, child) => {
          var parentChild = [parent.name, child.name]
          var diff = _.difference(parentChild, lastTwoInPath)
          return diff.length === 0 || parent.length === 1
        }
        data.style = {
          ...data.style,
          fillOpacity: isActive(parent, data) ? 0.2 : 1
        }
      }
      if (keyPath.length === 1) {
        data.style = {
          ...data.style,
          fillOpacity: (keyPath) ? 0.2 : 1
        }
      }
      return data
    }
    getDetails (node) {
      var details = {}
      if (node.children) {
        var deets = _.forEach(node.children, (val, key, child) => this.getDetails(node))
        _.merge(details, deets)
      }
      var halves = node.name.split('/')
      var name = halves[0]
      var method = halves[1]
      _.merge(details, this.props.endpoints[name][method])
      return details
    }
    render() {
      const {clicked, data, finalValue, pathValue} = this.state
      const updateData = this.updateData
      const decoratedData = this.decoratedData
      const getKeyPath = this.getKeyPath
      return (
          <div className='basic-sunburst-wrapper'>
            <div>
            {clicked ? 'click to unlock selection' : 'click to lock selection'}
          </div>
          <Sunburst
          className='basic-sunburst-example'
          hideRootNode
          onValueMouseOver={(node, dom) => {
            if (clicked) {
              return
            }
            const path = getKeyPath(node).reverse()
            path.shift()
            // console.log({path, node})
            const pathAsMap = path.reduce((res, row) => {
              res[row] = true
              return res
            }, {})
            // var details = this.getDetails(node)
            // console.log({details})
            // console.log({pathAsMap})
            //debugger
            this.setState({
              finalValue: `${node.name}`,
              pathValue: path.join(' > '),
              data: updateData(decoratedData, path)
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
          getSize={d => d.size} // d refers to data, will need to be set differently for audit log
          getColor={d => d.color}  // same
          data={data} // Make sure you're actually providing data to the chart!
          height={900}
          width={1000}
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
  }
}

export default connect(mapStateToProps)(BasicSunburst)
