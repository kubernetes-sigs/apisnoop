     create table open_api
       (
         release text,
         release_date timestamp,
         endpoint text,
         level text,
         category text,
         path text,
         k8s_group text,
         k8s_version text,
         k8s_kind text,
         k8s_action text,
         deprecated boolean,
         description text,
         spec text,
         primary key (release, endpoint)
       );

     comment on table open_api is 'endpoint details from openAPI spec';
     comment on column open_api.release is 'kubernetes release of this spec';
     comment on column open_api.release_date is 'canonical release date for k8s release';
     comment on column open_api.endpoint is 'kubernetes endpoint, the operation_id in the spec';
     comment on column open_api.level is 'alpha, beta, or stable';
     comment on column open_api.category is 'endpoint category, roughly its group, taken from the first tag in the spec.';
     comment on column open_api.path is 'the http path of the endpoint';
     comment on column open_api.k8s_group is 'k8s group for endpoint';
     comment on column open_api.k8s_version is 'k8s version for endpoint';
     comment on column open_api.k8s_kind  is 'k8s kind  for endpoint';
     comment on column open_api.k8s_action is 'endpoint action, roughly related to an http method';
     comment on column open_api.deprecated is 'is endpoint marked as deprecated?';
     comment on column open_api.description is 'description of endpoint';
     comment on column open_api.spec is 'the source for this open api spec, taken from github.';
