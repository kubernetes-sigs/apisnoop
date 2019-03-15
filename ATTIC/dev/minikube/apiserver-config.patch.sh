#!/bin/sh

while read LINE; do
    echo "$LINE" >> $OUTFILE
    case "$LINE" in
        *"- kube-apiserver"*)
            echo "    - --audit-log-path=/tmp/files/audit.log" >> $OUTFILE
            echo "    - --audit-policy-file=/tmp/files/audit-policy.yaml" >> $OUTFILE
        *"volumeMounts:"*)
            echo "    - mountPath: /tmp/files/" >> $OUTFILE
            echo "      name: data" >> $OUTFILE
        *"volumes:"*)
            echo "  - hostPath:"
            echo "      path: /tmp/files"
            echo "    name: data"
    esac
done < kube-apiserver.yaml
