begin;
select * from load_audit_events() f("build log");
select * from load_audit_events('ci-kubernetes-gce-conformance-latest') f("build log");
commit;
