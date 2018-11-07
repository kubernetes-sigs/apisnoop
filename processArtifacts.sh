mkdir -p ./data/processed-audits
(python audit/logreview.py process-audit ./data/ci-kubernetes-gce-conformance-stable-1-12/3/kube-apiserver-audit.log release-1.12 ./data/processed-audits/conformance_1.12.0_2018-10-03.json )&
(python audit/logreview.py process-audit ./data/ci-kubernetes-gce-conformance-stable-1-12/84/kube-apiserver-audit.log release-1.12 ./data/processed-audits/conformance_1.12.1_2018-10-24.json )&
(python audit/logreview.py process-audit ./data/ci-kubernetes-e2e-gce-cos-k8sstable2-default/1446/kube-apiserver-audit.log release-1.10 ./data/processed-audits/sig-release_1.10.10_2018-11-05.json )&
(python audit/logreview.py process-audit ./data/ci-kubernetes-gce-conformance-stable-1-9/747/kube-apiserver-audit.log release-1.9 ./data/processed-audits/conformance_1.9.11_2018-10-24.json )&
(python audit/logreview.py process-audit ./data/ci-kubernetes-e2e-gce-cos-k8sstable3-default/370/kube-apiserver-audit.log release-1.9 ./data/processed-audits/sig-release_1.9.12_2018-11-06.json )&
(python audit/logreview.py process-audit ./data/ci-kubernetes-e2e-gci-gce/31582/kube-apiserver-audit.log 774b18491faf8f ./data/processed-audits/sig-release_1.13.0_2018-11-05.json )&
(python audit/logreview.py process-audit ./data/ci-kubernetes-gce-conformance-stable-1-11/251/kube-apiserver-audit.log release-1.11 ./data/processed-audits/conformance_1.11.3_2018-10-24.json )&
(python audit/logreview.py process-audit ./data/ci-kubernetes-e2e-gce-cos-k8sbeta-default/6808/kube-apiserver-audit.log release-1.12 ./data/processed-audits/sig-release_1.12.3_2018-11-05.json )&
(python audit/logreview.py process-audit ./data/ci-kubernetes-e2e-gce-cos-k8sstable1-default/4267/kube-apiserver-audit.log release-1.11 ./data/processed-audits/sig-release_1.11.5_2018-11-05.json )&
(python audit/logreview.py process-audit ./data/ci-kubernetes-gce-conformance/827/kube-apiserver-audit.log 69f5f5eff28033 ./data/processed-audits/conformance_1.13.0_2018-11-03.json )&
(python audit/logreview.py process-audit ./data/ci-kubernetes-gce-conformance-stable-1-10/746/kube-apiserver-audit.log release-1.10 ./data/processed-audits/conformance_1.10.9_2018-10-24.json )&
wait $(jobs -p)
