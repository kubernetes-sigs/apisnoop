--
-- PostgreSQL database dump
--

-- Dumped from database version 11.4 (Ubuntu 11.4-1.pgdg16.04+1)
-- Dumped by pg_dump version 11.4 (Debian 11.4-1.pgdg90+1)

-- Started on 2019-07-15 11:11:32 NZST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 8 (class 2615 OID 8630792)
-- Name: hdb_catalog; Type: SCHEMA; Schema: -; Owner: ygrrlqaucoxunc
--

CREATE SCHEMA hdb_catalog;


ALTER SCHEMA hdb_catalog OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 7 (class 2615 OID 8630793)
-- Name: hdb_views; Type: SCHEMA; Schema: -; Owner: ygrrlqaucoxunc
--

CREATE SCHEMA hdb_views;


ALTER SCHEMA hdb_views OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 2 (class 3079 OID 8630794)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 4109 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 285 (class 1255 OID 8630998)
-- Name: hdb_schema_update_event_notifier(); Type: FUNCTION; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE FUNCTION hdb_catalog.hdb_schema_update_event_notifier() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  DECLARE
    instance_id uuid;
    occurred_at timestamptz;
    curr_rec record;
  BEGIN
    instance_id = NEW.instance_id;
    occurred_at = NEW.occurred_at;
    PERFORM pg_notify('hasura_schema_update', json_build_object(
      'instance_id', instance_id,
      'occurred_at', occurred_at
      )::text);
    RETURN curr_rec;
  END;
$$;


ALTER FUNCTION hdb_catalog.hdb_schema_update_event_notifier() OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 283 (class 1255 OID 8630852)
-- Name: hdb_table_oid_check(); Type: FUNCTION; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE FUNCTION hdb_catalog.hdb_table_oid_check() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
    IF (EXISTS (SELECT 1 FROM information_schema.tables st WHERE st.table_schema = NEW.table_schema AND st.table_name = NEW.table_name)) THEN
      return NEW;
    ELSE
      RAISE foreign_key_violation using message = 'table_schema, table_name not in information_schema.tables';
      return NULL;
    END IF;
  END;
$$;


ALTER FUNCTION hdb_catalog.hdb_table_oid_check() OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 284 (class 1255 OID 8630917)
-- Name: inject_table_defaults(text, text, text, text); Type: FUNCTION; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE FUNCTION hdb_catalog.inject_table_defaults(view_schema text, view_name text, tab_schema text, tab_name text) RETURNS void
    LANGUAGE plpgsql
    AS $$
    DECLARE
        r RECORD;
    BEGIN
      FOR r IN SELECT column_name, column_default FROM information_schema.columns WHERE table_schema = tab_schema AND table_name = tab_name AND column_default IS NOT NULL LOOP
          EXECUTE format('ALTER VIEW %I.%I ALTER COLUMN %I SET DEFAULT %s;', view_schema, view_name, r.column_name, r.column_default);
      END LOOP;
    END;
$$;


ALTER FUNCTION hdb_catalog.inject_table_defaults(view_schema text, view_name text, tab_schema text, tab_name text) OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 286 (class 1255 OID 8631010)
-- Name: insert_event_log(text, text, text, text, json); Type: FUNCTION; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE FUNCTION hdb_catalog.insert_event_log(schema_name text, table_name text, trigger_name text, op text, row_data json) RETURNS text
    LANGUAGE plpgsql
    AS $$
  DECLARE
    id text;
    payload json;
    session_variables json;
    server_version_num int;
  BEGIN
    id := gen_random_uuid();
    server_version_num := current_setting('server_version_num');
    IF server_version_num >= 90600 THEN
      session_variables := current_setting('hasura.user', 't');
    ELSE
      BEGIN
        session_variables := current_setting('hasura.user');
      EXCEPTION WHEN OTHERS THEN
                  session_variables := NULL;
      END;
    END IF;
    payload := json_build_object(
      'op', op,
      'data', row_data,
      'session_variables', session_variables
    );
    INSERT INTO hdb_catalog.event_log
                (id, schema_name, table_name, trigger_name, payload)
    VALUES
    (id, schema_name, table_name, trigger_name, payload);
    RETURN id;
  END;
$$;


ALTER FUNCTION hdb_catalog.insert_event_log(schema_name text, table_name text, trigger_name text, op text, row_data json) OWNER TO ygrrlqaucoxunc;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 211 (class 1259 OID 8630946)
-- Name: event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE TABLE hdb_catalog.event_invocation_logs (
    id text DEFAULT public.gen_random_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.event_invocation_logs OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 210 (class 1259 OID 8630931)
-- Name: event_log; Type: TABLE; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE TABLE hdb_catalog.event_log (
    id text DEFAULT public.gen_random_uuid() NOT NULL,
    schema_name text NOT NULL,
    table_name text NOT NULL,
    trigger_name text NOT NULL,
    payload jsonb NOT NULL,
    delivered boolean DEFAULT false NOT NULL,
    error boolean DEFAULT false NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    locked boolean DEFAULT false NOT NULL,
    next_retry_at timestamp without time zone
);


ALTER TABLE hdb_catalog.event_log OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 209 (class 1259 OID 8630918)
-- Name: event_triggers; Type: TABLE; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE TABLE hdb_catalog.event_triggers (
    name text NOT NULL,
    type text NOT NULL,
    schema_name text NOT NULL,
    table_name text NOT NULL,
    configuration json,
    comment text
);


ALTER TABLE hdb_catalog.event_triggers OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 221 (class 1259 OID 8631020)
-- Name: hdb_allowlist; Type: TABLE; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE TABLE hdb_catalog.hdb_allowlist (
    collection_name text
);


ALTER TABLE hdb_catalog.hdb_allowlist OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 206 (class 1259 OID 8630902)
-- Name: hdb_check_constraint; Type: VIEW; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE VIEW hdb_catalog.hdb_check_constraint AS
 SELECT (n.nspname)::text AS table_schema,
    (ct.relname)::text AS table_name,
    (r.conname)::text AS constraint_name,
    pg_get_constraintdef(r.oid, true) AS "check"
   FROM ((pg_constraint r
     JOIN pg_class ct ON ((r.conrelid = ct.oid)))
     JOIN pg_namespace n ON ((ct.relnamespace = n.oid)))
  WHERE (r.contype = 'c'::"char");


ALTER TABLE hdb_catalog.hdb_check_constraint OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 205 (class 1259 OID 8630897)
-- Name: hdb_foreign_key_constraint; Type: VIEW; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE VIEW hdb_catalog.hdb_foreign_key_constraint AS
 SELECT (q.table_schema)::text AS table_schema,
    (q.table_name)::text AS table_name,
    (q.constraint_name)::text AS constraint_name,
    (min(q.constraint_oid))::integer AS constraint_oid,
    min((q.ref_table_table_schema)::text) AS ref_table_table_schema,
    min((q.ref_table)::text) AS ref_table,
    json_object_agg(ac.attname, afc.attname) AS column_mapping,
    min((q.confupdtype)::text) AS on_update,
    min((q.confdeltype)::text) AS on_delete
   FROM ((( SELECT ctn.nspname AS table_schema,
            ct.relname AS table_name,
            r.conrelid AS table_id,
            r.conname AS constraint_name,
            r.oid AS constraint_oid,
            cftn.nspname AS ref_table_table_schema,
            cft.relname AS ref_table,
            r.confrelid AS ref_table_id,
            r.confupdtype,
            r.confdeltype,
            unnest(r.conkey) AS column_id,
            unnest(r.confkey) AS ref_column_id
           FROM ((((pg_constraint r
             JOIN pg_class ct ON ((r.conrelid = ct.oid)))
             JOIN pg_namespace ctn ON ((ct.relnamespace = ctn.oid)))
             JOIN pg_class cft ON ((r.confrelid = cft.oid)))
             JOIN pg_namespace cftn ON ((cft.relnamespace = cftn.oid)))
          WHERE (r.contype = 'f'::"char")) q
     JOIN pg_attribute ac ON (((q.column_id = ac.attnum) AND (q.table_id = ac.attrelid))))
     JOIN pg_attribute afc ON (((q.ref_column_id = afc.attnum) AND (q.ref_table_id = afc.attrelid))))
  GROUP BY q.table_schema, q.table_name, q.constraint_name;


ALTER TABLE hdb_catalog.hdb_foreign_key_constraint OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 212 (class 1259 OID 8630962)
-- Name: hdb_function; Type: TABLE; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE TABLE hdb_catalog.hdb_function (
    function_schema text NOT NULL,
    function_name text NOT NULL,
    is_system_defined boolean DEFAULT false
);


ALTER TABLE hdb_catalog.hdb_function OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 213 (class 1259 OID 8630971)
-- Name: hdb_function_agg; Type: VIEW; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE VIEW hdb_catalog.hdb_function_agg AS
 SELECT (p.proname)::text AS function_name,
    (pn.nspname)::text AS function_schema,
        CASE
            WHEN (p.provariadic = (0)::oid) THEN false
            ELSE true
        END AS has_variadic,
        CASE
            WHEN ((p.provolatile)::text = ('i'::character(1))::text) THEN 'IMMUTABLE'::text
            WHEN ((p.provolatile)::text = ('s'::character(1))::text) THEN 'STABLE'::text
            WHEN ((p.provolatile)::text = ('v'::character(1))::text) THEN 'VOLATILE'::text
            ELSE NULL::text
        END AS function_type,
    pg_get_functiondef(p.oid) AS function_definition,
    (rtn.nspname)::text AS return_type_schema,
    (rt.typname)::text AS return_type_name,
        CASE
            WHEN ((rt.typtype)::text = ('b'::character(1))::text) THEN 'BASE'::text
            WHEN ((rt.typtype)::text = ('c'::character(1))::text) THEN 'COMPOSITE'::text
            WHEN ((rt.typtype)::text = ('d'::character(1))::text) THEN 'DOMAIN'::text
            WHEN ((rt.typtype)::text = ('e'::character(1))::text) THEN 'ENUM'::text
            WHEN ((rt.typtype)::text = ('r'::character(1))::text) THEN 'RANGE'::text
            WHEN ((rt.typtype)::text = ('p'::character(1))::text) THEN 'PSUEDO'::text
            ELSE NULL::text
        END AS return_type_type,
    p.proretset AS returns_set,
    ( SELECT COALESCE(json_agg(q.type_name), '[]'::json) AS "coalesce"
           FROM ( SELECT pt.typname AS type_name,
                    pat.ordinality
                   FROM (unnest(COALESCE(p.proallargtypes, (p.proargtypes)::oid[])) WITH ORDINALITY pat(oid, ordinality)
                     LEFT JOIN pg_type pt ON ((pt.oid = pat.oid)))
                  ORDER BY pat.ordinality) q) AS input_arg_types,
    to_json(COALESCE(p.proargnames, ARRAY[]::text[])) AS input_arg_names
   FROM (((pg_proc p
     JOIN pg_namespace pn ON ((pn.oid = p.pronamespace)))
     JOIN pg_type rt ON ((rt.oid = p.prorettype)))
     JOIN pg_namespace rtn ON ((rtn.oid = rt.typnamespace)))
  WHERE (((pn.nspname)::text !~~ 'pg_%'::text) AND ((pn.nspname)::text <> ALL (ARRAY['information_schema'::text, 'hdb_catalog'::text, 'hdb_views'::text])) AND (NOT (EXISTS ( SELECT 1
           FROM pg_aggregate
          WHERE ((pg_aggregate.aggfnoid)::oid = p.oid)))));


ALTER TABLE hdb_catalog.hdb_function_agg OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 219 (class 1259 OID 8631005)
-- Name: hdb_function_info_agg; Type: VIEW; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE VIEW hdb_catalog.hdb_function_info_agg AS
 SELECT hdb_function_agg.function_name,
    hdb_function_agg.function_schema,
    row_to_json(( SELECT e.*::record AS e
           FROM ( SELECT hdb_function_agg.has_variadic,
                    hdb_function_agg.function_type,
                    hdb_function_agg.return_type_schema,
                    hdb_function_agg.return_type_name,
                    hdb_function_agg.return_type_type,
                    hdb_function_agg.returns_set,
                    hdb_function_agg.input_arg_types,
                    hdb_function_agg.input_arg_names,
                    (EXISTS ( SELECT 1
                           FROM information_schema.tables
                          WHERE (((tables.table_schema)::text = hdb_function_agg.return_type_schema) AND ((tables.table_name)::text = hdb_function_agg.return_type_name)))) AS returns_table) e)) AS function_info
   FROM hdb_catalog.hdb_function_agg;


ALTER TABLE hdb_catalog.hdb_function_info_agg OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 202 (class 1259 OID 8630869)
-- Name: hdb_permission; Type: TABLE; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE TABLE hdb_catalog.hdb_permission (
    table_schema text NOT NULL,
    table_name text NOT NULL,
    role_name text NOT NULL,
    perm_type text NOT NULL,
    perm_def jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false,
    CONSTRAINT hdb_permission_perm_type_check CHECK ((perm_type = ANY (ARRAY['insert'::text, 'select'::text, 'update'::text, 'delete'::text])))
);


ALTER TABLE hdb_catalog.hdb_permission OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 203 (class 1259 OID 8630884)
-- Name: hdb_permission_agg; Type: VIEW; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE VIEW hdb_catalog.hdb_permission_agg AS
 SELECT hdb_permission.table_schema,
    hdb_permission.table_name,
    hdb_permission.role_name,
    json_object_agg(hdb_permission.perm_type, hdb_permission.perm_def) AS permissions
   FROM hdb_catalog.hdb_permission
  GROUP BY hdb_permission.table_schema, hdb_permission.table_name, hdb_permission.role_name;


ALTER TABLE hdb_catalog.hdb_permission_agg OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 208 (class 1259 OID 8630912)
-- Name: hdb_primary_key; Type: VIEW; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE VIEW hdb_catalog.hdb_primary_key AS
 SELECT tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    json_agg(constraint_column_usage.column_name) AS columns
   FROM (information_schema.table_constraints tc
     JOIN ( SELECT x.tblschema AS table_schema,
            x.tblname AS table_name,
            x.colname AS column_name,
            x.cstrname AS constraint_name
           FROM ( SELECT DISTINCT nr.nspname,
                    r.relname,
                    a.attname,
                    c.conname
                   FROM pg_namespace nr,
                    pg_class r,
                    pg_attribute a,
                    pg_depend d,
                    pg_namespace nc,
                    pg_constraint c
                  WHERE ((nr.oid = r.relnamespace) AND (r.oid = a.attrelid) AND (d.refclassid = ('pg_class'::regclass)::oid) AND (d.refobjid = r.oid) AND (d.refobjsubid = a.attnum) AND (d.classid = ('pg_constraint'::regclass)::oid) AND (d.objid = c.oid) AND (c.connamespace = nc.oid) AND (c.contype = 'c'::"char") AND (r.relkind = ANY (ARRAY['r'::"char", 'p'::"char"])) AND (NOT a.attisdropped))
                UNION ALL
                 SELECT nr.nspname,
                    r.relname,
                    a.attname,
                    c.conname
                   FROM pg_namespace nr,
                    pg_class r,
                    pg_attribute a,
                    pg_namespace nc,
                    pg_constraint c
                  WHERE ((nr.oid = r.relnamespace) AND (r.oid = a.attrelid) AND (nc.oid = c.connamespace) AND (r.oid =
                        CASE c.contype
                            WHEN 'f'::"char" THEN c.confrelid
                            ELSE c.conrelid
                        END) AND (a.attnum = ANY (
                        CASE c.contype
                            WHEN 'f'::"char" THEN c.confkey
                            ELSE c.conkey
                        END)) AND (NOT a.attisdropped) AND (c.contype = ANY (ARRAY['p'::"char", 'u'::"char", 'f'::"char"])) AND (r.relkind = ANY (ARRAY['r'::"char", 'p'::"char"])))) x(tblschema, tblname, colname, cstrname)) constraint_column_usage ON ((((tc.constraint_name)::text = (constraint_column_usage.constraint_name)::text) AND ((tc.table_schema)::text = (constraint_column_usage.table_schema)::text) AND ((tc.table_name)::text = (constraint_column_usage.table_name)::text))))
  WHERE ((tc.constraint_type)::text = 'PRIMARY KEY'::text)
  GROUP BY tc.table_schema, tc.table_name, tc.constraint_name;


ALTER TABLE hdb_catalog.hdb_primary_key OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 220 (class 1259 OID 8631011)
-- Name: hdb_query_collection; Type: TABLE; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE TABLE hdb_catalog.hdb_query_collection (
    collection_name text NOT NULL,
    collection_defn jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false
);


ALTER TABLE hdb_catalog.hdb_query_collection OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 204 (class 1259 OID 8630888)
-- Name: hdb_query_template; Type: TABLE; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE TABLE hdb_catalog.hdb_query_template (
    template_name text NOT NULL,
    template_defn jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false
);


ALTER TABLE hdb_catalog.hdb_query_template OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 201 (class 1259 OID 8630854)
-- Name: hdb_relationship; Type: TABLE; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE TABLE hdb_catalog.hdb_relationship (
    table_schema text NOT NULL,
    table_name text NOT NULL,
    rel_name text NOT NULL,
    rel_type text,
    rel_def jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false,
    CONSTRAINT hdb_relationship_rel_type_check CHECK ((rel_type = ANY (ARRAY['object'::text, 'array'::text])))
);


ALTER TABLE hdb_catalog.hdb_relationship OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 217 (class 1259 OID 8630991)
-- Name: hdb_schema_update_event; Type: TABLE; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE TABLE hdb_catalog.hdb_schema_update_event (
    id bigint NOT NULL,
    instance_id uuid NOT NULL,
    occurred_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE hdb_catalog.hdb_schema_update_event OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 216 (class 1259 OID 8630989)
-- Name: hdb_schema_update_event_id_seq; Type: SEQUENCE; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE SEQUENCE hdb_catalog.hdb_schema_update_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE hdb_catalog.hdb_schema_update_event_id_seq OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 4110 (class 0 OID 0)
-- Dependencies: 216
-- Name: hdb_schema_update_event_id_seq; Type: SEQUENCE OWNED BY; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER SEQUENCE hdb_catalog.hdb_schema_update_event_id_seq OWNED BY hdb_catalog.hdb_schema_update_event.id;


--
-- TOC entry 200 (class 1259 OID 8630843)
-- Name: hdb_table; Type: TABLE; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE TABLE hdb_catalog.hdb_table (
    table_schema text NOT NULL,
    table_name text NOT NULL,
    is_system_defined boolean DEFAULT false
);


ALTER TABLE hdb_catalog.hdb_table OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 218 (class 1259 OID 8631000)
-- Name: hdb_table_info_agg; Type: VIEW; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE VIEW hdb_catalog.hdb_table_info_agg AS
 SELECT tables.table_name,
    tables.table_schema,
    COALESCE(columns.columns, '[]'::json) AS columns,
    COALESCE(pk.columns, '[]'::json) AS primary_key_columns,
    COALESCE(constraints.constraints, '[]'::json) AS constraints,
    COALESCE(views.view_info, 'null'::json) AS view_info
   FROM ((((information_schema.tables tables
     LEFT JOIN ( SELECT c.table_name,
            c.table_schema,
            json_agg(json_build_object('name', c.column_name, 'type', c.udt_name, 'is_nullable', (c.is_nullable)::boolean)) AS columns
           FROM information_schema.columns c
          GROUP BY c.table_schema, c.table_name) columns ON ((((tables.table_schema)::text = (columns.table_schema)::text) AND ((tables.table_name)::text = (columns.table_name)::text))))
     LEFT JOIN ( SELECT hdb_primary_key.table_schema,
            hdb_primary_key.table_name,
            hdb_primary_key.constraint_name,
            hdb_primary_key.columns
           FROM hdb_catalog.hdb_primary_key) pk ON ((((tables.table_schema)::text = (pk.table_schema)::text) AND ((tables.table_name)::text = (pk.table_name)::text))))
     LEFT JOIN ( SELECT c.table_schema,
            c.table_name,
            json_agg(c.constraint_name) AS constraints
           FROM information_schema.table_constraints c
          WHERE (((c.constraint_type)::text = 'UNIQUE'::text) OR ((c.constraint_type)::text = 'PRIMARY KEY'::text))
          GROUP BY c.table_schema, c.table_name) constraints ON ((((tables.table_schema)::text = (constraints.table_schema)::text) AND ((tables.table_name)::text = (constraints.table_name)::text))))
     LEFT JOIN ( SELECT v.table_schema,
            v.table_name,
            json_build_object('is_updatable', ((v.is_updatable)::boolean OR (v.is_trigger_updatable)::boolean), 'is_deletable', ((v.is_updatable)::boolean OR (v.is_trigger_deletable)::boolean), 'is_insertable', ((v.is_insertable_into)::boolean OR (v.is_trigger_insertable_into)::boolean)) AS view_info
           FROM information_schema.views v) views ON ((((tables.table_schema)::text = (views.table_schema)::text) AND ((tables.table_name)::text = (views.table_name)::text))));


ALTER TABLE hdb_catalog.hdb_table_info_agg OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 207 (class 1259 OID 8630907)
-- Name: hdb_unique_constraint; Type: VIEW; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE VIEW hdb_catalog.hdb_unique_constraint AS
 SELECT tc.table_name,
    tc.constraint_schema AS table_schema,
    tc.constraint_name,
    json_agg(kcu.column_name) AS columns
   FROM (information_schema.table_constraints tc
     JOIN information_schema.key_column_usage kcu USING (constraint_schema, constraint_name))
  WHERE ((tc.constraint_type)::text = 'UNIQUE'::text)
  GROUP BY tc.table_name, tc.constraint_schema, tc.constraint_name;


ALTER TABLE hdb_catalog.hdb_unique_constraint OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 199 (class 1259 OID 8630831)
-- Name: hdb_version; Type: TABLE; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE TABLE hdb_catalog.hdb_version (
    hasura_uuid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    version text NOT NULL,
    upgraded_on timestamp with time zone NOT NULL,
    cli_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    console_state jsonb DEFAULT '{}'::jsonb NOT NULL
);


ALTER TABLE hdb_catalog.hdb_version OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 215 (class 1259 OID 8630978)
-- Name: remote_schemas; Type: TABLE; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE TABLE hdb_catalog.remote_schemas (
    id bigint NOT NULL,
    name text,
    definition json,
    comment text
);


ALTER TABLE hdb_catalog.remote_schemas OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 214 (class 1259 OID 8630976)
-- Name: remote_schemas_id_seq; Type: SEQUENCE; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE SEQUENCE hdb_catalog.remote_schemas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE hdb_catalog.remote_schemas_id_seq OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 4111 (class 0 OID 0)
-- Dependencies: 214
-- Name: remote_schemas_id_seq; Type: SEQUENCE OWNED BY; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER SEQUENCE hdb_catalog.remote_schemas_id_seq OWNED BY hdb_catalog.remote_schemas.id;


--
-- TOC entry 223 (class 1259 OID 8634987)
-- Name: audit_events; Type: TABLE; Schema: public; Owner: ygrrlqaucoxunc
--

CREATE TABLE public.audit_events (
    id integer NOT NULL,
    stage text NOT NULL,
    level text NOT NULL,
    verb text NOT NULL,
    "requestURI" text NOT NULL,
    "apiVersion" text,
    kind text,
    "auditID" uuid,
    "sourceIPs" json,
    "userAgent" text,
    "stageTimestamp" timestamp with time zone,
    "requestReceivedTimestamp" timestamp with time zone,
    annotations jsonb,
    job_log_id integer NOT NULL
);


ALTER TABLE public.audit_events OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 222 (class 1259 OID 8634985)
-- Name: audit_events_id_seq; Type: SEQUENCE; Schema: public; Owner: ygrrlqaucoxunc
--

CREATE SEQUENCE public.audit_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.audit_events_id_seq OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 4112 (class 0 OID 0)
-- Dependencies: 222
-- Name: audit_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER SEQUENCE public.audit_events_id_seq OWNED BY public.audit_events.id;


--
-- TOC entry 229 (class 1259 OID 8827913)
-- Name: job_logs; Type: TABLE; Schema: public; Owner: ygrrlqaucoxunc
--

CREATE TABLE public.job_logs (
    version text NOT NULL,
    id integer NOT NULL,
    result text NOT NULL,
    passed text NOT NULL,
    job_version text NOT NULL,
    node_os_image text NOT NULL,
    infra_commit text NOT NULL,
    master_os_image text NOT NULL,
    pod text NOT NULL,
    revision text NOT NULL,
    "timestamp" integer NOT NULL
);


ALTER TABLE public.job_logs OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 228 (class 1259 OID 8827911)
-- Name: job_log_id_seq; Type: SEQUENCE; Schema: public; Owner: ygrrlqaucoxunc
--

CREATE SEQUENCE public.job_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.job_log_id_seq OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 4113 (class 0 OID 0)
-- Dependencies: 228
-- Name: job_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER SEQUENCE public.job_log_id_seq OWNED BY public.job_logs.id;


--
-- TOC entry 225 (class 1259 OID 8693088)
-- Name: object_refs; Type: TABLE; Schema: public; Owner: ygrrlqaucoxunc
--

CREATE TABLE public.object_refs (
    id integer NOT NULL,
    audit_event_id integer NOT NULL,
    resource text,
    namespace text,
    name text,
    "apiVersion" text,
    "apiGroup" text
);


ALTER TABLE public.object_refs OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 224 (class 1259 OID 8693086)
-- Name: object_refs_id_seq; Type: SEQUENCE; Schema: public; Owner: ygrrlqaucoxunc
--

CREATE SEQUENCE public.object_refs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.object_refs_id_seq OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 4114 (class 0 OID 0)
-- Dependencies: 224
-- Name: object_refs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER SEQUENCE public.object_refs_id_seq OWNED BY public.object_refs.id;


--
-- TOC entry 227 (class 1259 OID 8699287)
-- Name: response_statuses; Type: TABLE; Schema: public; Owner: ygrrlqaucoxunc
--

CREATE TABLE public.response_statuses (
    metadata json NOT NULL,
    status text,
    reason text,
    id integer NOT NULL,
    audit_event_id integer NOT NULL,
    code integer
);


ALTER TABLE public.response_statuses OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 226 (class 1259 OID 8699285)
-- Name: response_statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: ygrrlqaucoxunc
--

CREATE SEQUENCE public.response_statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.response_statuses_id_seq OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 4115 (class 0 OID 0)
-- Dependencies: 226
-- Name: response_statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER SEQUENCE public.response_statuses_id_seq OWNED BY public.response_statuses.id;


--
-- TOC entry 231 (class 1259 OID 8828049)
-- Name: users_info; Type: TABLE; Schema: public; Owner: ygrrlqaucoxunc
--

CREATE TABLE public.users_info (
    id integer NOT NULL,
    username text NOT NULL,
    groups json NOT NULL,
    audit_event_id integer NOT NULL
);


ALTER TABLE public.users_info OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 230 (class 1259 OID 8828047)
-- Name: user_info_id_seq; Type: SEQUENCE; Schema: public; Owner: ygrrlqaucoxunc
--

CREATE SEQUENCE public.user_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_info_id_seq OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 4116 (class 0 OID 0)
-- Dependencies: 230
-- Name: user_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER SEQUENCE public.user_info_id_seq OWNED BY public.users_info.id;


--
-- TOC entry 233 (class 1259 OID 8830521)
-- Name: z_fake_jobs; Type: TABLE; Schema: public; Owner: ygrrlqaucoxunc
--

CREATE TABLE public.z_fake_jobs (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    audit_event_id integer NOT NULL
);


ALTER TABLE public.z_fake_jobs OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 234 (class 1259 OID 8830549)
-- Name: view_cool_jobs; Type: VIEW; Schema: public; Owner: ygrrlqaucoxunc
--

CREATE VIEW public.view_cool_jobs AS
 SELECT z_fake_jobs.id,
    z_fake_jobs.name
   FROM public.z_fake_jobs
  WHERE (z_fake_jobs.name = 'cool'::text);


ALTER TABLE public.view_cool_jobs OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 232 (class 1259 OID 8828239)
-- Name: view_request_events; Type: VIEW; Schema: public; Owner: ygrrlqaucoxunc
--

CREATE VIEW public.view_request_events AS
 SELECT audit_events.id,
    audit_events.level
   FROM public.audit_events
  WHERE (audit_events.level = 'Request'::text);


ALTER TABLE public.view_request_events OWNER TO ygrrlqaucoxunc;

--
-- TOC entry 3905 (class 2604 OID 8630994)
-- Name: hdb_schema_update_event id; Type: DEFAULT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.hdb_schema_update_event ALTER COLUMN id SET DEFAULT nextval('hdb_catalog.hdb_schema_update_event_id_seq'::regclass);


--
-- TOC entry 3904 (class 2604 OID 8630981)
-- Name: remote_schemas id; Type: DEFAULT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.remote_schemas ALTER COLUMN id SET DEFAULT nextval('hdb_catalog.remote_schemas_id_seq'::regclass);


--
-- TOC entry 3908 (class 2604 OID 8634990)
-- Name: audit_events id; Type: DEFAULT; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY public.audit_events ALTER COLUMN id SET DEFAULT nextval('public.audit_events_id_seq'::regclass);


--
-- TOC entry 3911 (class 2604 OID 8827916)
-- Name: job_logs id; Type: DEFAULT; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY public.job_logs ALTER COLUMN id SET DEFAULT nextval('public.job_log_id_seq'::regclass);


--
-- TOC entry 3909 (class 2604 OID 8693091)
-- Name: object_refs id; Type: DEFAULT; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY public.object_refs ALTER COLUMN id SET DEFAULT nextval('public.object_refs_id_seq'::regclass);


--
-- TOC entry 3910 (class 2604 OID 8699290)
-- Name: response_statuses id; Type: DEFAULT; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY public.response_statuses ALTER COLUMN id SET DEFAULT nextval('public.response_statuses_id_seq'::regclass);


--
-- TOC entry 3912 (class 2604 OID 8828052)
-- Name: users_info id; Type: DEFAULT; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY public.users_info ALTER COLUMN id SET DEFAULT nextval('public.user_info_id_seq'::regclass);


--
-- TOC entry 3932 (class 2606 OID 8630955)
-- Name: event_invocation_logs event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.event_invocation_logs
    ADD CONSTRAINT event_invocation_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 3928 (class 2606 OID 8630944)
-- Name: event_log event_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.event_log
    ADD CONSTRAINT event_log_pkey PRIMARY KEY (id);


--
-- TOC entry 3926 (class 2606 OID 8630925)
-- Name: event_triggers event_triggers_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.event_triggers
    ADD CONSTRAINT event_triggers_pkey PRIMARY KEY (name);


--
-- TOC entry 3944 (class 2606 OID 8631027)
-- Name: hdb_allowlist hdb_allowlist_collection_name_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.hdb_allowlist
    ADD CONSTRAINT hdb_allowlist_collection_name_key UNIQUE (collection_name);


--
-- TOC entry 3934 (class 2606 OID 8630970)
-- Name: hdb_function hdb_function_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.hdb_function
    ADD CONSTRAINT hdb_function_pkey PRIMARY KEY (function_schema, function_name);


--
-- TOC entry 3922 (class 2606 OID 8630878)
-- Name: hdb_permission hdb_permission_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.hdb_permission
    ADD CONSTRAINT hdb_permission_pkey PRIMARY KEY (table_schema, table_name, role_name, perm_type);


--
-- TOC entry 3942 (class 2606 OID 8631019)
-- Name: hdb_query_collection hdb_query_collection_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.hdb_query_collection
    ADD CONSTRAINT hdb_query_collection_pkey PRIMARY KEY (collection_name);


--
-- TOC entry 3924 (class 2606 OID 8630896)
-- Name: hdb_query_template hdb_query_template_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.hdb_query_template
    ADD CONSTRAINT hdb_query_template_pkey PRIMARY KEY (template_name);


--
-- TOC entry 3920 (class 2606 OID 8630863)
-- Name: hdb_relationship hdb_relationship_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.hdb_relationship
    ADD CONSTRAINT hdb_relationship_pkey PRIMARY KEY (table_schema, table_name, rel_name);


--
-- TOC entry 3940 (class 2606 OID 8630997)
-- Name: hdb_schema_update_event hdb_schema_update_event_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.hdb_schema_update_event
    ADD CONSTRAINT hdb_schema_update_event_pkey PRIMARY KEY (id);


--
-- TOC entry 3918 (class 2606 OID 8630851)
-- Name: hdb_table hdb_table_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.hdb_table
    ADD CONSTRAINT hdb_table_pkey PRIMARY KEY (table_schema, table_name);


--
-- TOC entry 3916 (class 2606 OID 8630841)
-- Name: hdb_version hdb_version_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.hdb_version
    ADD CONSTRAINT hdb_version_pkey PRIMARY KEY (hasura_uuid);


--
-- TOC entry 3936 (class 2606 OID 8630988)
-- Name: remote_schemas remote_schemas_name_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.remote_schemas
    ADD CONSTRAINT remote_schemas_name_key UNIQUE (name);


--
-- TOC entry 3938 (class 2606 OID 8630986)
-- Name: remote_schemas remote_schemas_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.remote_schemas
    ADD CONSTRAINT remote_schemas_pkey PRIMARY KEY (id);


--
-- TOC entry 3946 (class 2606 OID 8641896)
-- Name: audit_events audit_events_auditID_key; Type: CONSTRAINT; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY public.audit_events
    ADD CONSTRAINT "audit_events_auditID_key" UNIQUE ("auditID");


--
-- TOC entry 3948 (class 2606 OID 8634995)
-- Name: audit_events audit_events_pkey; Type: CONSTRAINT; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY public.audit_events
    ADD CONSTRAINT audit_events_pkey PRIMARY KEY (id);


--
-- TOC entry 3958 (class 2606 OID 8830529)
-- Name: z_fake_jobs fake_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY public.z_fake_jobs
    ADD CONSTRAINT fake_jobs_pkey PRIMARY KEY (id);


--
-- TOC entry 3954 (class 2606 OID 8827921)
-- Name: job_logs job_log_pkey; Type: CONSTRAINT; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY public.job_logs
    ADD CONSTRAINT job_log_pkey PRIMARY KEY (id);


--
-- TOC entry 3950 (class 2606 OID 8693096)
-- Name: object_refs object_refs_pkey; Type: CONSTRAINT; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY public.object_refs
    ADD CONSTRAINT object_refs_pkey PRIMARY KEY (id);


--
-- TOC entry 3952 (class 2606 OID 8699295)
-- Name: response_statuses response_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY public.response_statuses
    ADD CONSTRAINT response_statuses_pkey PRIMARY KEY (id);


--
-- TOC entry 3956 (class 2606 OID 8828057)
-- Name: users_info user_info_pkey; Type: CONSTRAINT; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY public.users_info
    ADD CONSTRAINT user_info_pkey PRIMARY KEY (id);


--
-- TOC entry 3930 (class 1259 OID 8630961)
-- Name: event_invocation_logs_event_id_idx; Type: INDEX; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE INDEX event_invocation_logs_event_id_idx ON hdb_catalog.event_invocation_logs USING btree (event_id);


--
-- TOC entry 3929 (class 1259 OID 8630945)
-- Name: event_log_trigger_name_idx; Type: INDEX; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE INDEX event_log_trigger_name_idx ON hdb_catalog.event_log USING btree (trigger_name);


--
-- TOC entry 3914 (class 1259 OID 8630842)
-- Name: hdb_version_one_row; Type: INDEX; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE UNIQUE INDEX hdb_version_one_row ON hdb_catalog.hdb_version USING btree (((version IS NOT NULL)));


--
-- TOC entry 3970 (class 2620 OID 8630999)
-- Name: hdb_schema_update_event hdb_schema_update_event_notifier; Type: TRIGGER; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE TRIGGER hdb_schema_update_event_notifier AFTER INSERT ON hdb_catalog.hdb_schema_update_event FOR EACH ROW EXECUTE PROCEDURE hdb_catalog.hdb_schema_update_event_notifier();


--
-- TOC entry 3969 (class 2620 OID 8630853)
-- Name: hdb_table hdb_table_oid_check; Type: TRIGGER; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

CREATE TRIGGER hdb_table_oid_check BEFORE INSERT OR UPDATE ON hdb_catalog.hdb_table FOR EACH ROW EXECUTE PROCEDURE hdb_catalog.hdb_table_oid_check();


--
-- TOC entry 3962 (class 2606 OID 8630956)
-- Name: event_invocation_logs event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.event_invocation_logs
    ADD CONSTRAINT event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.event_log(id);


--
-- TOC entry 3961 (class 2606 OID 8630926)
-- Name: event_triggers event_triggers_schema_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.event_triggers
    ADD CONSTRAINT event_triggers_schema_name_fkey FOREIGN KEY (schema_name, table_name) REFERENCES hdb_catalog.hdb_table(table_schema, table_name) ON UPDATE CASCADE;


--
-- TOC entry 3963 (class 2606 OID 8631028)
-- Name: hdb_allowlist hdb_allowlist_collection_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.hdb_allowlist
    ADD CONSTRAINT hdb_allowlist_collection_name_fkey FOREIGN KEY (collection_name) REFERENCES hdb_catalog.hdb_query_collection(collection_name);


--
-- TOC entry 3960 (class 2606 OID 8630879)
-- Name: hdb_permission hdb_permission_table_schema_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.hdb_permission
    ADD CONSTRAINT hdb_permission_table_schema_fkey FOREIGN KEY (table_schema, table_name) REFERENCES hdb_catalog.hdb_table(table_schema, table_name) ON UPDATE CASCADE;


--
-- TOC entry 3959 (class 2606 OID 8630864)
-- Name: hdb_relationship hdb_relationship_table_schema_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY hdb_catalog.hdb_relationship
    ADD CONSTRAINT hdb_relationship_table_schema_fkey FOREIGN KEY (table_schema, table_name) REFERENCES hdb_catalog.hdb_table(table_schema, table_name) ON UPDATE CASCADE;


--
-- TOC entry 3964 (class 2606 OID 8827922)
-- Name: audit_events audit_events_job_log_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY public.audit_events
    ADD CONSTRAINT audit_events_job_log_id_fkey FOREIGN KEY (job_log_id) REFERENCES public.job_logs(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 3968 (class 2606 OID 8830530)
-- Name: z_fake_jobs fake_jobs_audit_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY public.z_fake_jobs
    ADD CONSTRAINT fake_jobs_audit_event_id_fkey FOREIGN KEY (audit_event_id) REFERENCES public.audit_events(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 3965 (class 2606 OID 8693097)
-- Name: object_refs object_refs_audit_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY public.object_refs
    ADD CONSTRAINT object_refs_audit_event_id_fkey FOREIGN KEY (audit_event_id) REFERENCES public.audit_events(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 3966 (class 2606 OID 8699296)
-- Name: response_statuses response_statuses_audit_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY public.response_statuses
    ADD CONSTRAINT response_statuses_audit_event_id_fkey FOREIGN KEY (audit_event_id) REFERENCES public.audit_events(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 3967 (class 2606 OID 8828058)
-- Name: users_info user_info_audit_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ygrrlqaucoxunc
--

ALTER TABLE ONLY public.users_info
    ADD CONSTRAINT user_info_audit_event_id_fkey FOREIGN KEY (audit_event_id) REFERENCES public.audit_events(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 4107 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: ygrrlqaucoxunc
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO ygrrlqaucoxunc;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- TOC entry 4108 (class 0 OID 0)
-- Dependencies: 779
-- Name: LANGUAGE plpgsql; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON LANGUAGE plpgsql TO ygrrlqaucoxunc;


-- Completed on 2019-07-15 11:13:01 NZST

--
-- PostgreSQL database dump complete
--

