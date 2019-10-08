-- 910: populate_audit_events.up.sql
--   :PROPERTIES:
--   :header-args:sql-mode+: :tangle ../apps/hasura/migrations/910_populate_audit_events.up.sql
--   :END:
-- #+NAME: reload sample audit event 

delete from raw_audit_event;
select * from load_audit_events('ci-kubernetes-e2e-gci-gce', '1173412183980118017');
select * from load_audit_events('ci-kubernetes-e2e-gci-gce', '1178464478988079104');
select * from load_audit_events('ci-kubernetes-e2e-gci-gce', '1181584183475048448');
 REFRESH MATERIALIZED VIEW kind_field_path_material;
 REFRESH MATERIALIZED VIEW podspec_field_coverage_material;
