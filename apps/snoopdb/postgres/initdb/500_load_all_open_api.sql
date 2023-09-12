\set load_k8s_data null
\getenv load_k8s_data LOAD_K8S_DATA
select :load_k8s_data is not null as proceed;
\gset

\if :proceed
begin;
select f.*
    from
    (select release from grab_past_releases() as release) r
    , lateral load_open_api(r.release::text) f("build log");
select * from load_open_api() f("build log");
commit;
\else
 select 'skipping as envvar LOAD_K8S_DATA is not set' as "build log";
\endif
