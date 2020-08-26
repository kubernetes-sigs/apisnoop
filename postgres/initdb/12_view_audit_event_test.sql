     create or replace view audit_event_test as
       select audit_event.release,
              test,
              (testname is not null) as conformance_test,
                test.testname,
              test.file,
              test.release as promotion_release
         from      audit_event
         left join test on(test = codename)
        where test is not null
        group by test, testname, file, test.release, audit_event.release;

     comment on view audit_event_test is 'every test in the audit_log of a release';
     comment on column audit_event_test.release is 'audit log relesae this test is pulled from';
     comment on column audit_event_test.test is 'test as it appears in audit event, would be codename in conformance.yaml';
     comment on column audit_event_test.conformance_test is 'is this a conformance test?';
     comment on column audit_event_test.testname is 'if conformance, testname as it appears in conformance.yaml, else null.';
     comment on column audit_event_test.file is 'if conformance, file in which test is defined, else null';
     comment on column audit_event_test.promotion_release is 'if conformance, release in which it was promoted, else null.';

     select 'audit_event_test defined and commented' as "build log";
