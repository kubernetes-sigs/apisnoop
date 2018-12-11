import React from 'react'
import { Sunburst } from 'react-vis'
import { connect } from 'redux-bundler-react'
import {
  filter,
  get,
  isUndefined,
  pickBy } from 'lodash'

const SunburstChart = (props) => {
  const {
    sunburst,
    doUpdateQuery
  } = props

  console.log('sunburst!!!')
  return (
      <Sunburst
    hideRootNode
    colorType="literal"
    data={sunburst}
    height={500}
    width={500}
    getColor={node => node.color}
    onValueMouseOver={handleMouseOver}
      >
      </Sunburst>
  )
  function handleMouseOver (node, event) {
    var path = getKeyPath(node)
    var rawQuery = {
      level: path[1],
      category: path[2],
      name: path[3]
    }
    var query = propertiesWithValue(rawQuery)
    doUpdateQuery(query)
  }
}

function propertiesWithValue (obj) {
  return pickBy(obj, (val) => !isUndefined(val))
}
function getKeyPath (node) {
  if (!node.parent) {
    return ['root'];
  }
  var nodeKey = get(node, 'data.name') || get(node, 'name')
  var parentKeyPath = getKeyPath(node.parent)
  return [...parentKeyPath, nodeKey]
}
export default connect(
  'selectLabelStyle',
  'selectSunburst',
  'doUpdateQuery',
  SunburstChart
)
