# set -x
# set -e
for BRANCH in master 1.12 1.11 1.10 1.9;  do
  LOG=~/apisnoop/webui/backend/data/audit-logs/sig-release/${BRANCH}/audit.log
  JSON=~/data/processed-audits/sig-release-${BRANCH}-processed-audit.json
  if [ ! $BRANCH == "master" ]; then
    # BRANCH let's us know which git tag to pull our openapi spec from
    BRANCH=branch-$BRANCH
  fi
  python logreview.py process-audit $LOG $BRANCH $JSON &
#   sleep 1
# cat $JSON | jq .endpoints | less
# echo Starting $BRANCH tests
# sleep 1
# cat $JSON | jq .tests | less
# echo Starting $BRANCH sequences
# sleep 1
# cat $JSON | jq .test_sequences | less
# echo Starting $BRANCH tags
# sleep 1
# cat $JSON | jq .test_tags | less
# echo Starting $BRANCH useragents
# sleep 1
# cat $JSON | jq .useragents | less
# echo Starting $BRANCH sunburst
# sleep 1
# cat $JSON | jq .sunburst | less
done

wait $(jobs -p)
# python refactor.py $JSON $SUNBURST
