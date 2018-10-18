import React, { Component } from 'react';
import { Sunburst } from 'react-vis'

const myData = {
    "title": "analytics",
    "color": "#12939A",
    "children": [
        {
            "title": "cluster",
            "children": [
                {"title": "AgglomerativeCluster", "color": "#12939A", "size": 3938},
                {"title": "CommunityStructure", "color": "#12939A", "size": 3812},
                {"title": "HierarchicalCluster", "color": "#12939A", "size": 6714},
                {"title": "MergeEdge", "color": "#12939A", "size": 743}
            ]
        },
        {
            "title": "graph",
            "children": [
                {"title": "BetweennessCentrality", "color": "#12939A", "size": 3534},
                {"title": "LinkDistance", "color": "#12939A", "size": 5731},
                {"title": "MaxFlowMinCut", "color": "#12939A", "size": 7840},
                {"title": "ShortestPaths", "color": "#12939A", "size": 5914},
                {"title": "SpanningTree", "color": "#12939A", "size": 3416}
            ]
        },
        {
            "title": "optimization",
            "children": [
                {"title": "AspectRatioBanker", "color": "#12939A", "size": 7074}
            ]
        }
    ]
}

class SunburstSegment extends Component {
    // make sure parent container have a defined height when using responsive component,
    // otherwise height will be 0 and no chart will be rendered.
    // website examples showcase many properties, you'll often use just a few of them.
    render() {
        return (
            <Sunburst
                hideRootNode
                colorType='literal'
                data={myData}
                height={300}
                width={350}/>
        )
    }
}

export default SunburstSegment
