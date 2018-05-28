#!/bin/bash

helm search stable | grep '^stable/' | awk '{print $1}'
