
#!/usr/bin/python


from subprocess import Popen, PIPE, STDOUT

import json
import os
import sys
import re
import io
from datetime import datetime

# COMMAND = "./simulate-e2e.sh"
COMMAND = "cd ~/go/src/k8s.io/kubernetes && unbuffer go run hack/e2e.go -- --test"

logfile = open("capture-e2e.log", "wb")
entryfile = open("entries.log", "wb")

linestash = []
lines_record = 0
timestamp = None
p = Popen(COMMAND, shell=True, stdout=PIPE) #, stderr=STDOUT)

while True:
    line = p.stdout.readline()
    if line == "":
        break
    logfile.write(line)
    line = line.strip('\n')
    print line
    if line.startswith("----------"):
        timestamp = datetime.utcnow().isoformat()
        lines_record = 3
    elif lines_record > 0:
        linestash += [line]
        lines_record -= 1
        if lines_record == 0:
            data = {
                'timestamp': timestamp,
                'lines': linestash
            }
            payload = json.dumps(data)
            print "GOT ONE:", payload
            entryfile.write(payload + "\n")
            linestash = []

print "==== DONE ===="
