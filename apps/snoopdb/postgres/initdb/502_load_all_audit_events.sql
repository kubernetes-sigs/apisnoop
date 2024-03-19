begin;
select * from load_audit_events('ci-kubernetes-e2e-gci-gce') f("build log");
select * from load_audit_events('ci-kubernetes-ec2-conformance-latest') f("build log");
select * from load_audit_events('ci-audit-kind-conformance') f("build log");
call update_pod_binding_events();
commit;
