     begin;
     select * from load_audit_events() f("build log");
     select * from load_audit_events('ci-kubernetes-gce-conformance-latest') f("build log");
     select * from load_audit_events('ci-audit-kind-conformance','1323441578722725888') f("build log");
     commit;
