import React from 'react'
import { Sunburst } from 'react-vis'
import { connect } from 'redux-bundler-react'
import { get } from 'lodash'

const SunburstChart = (props) => {
  const {
   sunburst,
   doUpdateQuery
  } = props

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
  doUpdateQuery({level: path[1]})
}
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
