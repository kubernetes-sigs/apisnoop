set -x
set -e
BRANCH=master
LOG=~/apisnoop/webui/backend/data/audit-logs/${BRANCH}/audit.log
JSON=~/apisnoop/webui/backend/data/audit-logs/${BRANCH}/processed-audit.json
# SUNBURST=~/apisnoop/webui/backend/data/audit-logs/${BRANCH}/sunburst.json
# ipdb logreview.py process-audit $LOG ${BRANCH} $JSON
python logreview.py process-audit $LOG ${BRANCH} $JSON
# python refactor.py $JSON $SUNBURST
cat $JSON | jq .endpoints | less
cat $JSON | jq .tests | less
cat $JSON | jq .test_tags | less
cat $JSON | jq .useragents | less
cat $JSON | jq .sunburst | less
