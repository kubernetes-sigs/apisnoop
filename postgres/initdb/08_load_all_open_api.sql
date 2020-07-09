begin;
with releases as (
  select column1 as release
    from (values
    ('v1.8.0'),
    ('v1.9.0'),
    ('v1.10.0'),
    ('v1.11.0'),
    ('v1.12.0'),
    ('v1.13.0'),
    ('v1.14.0')
    ) as rlist
)
select f.*
  from
  releases r
  , lateral load_open_api(r.release) f(loading_results);
select * from load_open_api() f(loading_results);
commit;
