-- Call load_audit_events()

-- #+NAME: reload sample audit event

select * from load_audit_events('ci-kubernetes-e2e-gci-gce','1134962072287711234');
-- select * from audit_event_op_update();
