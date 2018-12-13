import React from 'react'
import { Sunburst, LabelSeries } from 'react-vis'
import { connect } from 'redux-bundler-react'
import {
  get,
  isUndefined,
  pickBy } from 'lodash'

const SunburstChart = (props) => {
  const {
    interiorLabel,
    labelStyle,
    sunburstSorted,
    queryObject,
    doDisplayEndpointTests,
    doUpdateQuery
  } = props

  return (
      <div id='sunburst'>
      <button onClick={()=> doUpdateQuery({})}>Clear</button>
      <Sunburst
    hideRootNode
    colorType="literal"
    data={sunburstSorted}
    height={500}
    width={500}
    getColor={node => node.color}
    onValueClick={handleMouseClick}
    onValueMouseOver={handleMouseOver}
      >
      {(interiorLabel && !interiorLabel.endpoint) &&
       <LabelSeries
       data={[
         {x: 0, y: 60, label: interiorLabel.percentage, style: labelStyle.PERCENTAGE},
         {x: 0, y: 0, label: interiorLabel.ratio, style: labelStyle.FRACTION},
         {x: 0, y: -20, label: 'total tested', style: labelStyle.PATH}
       ]} />}
    {(interiorLabel && interiorLabel.endpoint) &&
     <LabelSeries
     data={[
       {x: 0, y: 0, label: interiorLabel.description, style: labelStyle.DESCRIPTION},
       {x: 0, y: -20, label: interiorLabel.tested, style: labelStyle.PATH}
     ]} />}
    </Sunburst>
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
    doUpdateQuery(query)
  }
  function handleMouseClick (e) {
    if(e.name === queryObject.name) {
      doDisplayEndpointTests(e.name)
    }
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
  'selectInteriorLabel',
  'selectLabelStyle',
  'selectQueryObject',
  'selectSunburstSorted',
  'doDisplayEndpointTests',
  'doUpdateQuery',
  SunburstChart
)
