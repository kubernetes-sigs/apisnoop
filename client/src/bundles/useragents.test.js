import { Reducer, Selector } from 'redux-testkit'
import {composeBundlesRaw} from 'redux-bundler'
import useragents from './useragents.js'

const store = composeBundlesRaw(useragents)
const state = store().getState()

const initialState = {
    filterInput: ''
}

describe('Useragents Reducer', () => {
  it('should have initial state', () => {
  expect(state.useragents).toEqual(initialState)
  })
  it('should handle USERAGENT_FILTER_INPUT_UPDATED', () => {
      const payload = 'k^sjdj'
      const action = {type: 'USERAGENT_FILTER_INPUT_UPDATED', payload}
      const result = {filterInput: payload}
      Reducer(useragents.getReducer()).expect(action).toReturnState(result)
  })
})

describe('Useragents Selectors', () => {
  it('should return a string for selectUseragentInput', () => {
      const stateA = {useragents: {filterInput: ''}}
      const stateB = {useragents: {filterInput: 'r^eg&x'}}
      var selectInput = useragents.selectUseragentsInput
  
      expect(selectInput(stateA)).toEqual(stateA.useragents.filterInput)
      expect(selectInput(stateB)).toEqual(stateB.useragents.filterInput)
  })
  
})
