    create table conformance.test
      (
        testname text,
        codename text,
        release text,
        description text,
        file text
    );

    comment on table conformance.test is 'info for each conformance test, from latest conformance.yaml';
    comment on column conformance.test.testname is 'name of the test';
    comment on column conformance.test.codename is 'How the test is displayed within a useragent';
    comment on column conformance.test.release is 'release in which this test was promoted to conformance';
    comment on column conformance.test.description is 'description of this test';
    comment on column conformance.test.file is 'file in kubernetes/kubernetes where this test is defined';
