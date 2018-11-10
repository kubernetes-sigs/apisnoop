set -x
set -e
BRANCH=master
LOG=~/apisnoop/webui/backend/data/audit-logs/${BRANCH}/audit.log
#JSON=~/apisnoop/webui/backend/data/audit-logs/${BRANCH}/processed-audit.json
#LOG=~/apisnoop/webui/backend/data/audit-logs/${BRANCH}.log
JSON=~/apisnoop/webui/backend/data/processed-audits/${BRANCH}-processed-audit.json
# SUNBURST=~/apisnoop/webui/backend/data/audit-logs/${BRANCH}/sunburst.json
# ipdb logreview.py process-audit $LOG ${BRANCH} $JSON
python logreview.py process-audit $LOG ${BRANCH} $JSON
# sed -i 's:\.:_:g' $JSON
# for BRANCH in 1.12 1.11 1.10 1.9;  do
#    LOG=~/apisnoop/webui/backend/data/audit-logs/${BRANCH}/audit.log
#    #JSON=~/apisnoop/webui/backend/data/audit-logs/${BRANCH}/processed-audit.json
#    #LOG=~/apisnoop/webui/backend/data/audit-logs/${BRANCH}.log
#    JSON=~/apisnoop/webui/backend/data/processed-audits/${BRANCH}-processed-audit.json
#    python logreview.py process-audit $LOG release-${BRANCH} $JSON
#    echo $JSON will be seded
#    # sed -i 's:\.:_:g' $JSON
# done
# python refactor.py $JSON $SUNBURST
cat $JSON | jq .endpoints | less
cat $JSON | jq .tests | less
cat $JSON | jq .test_tags | less
cat $JSON | jq .useragents | less
cat $JSON | jq .sunburst | less
