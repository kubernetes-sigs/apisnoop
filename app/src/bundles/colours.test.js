import { Reducer, Selector } from 'redux-testkit'
import {composeBundlesRaw} from 'redux-bundler'
import colours from './colours.js'

const store = composeBundlesRaw(colours)
const state = store().getState()

const initialState = {
  colours: {
    'alpha': 'rgba(230, 25, 75, 1)',
    'beta': 'rgba(0, 130, 200, 1)',
    'stable': 'rgba(60, 180, 75, 1)',
    'unused': 'rgba(255, 255, 255, 1)'
  },
  moreColours: [
    'rgba(183, 28, 28, 1)',
    'rgba(136, 14, 79, 1)',
    'rgba(74, 20, 140, 1)',
    'rgba(49, 27, 146, 1)',
    'rgba(26, 35, 126, 1)',
    'rgba(13, 71, 161, 1)',
    'rgba(1, 87, 155, 1)',
    'rgba(0, 96, 100, 1)',
    'rgba(0, 77, 64, 1)',
    'rgba(27, 94, 32, 1)',
    'rgba(51, 105, 30, 1)',
    'rgba(130, 119, 23, 1)',
    'rgba(245, 127, 23, 1)',
    'rgba(255, 111, 0, 1)',
    'rgba(230, 81, 0, 1)',
    'rgba(191, 54, 12, 1)',
    'rgba(244, 67, 54, 1)',
    'rgba(233, 30, 99, 1)',
    'rgba(156, 39, 176, 1)',
    'rgba(103, 58, 183, 1)',
    'rgba(63, 81, 181, 1)',
    'rgba(33, 150, 243, 1)',
    'rgba(3, 169, 244, 1)',
    'rgba(0, 188, 212, 1)',
    'rgba(0, 150, 136, 1)',
    'rgba(76, 175, 80, 1)',
    'rgba(139, 195, 74, 1)',
    'rgba(205, 220, 57, 1)',
    'rgba(255, 235, 59, 1)',
    'rgba(255, 193, 7, 1)',
    'rgba(255, 152, 0, 1)',
    'rgba(255, 87, 34, 1)'

  ],
  categories: [
    "admissionregistration",
    "apiextensions",
    "apiregistration",
    "apis",
    "apps",
    "authentication",
    "authorization",
    "autoscaling",
    "batch",
    "certificates",
    "core",
    "events",
    "extensions",
    "logs",
    "networking",
    "policy",
    "rbacAuthorization",
    "scheduling",
    "settings",
    "storage",
    "version",
    "auditregistration",
    "coordination"
  ]
}

describe('Colours Reducer', () => {
  it('should have initial state', () => {
    expect(colours.getReducer()()).toEqual(initialState)
  })
  it('should not have unknown actions affect state', ()=> {
    Reducer(colours.getReducer())
    .expect({type: 'NOT_EXISTING'})
    .toReturnState(initialState)
  })
})

describe('Colours Selectors', () => {
  it('should list all the level colours', () => {
    var result = {
      alpha: 'rgba(230, 25, 75, 1)',
      beta: 'rgba(0, 130, 200, 1)',
      stable: 'rgba(60, 180, 75, 1)',
      unused: 'rgba(255, 255, 255, 1)'
    }
    Selector(colours.selectLevelColours).expect(state).toReturn(result)
  })
  it('should show categories mapped to colours', () => {
    var result = {
      'category.admissionregistration': 'rgba(183, 28, 28, 1)',
      'category.apiextensions': 'rgba(49, 27, 146, 1)',
      'category.apiregistration': 'rgba(1, 87, 155, 1)',
      'category.apis': 'rgba(27, 94, 32, 1)',
      'category.apps': 'rgba(245, 127, 23, 1)',
      'category.authentication': 'rgba(191, 54, 12, 1)',
      'category.authorization': 'rgba(156, 39, 176, 1)',
      'category.autoscaling': 'rgba(33, 150, 243, 1)',
      'category.batch': 'rgba(0, 150, 136, 1)',
      'category.certificates': 'rgba(205, 220, 57, 1)',
      'category.core': 'rgba(255, 152, 0, 1)',
      'category.events': 'rgba(136, 14, 79, 1)',
      'category.extensions': 'rgba(26, 35, 126, 1)',
      'category.logs': 'rgba(0, 96, 100, 1)',
      'category.networking': 'rgba(51, 105, 30, 1)',
      'category.policy': 'rgba(255, 111, 0, 1)',
      'category.rbacAuthorization': 'rgba(244, 67, 54, 1)',
      'category.scheduling': 'rgba(103, 58, 183, 1)',
      'category.settings': 'rgba(3, 169, 244, 1)',
      'category.storage': 'rgba(76, 175, 80, 1)',
      'category.version': 'rgba(255, 235, 59, 1)',
      'category.auditregistration': 'rgba(255, 87, 34, 1)',
      'category.coordination': 'rgba(74, 20, 140, 1)'
    }
    Selector(colours.selectCategoryColours).expect(state).toReturn(result)
  })
})
