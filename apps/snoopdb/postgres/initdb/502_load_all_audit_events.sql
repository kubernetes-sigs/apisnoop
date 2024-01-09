\set load_k8s_data null
\getenv load_k8s_data LOAD_K8S_DATA
select :load_k8s_data is not null as proceed;
\gset

\if :proceed
begin;
   -- just a test
-- select * from load_audit_events('ci-kubernetes-e2e-gci-gce') f("build log");
-- select * from load_audit_events('ci-kubernetes-gce-conformance-latest') f("build log");
select * from load_audit_events('ci-audit-kind-conformance') f("build log");
call update_pod_binding_events();
commit;
\else
 select 'skipping as envvar LOAD_K8S_DATA is not set' as "build log";
\endif
