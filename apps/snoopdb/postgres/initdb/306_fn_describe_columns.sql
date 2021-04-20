       create or replace function describe_columns(
         in schema text,
         in relation text,
         out "column" text,
         out description text
       )
         returns setof record
       as $$
       select cols.column_name::text as "column",
              pg_catalog.col_description(c.oid, cols.ordinal_position::int)::text as description
         from pg_catalog.pg_class c, information_schema.columns cols
        where cols.table_schema = schema
          and cols.table_name = relation
          and cols.table_name = c.relname;
       $$ language SQL;

     comment on function describe_columns is 'given schema and relation, list all columns in that relation and their one-line definitions';

     select 'describe_columns function defined and commented' as "build log";
