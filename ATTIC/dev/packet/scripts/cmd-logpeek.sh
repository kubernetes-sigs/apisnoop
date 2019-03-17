#!/bin/bash

if [ "$#" -lt 1 ]; then
  echo "usage: logpeek <logpath> <filter>"
  exit
fi

LOGPATH=$1
FILTER_NAME=$2

cat "$LOGPATH" | grep "name\":\"$FILTER_NAME" | grep 'requestURI":"[^"]\+' -o | sed 's/requestURI":"//' | sort | uniq
