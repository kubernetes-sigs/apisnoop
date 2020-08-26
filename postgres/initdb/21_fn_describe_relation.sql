     create or replace function describe_relation(
       schema text,
       relation text
     )
       returns text
     as $$
       select obj_description((schema||'.'||relation)::regclass)
     $$ language SQL;
