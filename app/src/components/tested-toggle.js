import React from 'react'
import { connect } from 'redux-bundler-react'

const TestedToggle = (props) => {
  const {
    queryObject,
    doUpdateQuery
  } = props

  let untestedIsChecked = !queryObject.showUntested || queryObject.showUntested === 'true'
  let testedIsChecked = !queryObject.showTested || queryObject.showTested === 'true'
  let conformanceTestedIsChecked = !queryObject.showConformanceTested || queryObject.showConformanceTested === 'true'

  return (
    <fieldset className='flex flex-row flex-wrap'>
      <legend>Visible Endpoints</legend>
      <div className=''>
      <input type='checkbox' name='showUntested' id='untested' onInput={handleChange} checked={untestedIsChecked} readOnly/>
        <label htmlFor='untested' className='mr2'>untested</label>
      <input type='checkbox' name='showTested' id='tested' onInput={handleChange} checked={testedIsChecked} readOnly/>
        <label htmlFor='untested' className='mr2'>tested</label>
      <input type='checkbox' name='showConformanceTested' id='conformanceTested' onInput={handleChange} checked={conformanceTestedIsChecked} readOnly/>
        <label htmlFor='untested' className='mr2'>conformance-tested</label>
      </div>
    </fieldset>
  )

  function handleChange (e) {
    e.preventDefault()
    let name = e.target.name
    e.target.checked = !e.target.checked
    let isChecked = e.target.checked
    let query = {
      ...queryObject,
      showUntested: untestedIsChecked,
      showTested: testedIsChecked,
      showConformanceTested: conformanceTestedIsChecked
    }
    query[name] = isChecked
    doUpdateQuery({ ...query })
  }
}

export default connect(
  'doUpdateQuery',
  'selectQueryObject',
  TestedToggle
)
