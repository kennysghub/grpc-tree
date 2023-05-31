import React from 'react'
import d3 from 'd3'


function Tree(props) {
  console.log('inside tree component: ', props.treeData)

  const treeMap = d3.tree().size([height,width])
  let nodes = d3.hierarchy(treeData, d => d.children)
  nodes = treeMap(nodes)
  
  return (
    <div>hello</div>
  )
}

export default Tree