import React from 'react'
import { connect } from 'redux-bundler-react'
import { startCase } from 'lodash'

const UsefulFilters = (props) => {
  const {
    queryObject,
    doUpdateQuery
  } = props

  // Different Filters
  let conformantApis = {
    showConformanceTested: "true",
    showTested: "false",
    showUntested: "false",
    zoomed: "level-stable"
  }
  let stableCoreTestedButNotConformant= {
    showConformanceTested: "false",
    showTested: "true",
    showUntested: "false",
    zoomed: "category-stable-core"
  }

  let stableHitButNotTested = {
    useragents: '[^e2e.test]',
    showUntested: "true",
    showTested: "false",
    showConformanceTested: "false",
    zoomed: "level-stable"
  }

  let coreUntestedKubeComponents = {
    useragents: "kube-.*",
    showUntested: "true",
    showTested: "false",
    showConformanceTested: "false"
  }

  const Filter = ({filter, name}) => {
    return (
        <li className="mb1">
        <button
      onClick={()=>doUpdateQuery({...queryObject, ...filter})}
      className='bg-transparent b--none magic-pointer f5 blue tl'
        >
        {startCase(name)}
      </button>
   </li>
    )
  }

  return(
    <section id="useful-filters" className='relative pt0 pb2'>
      <h2 className="f5 mb0 mt1 pa1 pb0 pt0">Useful Filters</h2>
      <ul className="list pl0">
      <Filter filter={conformantApis} name='all conformant apis' />
      <Filter filter={stableCoreTestedButNotConformant} name='stable-core tested, but not conformant' />
      <Filter filter={stableHitButNotTested} name='stable endpoints hit, but not tested' />
      <Filter filter={coreUntestedKubeComponents} name='core untested kube components' />
      </ul>
    </section>
  )
}

export default connect(
  'selectQueryObject',
  'doUpdateQuery',
  UsefulFilters
)
