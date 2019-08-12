

-- #+NAME: create database and granting all privs to a user

create database hh;
-- create user myuser with encrypted password 'mypass';
grant all privileges on database hh to hh;
create role dba with superuser noinherit;
grant dba to hh;
\connect hh
-- we write python functions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS plpython3u;
CREATE EXTENSION IF NOT EXISTS plsh;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE SCHEMA IF NOT EXISTS hdb_catalog;
CREATE SCHEMA IF NOT EXISTS hdb_views;
-- make the user an owner of system schemas
ALTER SCHEMA hdb_catalog OWNER TO hh;
ALTER SCHEMA hdb_views OWNER TO hh;
GRANT SELECT ON ALL TABLES IN SCHEMA information_schema TO hh;
GRANT SELECT ON ALL TABLES IN SCHEMA pg_catalog TO hh;
GRANT USAGE ON SCHEMA public TO hh;
GRANT ALL ON ALL TABLES IN SCHEMA public TO hh;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO hh;
GRANT pg_execute_server_program TO hh;
