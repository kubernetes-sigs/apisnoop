import { Selector } from 'redux-testkit'
import {composeBundlesRaw} from 'redux-bundler'
import endpoints from './endpoints.js'
import endpointsSample from '../test_resources/endpoints.json'

const store = composeBundlesRaw(endpoints)
 var smallEndpointsSample = [
       {
         "name": "readCoreV1NamespaceStatus",
         "method": "get",
         "level": "stable",
         "test_tags": [],
         "tests": [],
         "description": "read status of the specified Namespace",
         "path": "/api/v1/namespaces/{name}/status",
         "category": "core",
         "isTested": false,
         "bucket": "9058",
         "job": "apisnoop.json",
         "release": "9058_apisnoop.json",
         "_id": "6OBwAVYGdU2tOKE8"
       },
       {
         "name": "readCoreV1NamespacedPersistentVolumeClaimStatus",
         "method": "get",
         "level": "stable",
         "test_tags": [],
         "tests": [],
         "description": "read status of the specified PersistentVolumeClaim",
         "path": "/api/v1/namespaces/{namespace}/persistentvolumeclaims/{name}/status",
         "category": "core",
         "isTested": false,
         "bucket": "ci-kubernetes-e2e-gce-cos-k8sstable3-default",
         "job": "460",
         "release": "ci-kubernetes-e2e-gce-cos-k8sstable3-default_460",
         "_id": "6P78EQLmPvD27Ls7"
       },
       {
         "name": "listCoreV1NamespacedEvent",
         "method": "watch",
         "level": "stable",
         "test_tags": [],
         "tests": [],
         "description": "list or watch objects of kind Event",
         "path": "/api/v1/namespaces/{namespace}/events",
         "category": "core",
         "isTested": false,
         "bucket": "34681",
         "job": "apisnoop.json",
         "release": "34681_apisnoop.json",
         "_id": "6PGRw4iDxJrA4QaS"
       },
       {
         "name": "listSettingsV1alpha1NamespacedPodPreset",
         "method": "get",
         "level": "alpha",
         "test_tags": [],
         "tests": [],
         "description": "list or watch objects of kind PodPreset",
         "path": "/apis/settings.k8s.io/v1alpha1/namespaces/{namespace}/podpresets",
         "category": "settings",
         "isTested": true,
         "bucket": "1814",
         "job": "apisnoop.json",
         "release": "1814_apisnoop.json",
         "_id": "6PxTDVRO9ZhOsmXz"
       }
     ]
 
 var smallEndpointsObjectSample = {
     "6OBwAVYGdU2tOKE8": {
       "name": "readCoreV1NamespaceStatus",
       "method": "get",
       "level": "stable",
       "test_tags": [],
       "tests": [],
       "description": "read status of the specified Namespace",
       "path": "/api/v1/namespaces/{name}/status",
       "category": "core",
       "isTested": false,
       "bucket": "9058",
       "job": "apisnoop.json",
       "release": "9058_apisnoop.json",
       "_id": "6OBwAVYGdU2tOKE8"
     },
     "6P78EQLmPvD27Ls7": {
       "name": "readCoreV1NamespacedPersistentVolumeClaimStatus",
       "method": "get",
       "level": "stable",
       "test_tags": [],
       "tests": [],
       "description": "read status of the specified PersistentVolumeClaim",
       "path": "/api/v1/namespaces/{namespace}/persistentvolumeclaims/{name}/status",
       "category": "core",
       "isTested": false,
       "bucket": "ci-kubernetes-e2e-gce-cos-k8sstable3-default",
       "job": "460",
       "release": "ci-kubernetes-e2e-gce-cos-k8sstable3-default_460",
       "_id": "6P78EQLmPvD27Ls7"
     },
     "6PGRw4iDxJrA4QaS": {
       "name": "listCoreV1NamespacedEvent",
       "method": "watch",
       "level": "stable",
       "test_tags": [],
       "tests": [],
       "description": "list or watch objects of kind Event",
       "path": "/api/v1/namespaces/{namespace}/events",
       "category": "core",
       "isTested": false,
       "bucket": "34681",
       "job": "apisnoop.json",
       "release": "34681_apisnoop.json",
       "_id": "6PGRw4iDxJrA4QaS"
     },
     "6PxTDVRO9ZhOsmXz": {
       "name": "listSettingsV1alpha1NamespacedPodPreset",
       "method": "get",
       "level": "alpha",
       "test_tags": [],
       "tests": [],
       "description": "list or watch objects of kind PodPreset",
       "path": "/apis/settings.k8s.io/v1alpha1/namespaces/{namespace}/podpresets",
       "category": "settings",
       "isTested": true,
       "bucket": "1814",
       "job": "apisnoop.json",
       "release": "1814_apisnoop.json",
       "_id": "6PxTDVRO9ZhOsmXz"
   }
 }



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
  })
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
  
  var zoomDepthCategory = {
    depth: "category",
    level: "stable",
    category: "core"
  }
  
  var zoomDepthEndpoint = {
    depth: "endpoint",
    level: "stable",
    category: "core",
    name: "listCoreV1NamespacedEvent"
  }
  
  var zoomExpectedEndpoint =  {
    "name": "listCoreV1NamespacedEvent",
    "method": "watch",
    "level": "stable",
    "test_tags": [],
    "tests": [],
    "description": "list or watch objects of kind Event",
    "path": "/api/v1/namespaces/{namespace}/events",
    "category": "core",
    "isTested": false,
    "bucket": "34681",
    "job": "apisnoop.json",
    "release": "34681_apisnoop.json",
    "_id": "6PGRw4iDxJrA4QaS"
  }
  
  it('zoomedEndpoint returns nothing if there are no endpoints', () => {
  var filterResult = endpoints.selectZoomedEndpoint.resultFunc
    expect(filterResult(null, zoomDepthEndpoint )).toEqual(null)
  })
  it('zoomedEndpoint returns nothing if Zoom depth is not endpoint', () => {
  var filterResult = endpoints.selectZoomedEndpoint.resultFunc
    expect(filterResult(endpointsSample, zoomDepthCategory)).toEqual(undefined)
  })
  it('zoomedEndpoint, with depth of endpoint, returns correct endpoint', () => {
  var filterResult = endpoints.selectZoomedEndpoint.resultFunc
    expect(filterResult(endpointsSample, zoomDepthEndpoint)).toEqual(zoomExpectedEndpoint)
  })
  
  // setup selectEndpointsById Tests
  var endpointsByIdSelector = endpoints.selectEndpointsById.resultFunc
  it('endpointsById returns null if there are no endpoints', () => {
    expect(endpointsByIdSelector()).toEqual(null)
  })
  
  it('endpointsById  returns EndpointObject with correct set of endpoints', () => {
    expect(endpointsByIdSelector(smallEndpointsSample)).toEqual(smallEndpointsObjectSample)
  })
  
  
})
