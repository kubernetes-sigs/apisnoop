begin;
select * from load_audit_events('ci-kubernetes-e2e-gci-gce') f("build log");
select * from load_audit_events('ci-kubernetes-gce-conformance-latest') f("build log");
select * from load_audit_events('ci-audit-kind-conformance') f("build log");
commit;
