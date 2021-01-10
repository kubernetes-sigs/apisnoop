create or replace function describe_column(
  in schema text,
  in relation text,
  in col text,
  out "column" text,
  out "description" text
)
returns setof record
     as $$
select cols.column_name::text as "column",
       pg_catalog.col_description(c.oid, cols.ordinal_position::int)::text as description
  from pg_catalog.pg_class c, information_schema.columns cols
 where cols.table_schema = schema
   and cols.table_name = relation
   and cols.column_name = col
   and cols.table_name = c.relname;
 $$ language SQL;

comment on function describe_column is 'given schema, relation, and column return its one line definition';

select 'describe_column function defined and commented' as "build log";
