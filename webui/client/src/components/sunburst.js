import React from 'react'
import { Sunburst, LabelSeries } from 'react-vis'
import { connect } from 'redux-bundler-react'
import {
  get,
  join,
  sortBy } from 'lodash'

import { propertiesWithValue } from '../lib/utils'

const SunburstChart = (props) => {
  const {
    interiorLabel,
    labelStyle,
    sunburstSorted,
    queryObject,
    doUpdateQuery
  } = props


  return (
      <div id='sunburst'>
      <Sunburst
    hideRootNode
    colorType="literal"
    data={sunburstSorted}
    height={600}
    width={600}
    getColor={node => node.color}
    onValueClick={handleMouseClick}
    onValueMouseOver={handleMouseOver}
    onValueMouseOut={handleMouseOut}
      >
      {(interiorLabel && interiorLabel.coverage) &&
       <LabelSeries
       data={[{x: 0, y: 60, label: interiorLabel.coverage.percentage, style: labelStyle.PERCENTAGE},
              {x: 0, y: 0, label: interiorLabel.coverage.ratio, style: labelStyle.FRACTION},
              {x: 0, y: -20, label: 'total tested', style: labelStyle.PATH}
             ]} />}
    {(interiorLabel && interiorLabel.endpoint) &&
     <LabelSeries
     data={[
       {x: 0, y: 0, label: interiorLabel.tested, style: labelStyle.PERCENTAGE},
     ]} />}
      <button className='ttsc' onClick={()=> doUpdateQuery({})}>Reset</button>
      </Sunburst>
      </div>
  )
  function handleMouseOver (node, event) {
    var path = getKeyPath(node)
    var rawQuery = {
      level: path[1],
      category: path[2],
      name: path[3],
    }
    var query = propertiesWithValue(rawQuery)
    if (queryObject.zoomed) {
      query.zoomed = queryObject.zoomed
    }
    if (queryObject.filter) {
      query.filter = queryObject.filter
    }
    doUpdateQuery(query)
  }

  function handleMouseOut () {
    var query = {}
    if (queryObject.filter) {
      query.filter = queryObject.filter
    }
    if (queryObject.zoomed) {
      query.zoomed = queryObject.zoomed
    }
    doUpdateQuery(query)
  }

  function handleMouseClick (node, event) {
    var depth = ['root', 'level', 'category', 'endpoint']
    var path = getKeyPath(node)
    var rawQuery = {
      level: path[1],
      category: path[2],
      name: path[3],
      filter: queryObject.filter
    }
    var query = propertiesWithValue(rawQuery)
    var queryAsArray = sortBy(query, ['level','category','name'])
    query.zoomed = `${depth[node.depth]}-${join(queryAsArray,'-')}`
    if (queryObject.filter) {
      query.filter = queryObject.filter
    }
    doUpdateQuery(query)
  }

  function getKeyPath (node) {
    if (!node.parent) {
      return ['root'];
    }
    var nodeKey = get(node, 'data.name') || get(node, 'name')
    var parentKeyPath = getKeyPath(node.parent)
    return [...parentKeyPath, nodeKey]
  }
}

export default connect(
  'selectInteriorLabel',
  'selectLabelStyle',
  'selectQueryObject',
  'selectSunburstSorted',
  'doUpdateQuery',
  SunburstChart
)
