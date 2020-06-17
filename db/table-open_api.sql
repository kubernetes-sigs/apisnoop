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
