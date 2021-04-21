create function generate_latest_coverage_json()
returns json as $$
declare latest_release varchar;
begin
select release into latest_release from audit_event order by release::semver limit 1;
return(
select jsonb_pretty(row_to_json(c)::jsonb) from (
    select open_api.release, open_api.release_date, open_api.spec,
        count(distinct endpoint_coverage.endpoint)  as "total endpoints",
        count(distinct endpoint_coverage.endpoint) filter (where endpoint_coverage.tested is true)  as "tested endpoints",
        cpr."total endpoints" as "total conformance eligible endpoints",
        cpr."total tested" as "tested conformance eligible endpoints",
        cpr."new endpoints" as "new conformance eligible endpoints",
        cpr.tested as "new tested conformance eligible endpoints",
        (select array_agg(source) from (select source from audit_event where release = latest_release group by source) s) as sources,
        (select array_agg(row_to_json(endpoint_coverage)) from endpoint_coverage where release = latest_release and endpoint is not null) as endpoints,
        (select array_agg(row_to_json(audit_event_test)) from audit_event_test where release = latest_release) as tests
    from open_api
    join endpoint_coverage using(release)
    left join conformance.coverage_per_release cpr on(open_api.release::semver = cpr.release::semver)
    where open_api.release = latest_release
    group by open_api.release, open_api.release_date, open_api.spec, cpr."total endpoints", cpr."total tested", cpr."new endpoints", cpr.tested) c);
end;
$$ language plpgsql;

comment on function generate_latest_coverage_json is 'helper to create properly formatted json to be output as a  coverage/X.XX.json file';

select 'generate_latest_coverage_json function defined and commented' as "build log";
