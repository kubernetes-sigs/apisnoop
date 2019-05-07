import React from 'react'
import { connect } from 'redux-bundler-react'

import Bucketlist from './bucket-list'
import FiltersContainer from './filters-container'



const Sidebar = (props) => {
  const {
  } = props

    return (
      <div id='sidebar' className='min-vh-80 bg-moon-gray'>
      <Bucketlist />
      <FiltersContainer />
      </div>
    )
  }

export default connect(
  Sidebar
)
