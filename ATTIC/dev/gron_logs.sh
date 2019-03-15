#!/bin/bash
# tail -f ./draft-manual.log | gron -s \
#   | grep -v 'verb\|user.username\|requestURI\|objectRef.apiGroup\|objectRef.apiVersion\|apiresource="roles"
tail -F ./draft-manual.log | grep system:serviceaccount: | grep -v system:serviceaccount:kube-system \
  | gron -s
