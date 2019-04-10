import React from 'react'
import { Sunburst } from 'react-vis'
import { connect } from 'redux-bundler-react'
import {
  get,
  join,
  omit,
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
    onValueClick={handleMouseClick}
      >
      </Sunburst>
      <button className='ttsc' onClick={handleReset}>Reset</button>
      </div>
  )

  function handleMouseOver (node, event) {
    var path = getKeyPath(node)
    var query= propertiesWithValue({
      level: path[1],
      category: path[2],
      operatorId: path[3]
    })
    doUpdateQuery({
      ...queryObject,
      ...query
    })
  }

  function handleMouseOut () {
    var query = omit(queryObject, ['level','category','operatorId'])
    doUpdateQuery(query)
  }

  function handleMouseClick (node, event) {
    var depth = ['root', 'level', 'category', 'endpoint']
    var path = getKeyPath(node)
    var query = propertiesWithValue({
      level: path[1],
      category: path[2],
      operatorId: path[3],
    })
    var queryAsArray = sortBy(query, ['level','category','operatorId'])
    query.zoomed = `${depth[node.depth]}-${join(queryAsArray,'-')}`
    doUpdateQuery({
      ...queryObject,
      ...query
    })
  }

  function handleReset () {
    var resetQuery = omit(queryObject,['level', 'category', 'operatorId', 'zoomed'])
    doUpdateQuery(resetQuery)
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
