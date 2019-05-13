import React from 'react'
import { connect } from 'redux-bundler-react'

import Bucketlist from './bucket-list'
import FiltersContainer from './filters-container'

const Sidebar = (props) => {
  return (
      <div id='sidebar' className='min-vh-80 bg-moon-gray pa1'>
      <div id='logo' className= 'flex flex-wrap items-center pa1 pb2'>
      <img className='h2' src='./assets/apisnoop_logo_v1.png' alt='logo for apisnoop, a magnifying glass with a sunburst graph inside.' />
      <h1 className='ma0 f4 fw4 pl2 avenir black'>APISnoop</h1>
      </div>
      <Bucketlist />
      <FiltersContainer />
      </div>
  )
}

export default connect(
  Sidebar
)
