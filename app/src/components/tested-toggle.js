import React, { useState } from 'react'
import { connect } from 'redux-bundler-react'
import { toString } from 'lodash'

const TestedToggle = (props) => {
  const {
    queryObject,
    doUpdateQuery
  } = props

  let untestedIsChecked = !queryObject.showUntested || queryObject.showUntested === 'true'
  let testedIsChecked = !queryObject.showTested || queryObject.showTested === 'true'
  let conformanceTestedIsChecked = !queryObject.showConformanceTested || queryObject.showConformanceTested === 'true'

  return (
    <fieldset>
      <legend>Visible Endpoints</legend>
      <div>
      <input type='checkbox' name='showUntested' id='untested' onInput={handleChange} checked={untestedIsChecked}/>
        <label for='untested'>untested</label>
      <input type='checkbox' name='showTested' id='tested' onInput={handleChange} checked={testedIsChecked} />
        <label for='untested'>tested</label>
      <input type='checkbox' name='showConformanceTested' id='conformanceTested' onInput={handleChange} checked={conformanceTestedIsChecked} />
        <label for='untested'>conformance-tested</label>
      </div>
    </fieldset>
  )

  function handleChange (e) {
    e.preventDefault()
    let name = e.target.name
    e.target.checked = !e.target.checked
    let isChecked = e.target.checked
    let query = queryObject
    query.showUntested = untestedIsChecked
    query.showTested = testedIsChecked
    query.showConformanceTested = conformanceTestedIsChecked
    query[name] = isChecked
    doUpdateQuery({ ...query })
  }

  function isTrue (string) {
    return string === 'true'
  }
}

export default connect(
  'doUpdateQuery',
  'selectQueryObject',
  TestedToggle
)
