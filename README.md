# apisnoop
Snooping on the Kubernetes OpenAPI communications

## Overview

We are aiming to create a tool to measure OpenAPI usage and test coverage in a generic way.

Kubernetes API coverage is currently generated from parsing e2e test logs. The Conformance WG is focused on getting the e2e tests from ~11% to much higher API test coverage. However we have no API usage data from applications or addons to prioritize what tests to write next.

If we intercept addon API usage we could prioritize test writing and additionally determine if applications are alpha/beta/stable conformant for a specific Kubernetes release.

We propose a man-in-the-middle (MITM) proxy that intercepts the API requests of the Kubernetes e2e test and addons, comparing them against the API server’s OpenAPI documentation. The results would be made available to via HTTP per deployment or pod.

Initial proof of concept here: https://github.com/ii/kube-apisnoop

## Definitions
Coverage is defined as the percentage of the overall API surface area utilized by the e2e test or addon, including alpha/beta/stable for a specified Kubernetes release.

## Approach
The coverage tester is implemented as an HTTPS Reverse Proxy allowing inspection all of the HTTPS traffic between the clients (e2e or addon) and the API server. The API requests are compared with the Swagger/OpenAPI specification and used to calculate API coverage.

There is existing work in intercepting HTTPS traffic, and we suggest basing the work on https://github.com/danisla/kubernetes-tproxy

This would allow us to route API server traffic to a sidecar proxy via an initializer and create a CSR signed by k8s matching the CN of the endpoint.

It should be somewhat trivial to add support for a centralized proxy OR aggregate the existing per pod proxy sidecar. Whatever solution, we want to allow adding a per pod header for aggregation purposes.

The primary logging logic will be written as an MITM addon inspecting HTTP response objects log for method, path, response code, and request/response bodies.

Note that headers will not be recorded as they are not needed and often contain tokens and other sensitive information.

### Action performed by test agent:

* Deploy man in the middle coverage proxy via helm chart.
* Add annotation for API Coverage testing when deploying addon via helm
* Results available via HTTP to coverage proxy service via pod / chart name.

### Actions performed by coverage proxy:

* Load the Swagger Spec for the target API endpoint
* Watch for pods created with API Coverage annotation
* Redirect pod API traffic using iptables rules and/or set http[s]_proxy var
* Compare request and response sets from pods against swagger spec
* Note which methods / endpoints / fields have been “hit” correctly (or incorrectly)
* Note when unknown api calls/fields are used
* Continually update the coverage result and make it available via HTTP
