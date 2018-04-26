#!/bin/sh

IFS=''

FILENAME="/etc/kubernetes/manifests/kube-apiserver.yaml"

TMPFILE="/tmp/kube-apiserver.yaml.patched"
rm -f "$TMPFILE"

while read LINE
do
    echo "$LINE" >> "$TMPFILE"
    case "$LINE" in
        *"- kube-apiserver"*)
            echo "    - --audit-log-path=/tmp/files/audit.log" >> "$TMPFILE"
            echo "    - --audit-policy-file=/tmp/files/audit-policy.yaml" >> "$TMPFILE"
            echo "    - --audit-webhook-config-file=/tmp/files/webhook-config.yaml" >> "$TMPFILE"
            ;;
        *"volumeMounts:"*)
            echo "    - mountPath: /tmp/files/" >> "$TMPFILE"
            echo "      name: data" >> "$TMPFILE"
            ;;
        *"volumes:"*)
            echo "  - hostPath:" >> "$TMPFILE"
            echo "      path: /tmp/files" >> "$TMPFILE"
            echo "    name: data" >> "$TMPFILE"
            ;;

    esac
done < "$FILENAME"

cp "$FILENAME" "/tmp/kube-apiserver.yaml.original"
cp "$TMPFILE" "$FILENAME"
