import React from 'react'
import { Sunburst, LabelSeries } from 'react-vis'
import { connect } from 'redux-bundler-react'
import {
  get,
  join,
  omit,
  sortBy } from 'lodash'

import { propertiesWithValue } from '../lib/utils'

const SunburstChart = (props) => {
  const {
    activeStats,
    doUpdateQuery,
    labelStyles,
    queryObject,
    sunburst,
  } = props

  if (sunburst == null) return null
  return (
      <div id='sunburst'>
      <Sunburst
    colorType="literal"
    data={sunburst}
    height={600}
    width={600}
    getColor={node => node.color}
    onValueMouseOver={handleMouseOver}
    onValueMouseOut={handleMouseOut}
    onValueClick={handleMouseClick}
      >
     {activeStats && <LabelSeries
       data={[{x: 0, y: 60, label: activeStats.labelX, labelAnchorY: 'center', style:labelStyles.X},
              {x: 0, y: 0, label: activeStats.labelY, style: labelStyles.Y},
              {x: 0, y: -20, label: activeStats.labelZ, style: labelStyles.Z}
             ]}
     />}
      </Sunburst>
      </div>
  )

  function handleMouseOver (node, event) {
    var path = getKeyPath(node)
    var query= propertiesWithValue({
      level: path[1],
      category: path[2],
      operationId: path[3]
    })
    doUpdateQuery({
      ...queryObject,
      ...query
    })
  }

  function handleMouseOut (e) {
    var query = omit(queryObject, ['level','category','operationId'])
    doUpdateQuery(query)
  }

  function handleMouseClick (node, event) {
    var depth = ['root', 'level', 'category', 'operationId']
    var path = getKeyPath(node)
    var query = propertiesWithValue({
      level: path[1],
      category: path[2],
      operationId: path[3],
    })
    var queryAsArray = sortBy(query, ['level','category','operationId'])
    query.zoomed = `${depth[node.depth]}-${join(queryAsArray,'-')}`
    doUpdateQuery({
      ...queryObject,
      ...query
    })
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
  'selectActiveStats',
  'doUpdateQuery',
  'selectLabelStyles',
  'selectQueryObject',
  'selectSunburst',
  SunburstChart
)
