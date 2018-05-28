#!/bin/bash
kubectl get pods --all-namespaces -o jsonpath='POD NODE:{range.items[*]}{.metadata.name} {.spec.nodeName}:{end}' | tr ':' '\n' | column -t
