set -x
set -e
BRANCH=master
LOG=~/apisnoop/webui/backend/data/audit-logs/${BRANCH}/audit.log
JSON=~/apisnoop/webui/backend/data/audit-logs/${BRANCH}/processed-audit.json
SUNBURST=~/apisnoop/webui/backend/data/audit-logs/${BRANCH}/sunburst.json
python logreview.py process-audit $LOG ${BRANCH} $JSON
python refactor.py $JSON $SUNBURST
cat $SUNBURST | jq . | less
