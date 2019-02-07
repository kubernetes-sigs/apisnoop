mkdir -p ./data-gen/data/processed-audits
(
python /home/zz/ii/apisnoop/data-gen/processAuditlog.py ./data-gen/data/ci-kubernetes-e2e-gce-cos-k8sstable2-default/1789/kube-apiserver-audit.log release-1.11 ./data-gen/data/processed-audits/sig-release_1.11.8_2019-01-30_e2e-only.json
)&
(
python /home/zz/ii/apisnoop/data-gen/processAuditlog.py ./data-gen/data/ci-kubernetes-e2e-gce-cos-k8sbeta-default/8843/kube-apiserver-audit.log release-1.13 ./data-gen/data/processed-audits/sig-release_1.13.3_2019-01-30_e2e-only.json
)&
(
python /home/zz/ii/apisnoop/data-gen/processAuditlog.py ./data-gen/data/ci-kubernetes-e2e-gce-cos-k8sstable3-default/446/kube-apiserver-audit.log release-1.10 ./data-gen/data/processed-audits/sig-release_1.10.13_2019-01-21_e2e-only.json
)&
(
python /home/zz/ii/apisnoop/data-gen/processAuditlog.py ./data-gen/data/ci-kubernetes-e2e-gce-cos-k8sstable1-default/5294/kube-apiserver-audit.log release-1.12 ./data-gen/data/processed-audits/sig-release_1.12.6_2019-01-30_e2e-only.json
)&
(
python /home/zz/ii/apisnoop/data-gen/processAuditlog.py ./data-gen/data/ci-kubernetes-e2e-gci-gce/34369/kube-apiserver-audit.log 34425974c88fa6 ./data-gen/data/processed-audits/sig-release_1.14.0_2019-01-30_e2e-only.json
)&
wait $(jobs -p)
