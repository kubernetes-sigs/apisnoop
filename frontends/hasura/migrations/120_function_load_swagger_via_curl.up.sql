

-- #+NAME: load_swagger_via_curl.sql

set role dba;
CREATE OR REPLACE FUNCTION load_swagger_via_curl(branch_or_tag text)
RETURNS text AS $$
# should probably sanitize branch_or_tag
try:
    from string import Template
    sql = Template("copy raw_swaggers (data) FROM PROGRAM '$curl' (DELIMITER e'\x02', FORMAT 'csv', QUOTE e'\x01');").substitute(
        curl =  f'curl https://raw.githubusercontent.com/kubernetes/kubernetes/{branch_or_tag}/api/openapi-spec/swagger.json | jq -c .'
    )
    rv = plpy.execute(sql)
    return "it worked"
except:
    return "something went wrong"
$$ LANGUAGE plpython3u ;
reset role;
