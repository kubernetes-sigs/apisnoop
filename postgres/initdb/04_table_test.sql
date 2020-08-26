    create table test
      (
        testname text,
        codename text,
        release text,
        description text,
        file text
    );

    comment on table test is 'info for each conformance test, from latest conformance.yaml';
    comment on column test.testname is 'name of the test';
    comment on column test.codename is 'How the test is displayed within a useragent';
    comment on column test.release is 'release in which this test was promoted to conformance';
    comment on column test.description is 'Description of this test';
    comment on column test.file is 'File in kubernetes/kubernetes where this test is defined';
