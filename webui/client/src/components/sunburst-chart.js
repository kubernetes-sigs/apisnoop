import React from 'react'
import { Sunburst, LabelSeries } from 'react-vis'
import { get, includes } from 'lodash'


const LABEL_STYLE = {
  PERCENTAGE: {
    fontSize: '1.3em',
    textAnchor: 'middle'
  },
  FRACTION: {
    fontSize: '1.2em,',
    textAnchor: 'middle'
  },
  PATH: {
    fontSize: '1em',
    textAnchor: 'middle'
  }
}

export default function SunburstChart (props) {

  const {
    focusChart,
    focusPath,
    sunburst,
    unfocusChart
  } = props

  if (sunburst == null) return null
  return(
      <div className="sunburst-wrapper">
      <Sunburst
        hideRootNode
        colorType="literal"
        data={sunburst.data}
        getColor={node => determineColor(node)}
        height={500}
        width={500}
        onValueMouseOver={handleMouseOver}
        onValueMouseOut={handleMouseOut}
        onValueClick={handleClick}

      >

      <LabelSeries
         data={[
           {x: 0, y: 20, label: 'good times', style: LABEL_STYLE.PERCENTAGE},
           {x: 0, y: 0, label: 'fun times', style: LABEL_STYLE.FRACTION},
           {x: 0, y: -20, label: 'sweet times', style: LABEL_STYLE.PATH}
         ]}
       />
      </Sunburst>
      </div>
  )

  function determineColor (node) {
    if (focusPath.length > 0) {
      if (node.parent && includes(focusPath, node.name) && includes(focusPath, node.parent.data.name)) {
        return node.color
      } else {
        return node.color + '19'
      }
    }
    return node.color
  }

  function handleMouseOver (node, event) {
    focusChart(getKeyPath(node))
  }

  function handleMouseOut () {
    unfocusChart()
  }

  function handleClick (node, event) {

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
