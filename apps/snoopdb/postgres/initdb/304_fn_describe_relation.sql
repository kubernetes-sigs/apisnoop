create or replace function describe_relation(
  schema text,
  relation text
)
  returns text
as $$
  select obj_description((schema||'.'||relation)::regclass)
$$ language SQL;

comment on function describe_relation is 'given schema and relation, return its one-line definition';

select 'describe_relation function defined and commented' as "build log";
