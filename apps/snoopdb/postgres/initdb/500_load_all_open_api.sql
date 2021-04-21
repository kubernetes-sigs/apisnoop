begin;
select f.*
    from
    (select release from grab_past_releases() as release) r
    , lateral load_open_api(r.release::text) f("build log");
select * from load_open_api() f("build log");
commit;
