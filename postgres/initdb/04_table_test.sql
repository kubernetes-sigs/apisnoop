create table test
  (
    testname text,
    codename text,
    release text,
    description text,
    file text
);

comment on table test is 'info for each conformance test as taken from latest conformance.yaml';

comment on column test.testname is 'The name of the test';
comment on column test.codename is 'How the test is displayed in code, i.e in the useragent of an audit event';
comment on column test.release is 'The release in which this test  was promoted to conformance';
comment on column test.description is 'A description of this test';
comment on column test.file is 'The file in kubernetes/kubernetes where this test is defined';
