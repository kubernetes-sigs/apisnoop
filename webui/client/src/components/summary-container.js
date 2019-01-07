import React from 'react'
     import { connect } from 'redux-bundler-react'

     import TestsSummary from './tests-summary'

     const SummaryContainer = (props) => {
       const {
         activeEndpoint,
         activeTestsNumber,
         categoryColours,
         levelColours,
         path,
       } = props

       const level = path.level
       const category = path.category
       const name = path.name
       const description = (activeEndpoint == null) ? '' : activeEndpoint.description
       return(
           <div id='summary-container' className='pa5'>
           <p className='f2 mt3 mb3 fw3'>
           <span style={{color: levelColours[level]}}>{ level } </span>
           <span style={{color: categoryColours['category.' + category]}}>{ category }</span>
           </p>
           <p className='f2 mt0 mb3 ttsc'>{ name }</p>
           <p className='f4 mt0 mb3 i fw2'>{ description }</p>
           <TestsSummary />
           </div>
       )
     }
export default connect(
       'selectActiveEndpoint',
       'selectActiveTestsNumber',
       'selectCategoryColours',
       'selectLevelColours',
       'selectPath',
       SummaryContainer
     )
