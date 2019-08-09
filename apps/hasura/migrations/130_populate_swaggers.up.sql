

-- #+NAME: reload swaggers for particluar releases

delete from raw_swaggers;
select * from load_swagger_via_curl('master');
-- select * from load_swagger_via_curl('release-1.15');
-- select * from load_swagger_via_curl('release-1.14');
-- select * from load_swagger_via_curl('release-1.13');
-- select * from load_swagger_via_curl('release-1.12');
-- select * from load_swagger_via_curl('release-1.11');
-- select * from load_swagger_via_curl('release-1.10');
