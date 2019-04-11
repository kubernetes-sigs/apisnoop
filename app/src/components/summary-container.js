import React from 'react'
 import { connect } from 'redux-bundler-react'

// import TestsSummary from './tests-summary'

 const SummaryContainer = (props) => {
   const {
     activeStats,
   } = props

   return(
       <div id='summary-container' className=''>
       <p className='f3 mt0 mb3 ttsc'>{ activeStats.labelX }</p>
       <p className='f4 mt0 mb3 i fw2'>{ activeStats.labelY }</p>
       {/* <TestsSummary /> */}
       </div>
   )
 }
 export default connect(
   'selectActiveStats',
   'selectCategoryColours',
   'selectLevelColours',
   SummaryContainer
 )
