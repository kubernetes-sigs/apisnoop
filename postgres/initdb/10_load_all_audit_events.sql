begin;
select * from load_audit_events();
select * from load_audit_events('ci-kubernetes-gce-conformance-latest');
commit;
