     create view conformance.new_endpoint as
          select endpoint,
                 first_release as release,
                 (first_conformance_test is not null) as tested
                   from conformance.eligible_endpoint_coverage
               order by first_release::semver desc, tested;

     comment on view conformance.new_endpoint is 'eligible endpoints sorted by release and whether they are tested';

     comment on column conformance.new_endpoint.endpoint is 'eligible endpoint as defined in table open_api';
     comment on column conformance.new_endpoint.release is 'release in which this endpoint was promoted';
     comment on column conformance.new_endpoint.endpoint is 'is this endpoint hit by a conformance test, as of latest test run?';

     select 'conformance.new_endpoint defined and commented' as "build log";
