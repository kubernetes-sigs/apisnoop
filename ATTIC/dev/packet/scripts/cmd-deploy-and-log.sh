#!/bin/bash

# Enable job control so the logs can be started before the install
set -m

mkdir -p logs

CHART_URL=$1
CHART_NAME=$2
OTHER_ARGS="${@:3}"


if [ "$#" -lt 2 ]; then
    echo "Usage: cmd-helm.sh <chart_url> <chart_name> <other_helm_args>"
    exit
fi

LOGFILE="${CHART_NAME}_$(date '+%Y%m%d-%H%M%S').log"

tail -n 0 -f /var/log/auditing/audit.log > "logs/$LOGFILE" &

kubectl create namespace "$CHART_NAME"
helm install "$CHART_URL" \
     --name "$CHART_NAME" \
     --namespace "$CHART_NAME" \
     --set serviceAccount.name="$CHART_NAME" \
     --set serviceAccount.create=true \
     --set rbac.create=true \
     $OTHER_ARGS

echo "Logging to file \"logs/$LOGFILE\"... Ctrl-C to stop"
fg > /dev/null
echo
echo "Logging stopped." 
