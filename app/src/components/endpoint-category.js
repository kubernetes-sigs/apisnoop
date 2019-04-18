import React from 'react'

const EndpointSummary = (props) => {
  const {
    endpoint
  } = props

  return (
      <div class="pa3 pa5-ns" data-name="slab-stat" id='endpoint-categories'>
      <h3>{endpoint.operationId}</h3>
      <dl class="dib mr5">
      <dd class="f3 f2-ns b ml0">{endpoint.level}</dd>
      <dd class="f6 f5-ns b ml0">Level</dd>
      </dl>
      <dl class="dib mr5">
      <dd class="f6 f5-ns b ml0">Open Issues</dd>
      <dd class="f3 f2-ns b ml0">993</dd>
      </dl>
      <dl class="dib mr5">
      <dd class="f6 f5-ns b ml0">Next Release</dd>
      <dd class="f3 f2-ns b ml0">10-22</dd>
      </dl>
      <dl class="dib mr5">
      <dd class="f6 f5-ns b ml0">Days Left</dd>
      <dd class="f3 f2-ns b ml0">4</dd>
      </dl>
      <dl class="dib mr5">
      <dd class="f6 f5-ns b ml0">Favorite Cat</dd>
      <dd class="f3 f2-ns b ml0">All of Them</dd>
      </dl>
      <dl class="dib">
      <dd class="f6 f5-ns b ml0">App Downloads</dd>
      <dd class="f3 f2-ns b ml0">1,200</dd>
      </dl>
    </div>
  )
}

export default EndpointSummary
