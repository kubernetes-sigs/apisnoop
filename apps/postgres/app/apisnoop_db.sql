-- apisnoop_db.sql

-- init-apisnoop-db.sh

--  #+NAME: init apisnoop db

-- ERROR:  database "apisnoop" already exists
-- create database apisnoop;
-- create user myuser with encrypted password 'mypass';
grant all privileges on database apisnoop to apisnoop;
create role dba with superuser noinherit;
grant dba to apisnoop;
\connect apisnoop
-- we generate uuids
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- we write python functions
CREATE EXTENSION IF NOT EXISTS plpython3u;
-- we write shell functions
CREATE EXTENSION IF NOT EXISTS plsh;
-- regex indexes required trgm
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- paths need an index too
CREATE EXTENSION IF NOT EXISTS ltree;
-- hasura needs hash functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- hasura db catalog and views
CREATE SCHEMA IF NOT EXISTS hdb_catalog;
CREATE SCHEMA IF NOT EXISTS hdb_views;
-- make the user an owner of system schemas
ALTER SCHEMA hdb_catalog OWNER TO apisnoop;
ALTER SCHEMA hdb_views OWNER TO apisnoop;
GRANT SELECT ON ALL TABLES IN SCHEMA information_schema TO apisnoop;
GRANT SELECT ON ALL TABLES IN SCHEMA pg_catalog TO apisnoop;
GRANT USAGE ON SCHEMA public TO apisnoop;
GRANT ALL ON ALL TABLES IN SCHEMA public TO apisnoop;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO apisnoop;
GRANT pg_execute_server_program TO apisnoop;
