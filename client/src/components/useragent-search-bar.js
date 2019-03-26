import React from 'react'
import {connect} from 'redux-bundler-react'

function UseragentSearchBar (props) {
  const {
    doUpdateUseragentsInput,
    doUpdateQuery,
    useragentsInput
   } = props

  return (
      <form onSubmit={handleSubmit}>
      <input name='ua-filter' type='text' value={useragentsInput} onChange={handleInput}/>
      <input type='submit' value='submit' />
      </form>
      )

  function handleInput (e) {
    doUpdateUseragentsInput(e.target.value)
  }
  function handleSubmit (e) {
    e.preventDefault()
    doUpdateQuery({
      useragents: e.target[0].value
    })
    doUpdateUseragentsInput('')
  }
}

export default connect(
  'doUpdateUseragentsInput',
  'doUpdateQuery',
  'selectUseragentsInput',
  UseragentSearchBar
)
