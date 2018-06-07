# e2e-audit-correlate

> "Which Kubernetes audit log entries belong to which e2e tests?**

## Method

![diagram showing how everything works](docs/diagram.png)

0. Make sure your Kubernetes source tree is symlinked to `~/go/src/k8s.io/kubernetes`
1. Build Kubernetes using `go run hack/e2e.go -- --build`
2. Start up a cluster using `go run hack/e2e.go -- --up`
3. Clone this repo
4. Install **unbuffer** - `sudo apt-get install expect` (TODO Mac variant? Measure difference vs without?)
5. Login into the K8s master via SSH - eg `gcloud compute --project "<project>" ssh --zone "<zone>" "<name of master>"`
6. Tail the audit logs on the K8s master - `nohup tail -f -n0 /var/log/kube-apiserver-audit.log 2>/dev/null > ~/audit-e2e.log &`
7. From your staging box run `python spy-e2e-conformance.py` - this will start the e2e tests and monitor the output
8. Wait a long time......
9. Once `python spy-e2e-conformance.py` finishes, find and kill your tail on the K8s master:
```
ps aux | grep "tail"
# look for the PID
kill <tail pid>
```
10. Compress (the file will be over 1GB uncompressed and 100MB compressed) and download `audit-e2e.log` from the K8s master. Uncompress and put it in the same folder as the python scripts.
11. Run `python correlate_timestamps.py` to correlate the timestamps from `entries.py` and `audit-e2e.log`
12. Run `python convert_output_to_text.py` to convert the output to a human readable format
13. Tear down the K8s cluster - `hack/e2e.go -- --down`

## FAQ

### Where did this work come from?

As part of identifying which existing Kubernetes Pod e2e tests to promote to conformance, there was a request from @AishSundar to get a mapping of existing e2e tests to the API endpoints they cover.

See ticket [here](https://github.com/cncf/apisnoop/issues/17). Please add feedback to the ticket if you have any.

### Which e2e tests are run? Is it just conformance?

At the moment the e2e command that is run is `go run hack/e2e.go -- --test`. This seems to run the majority of the tests - not just conformance related ones.

## Assumptions

Some assumptions were made to reduce the complexity of the problem. These are:

- The latency between kubetest writing to stdout and my program reading and detecting a new test is negligible. I measured 300us using the `simulate-e2e.py` script.
- The audit logs are timestamped when the request is received on the Kubernetes end.
- The time between the K8s master and where the e2e tests are being run is synchronised.
- The mark `--------------` denotes a new test being run in the e2e output and this mark is found nowhere else in the e2e logs.

## Alternative Approaches

Here are some other approaches that were discussed:

- Adding timestamp "marks" to the audit logs by calling a (non-existent) endpoint with identifiable URL or parameter. Even if the endpoint doesnt exist, it will still show up in the audit logs timestamped.
  - /apisnoop-mark?test=e2e/pods.go:723&message="should do something"
- Editing kubernetes and kubetest to pass the test information in as a "User-agent" header (or custom HTTP headers)
