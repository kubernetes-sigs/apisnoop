import React from 'react'
     import { Sunburst } from 'react-vis'
     import { get } from 'lodash'

     export default function SunburstChart (props) {
       const {sunburst, focusChart} = props
if (sunburst == null) return null
       return(
           <Sunburst
             hideRootNode
             colorType="literal"
             data={sunburst.data}
             height={500}
             width={500}
             onValueMouseOver={handleMouseOver}
             onValueClick={handleClick}
           />
       )

       function handleMouseOver (node, event) {
         focusChart(getKeyPath(node))
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
