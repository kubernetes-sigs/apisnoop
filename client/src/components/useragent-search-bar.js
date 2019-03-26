import React from 'react'
import {connect} from 'redux-bundler-react'

function UseragentSearchBar (props) {
  const {
    doUpdateUseragentsInput,
    doUpdateQuery
   } = props

  return (
      <form onInput={handleInput} onSubmit={handleSubmit}>
      <input name='ua-filter' type='text' />
      <input type='submit' value='submit' />
      </form>
      )

  function handleInput (e) {
    doUpdateUseragentsInput(e.target.value)
  }
  function handleSubmit (e) {
    e.preventDefault()
    console.log(e.target)
    doUpdateQuery({
      useragent: e.target.value
    })
  }
}

export default connect(
  'doUpdateUseragentsInput',
  'doUpdateQuery',
  UseragentSearchBar
)
