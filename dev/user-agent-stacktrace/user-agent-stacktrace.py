import os
import sys
import json

with open(sys.argv[1], "rb") as auditlogfile:
    for auditentry in auditlogfile:
        data = json.loads(auditentry)
        useragent = data['userAgent']
        verb = data['verb']
        requesturi = data['requestURI']
        if not "stacktrace=" in useragent:
            continue
        text = useragent.split("stacktrace=[", 1)[1].rsplit("]", 1)[0]
        lines = text.split(";")
        backtrace = []
        for line in lines:
            backtrace.append(line.split(":"))

        print verb, requesturi
        for function, filepath, lineno in backtrace:
            print "    %s" % function
            print "        %s:%s" % (filepath, lineno)
        
