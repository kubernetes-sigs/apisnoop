import React from 'react'
import { Sunburst } from 'react-vis'
import { connect } from 'redux-bundler-react'
import {
  get,
  join,
  sortBy } from 'lodash'

import { propertiesWithValue } from '../lib/utils'

const SunburstChart = (props) => {
  const {
    sunburst,
    queryObject,
    doUpdateQuery
  } = props

  return (
      <div id='sunburst'>
      <Sunburst
    hideRootNode
    colorType="literal"
    data={sunburst}
    height={600}
    width={600}
    getColor={node => node.color}
    onValueMouseOver={handleMouseOver}
    onValueMouseOut={handleMouseOut}
      >
      </Sunburst>
      <button className='ttsc' onClick={handleReset}>Reset</button>
      </div>
  )
  function handleMouseOver (node, event) {
    var path = getKeyPath(node)
    var rawQuery = {
      level: path[1],
      category: path[2],
      name: path[3]
    }
    var query = propertiesWithValue(rawQuery)
    if (queryObject.zoomed) {
      query.zoomed = queryObject.zoomed
    }
    if (queryObject.filter) {
      query.filter = queryObject.filter
    }
    if (queryObject.useragents) {
      query.useragents = queryObject.useragents
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
    if (queryObject.useragents) {
      query.useragents = queryObject.useragents
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
    if (queryObject.useragents) {
      query.useragents = queryObject.useragents
    }

    doUpdateQuery(query)
  }

  function handleReset () {
    var query = {}
    if (queryObject.filter) {
      query.filter = queryObject.filter
    }
    if (queryObject.useragents) {
      query.useragents =queryObject.useragents
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
  'selectQueryObject',
  'selectSunburst',
  'doUpdateQuery',
  SunburstChart
)
