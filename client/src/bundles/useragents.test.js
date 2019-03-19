import { Reducer, Selector } from 'redux-testkit'
import {composeBundlesRaw} from 'redux-bundler'
import createStore from './index.js'
import useragents from './useragents.js'
import useragentsResource from './useragents-resource.js'
import useragentsSample from '../test_resources/useragents.json'
    var useragentsNamesSample  = [
       "kubectl/v1.13.3",
       "kube-apiserver/v1.15.0",
       "kube-proxy/v1.13.5",
       "node-problem-detector/v0.5.0-49-gfb81368",
       "nfs-provisioner/v0.0.0"
     ]

var store = createStore()
var state = store.getState()

const initialState = {
    filterInput: ''
}

describe('Useragents Reducer', () => {
  it('should have initial state', () => {
  expect(state.useragents).toEqual(initialState)
  })
  it('should handle USERAGENT_INPUT_UPDATED', () => {
      const payload = 'k^sjdj'
      const action = {type: 'USERAGENT_INPUT_UPDATED', payload}
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
  
  it('should return all useragent names if no filter is set', () => {
      var useragentsNamesSample  = [
         "kubectl/v1.13.3",
         "kube-apiserver/v1.15.0",
         "kube-proxy/v1.13.5",
         "node-problem-detector/v0.5.0-49-gfb81368",
         "nfs-provisioner/v0.0.0"
       ]
      var filter = ''
      var filterB = 'kube'
      var filteredSample = ["kubectl/v1.13.3", "kube-apiserver/v1.15.0", "kube-proxy/v1.13.5"]
  
      var selectUseragents = useragents.selectUseragentsFilteredByInput.resultFunc
  
       expect(selectUseragents(useragentsSample, filter)).toEqual(useragentsNamesSample)
       expect(selectUseragents(useragentsSample, filterB)).toEqual(filteredSample)
  
  })
  
})
