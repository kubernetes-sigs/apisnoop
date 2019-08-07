

-- #+NAME: create database and granting all privs to a user

create database zz;
-- create user myuser with encrypted password 'mypass';
grant all privileges on database zz to zz;
create role dba with superuser noinherit;
grant dba to zz;
\connect zz
-- we write python functions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS plpython3u;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS hdb_catalog;
CREATE SCHEMA IF NOT EXISTS hdb_views;
-- make the user an owner of system schemas
ALTER SCHEMA hdb_catalog OWNER TO zz;
ALTER SCHEMA hdb_views OWNER TO zz;
GRANT SELECT ON ALL TABLES IN SCHEMA information_schema TO zz;
GRANT SELECT ON ALL TABLES IN SCHEMA pg_catalog TO zz;
GRANT USAGE ON SCHEMA public TO zz;
GRANT ALL ON ALL TABLES IN SCHEMA public TO zz;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO zz;
GRANT pg_execute_server_program TO zz;
