#!/bin/bash
for n in {1..50}; do
    date --rfc-3339=ns
    echo "------------"
    echo "[example] example conformance"
    echo "    does the thing we want"
    echo "    example/foo.go:10"

    for i in {1..1}; do
        echo "$i alligator"
    done
    echo "Sleeping..."
    sleep 3
done
