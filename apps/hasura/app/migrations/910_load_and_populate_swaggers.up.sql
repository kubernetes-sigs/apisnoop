select * from load_swagger();
--populate the apisnoop/live bucket/job to help when writing test functions
select * from load_swagger(null, null, true);
