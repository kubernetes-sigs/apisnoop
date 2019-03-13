import { Selector } from 'redux-testkit'
import {composeBundlesRaw} from 'redux-bundler'
import endpoints from './endpoints.js'
import endpointsSample from '../test_resources/endpoints.json'

const store = composeBundlesRaw(endpoints)

describe('Endpoints Selectors', () => {
  it('regex filters should return proper number of results', () => {
    var expectedLength = {
     APIG: 1,
     CORE: 0,
     Core: 7,
     Rbac: 4,
     Rzach: 0
    }
    var filterResult = endpoints.selectFilteredEndpoints.resultFunc
    expect(filterResult(endpointsSample, /APIG/).length).toEqual(expectedLength.APIG)
    expect(filterResult(endpointsSample, /CORE/).length).toEqual(expectedLength.CORE)
    expect(filterResult(endpointsSample, /Core/).length).toEqual(expectedLength.Core)
    expect(filterResult(endpointsSample, /Rbac/).length).toEqual(expectedLength.Rbac)
    expect(filterResult(endpointsSample, /Rzach/).length).toEqual(expectedLength.Rzach)
  }),
  it('endpoints available should match current zoom depth and location', () => {
    // How many endpoints zoom should return
    var expectedLength = {
      toLevel: 13,
      toCategory: 7,
      toEndpoint: 7,
      none: 21
    }
  
    // Setup our Zooms
    var toLevel = {
      level: "stable",
      depth: "level"
    }
  
    var toCategory = {
      category: "core",
      level: "stable",
      depth: "category"
    }
  
    var toEndpoint = {
      level: "stable",
      category: "core",
      endpoint: "deleteCoreV1Namespace",
      depth: "endpoint"
    }
  
    var filterResult = endpoints.selectFilteredAndZoomedEndpoints.resultFunc
    expect(filterResult(endpointsSample, toLevel).length).toEqual(expectedLength.toLevel)
    expect(filterResult(endpointsSample, toCategory).length).toEqual(expectedLength.toCategory)
    expect(filterResult(endpointsSample, toEndpoint).length).toEqual(expectedLength.toEndpoint)
    expect(filterResult(endpointsSample).length).toEqual(expectedLength.none)
  })
  
//   ,
//   ,
//   ,
//   ,
//   
})
