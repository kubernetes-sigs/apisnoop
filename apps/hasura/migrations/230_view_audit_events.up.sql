-- Initial View

CREATE OR REPLACE VIEW "public"."audit_events" AS
  SELECT (raw.data ->> 'auditID') as audit_id,
         raw.bucket,
         raw.job,
         raw.data ->> 'level' as event_level,
         raw.data ->> 'stage' as event_stage,
         ops.operation_id,
         raw.data ->> 'verb' as event_verb,
         raw.data ->> 'apiVersion' as api_version,
         raw.data ->> 'requestURI' as request_uri,
         -- Always "Event"
         -- raw.data ->> 'kind' as kind,
         raw.data ->> 'userAgent' as useragent,
         raw.data -> 'user' as event_user,
         raw.data -> 'objectRef' ->> 'name' as object_name,
         raw.data -> 'objectRef' ->> 'namespace' as object_namespace,
         raw.data -> 'objectRef' ->> 'resource' as event_resource,
         raw.data -> 'objectRef' ->> 'apiVersion' as object_api_version,
         raw.data -> 'objectRef' as object_ref,
         raw.data -> 'sourceIPs' as source_ips,
         raw.data -> 'annotations' as annotations,
         raw.data -> 'requestObject' as request_object,
         raw.data -> 'responseObject' as response_object,
         raw.data -> 'responseStatus' as response_status,
         raw.data ->> 'stageTimestamp' as stage_timestamp,
         raw.data ->> 'requestReceivedTimestamp' as request_received_timestamp,
         raw.data as data
  FROM raw_audit_events raw
  JOIN api_operations ops ON
       -- of done in order, this should limit our regex to < 5 targets to compare
    -- raw.data ->> 'requestURI' ~ ops.regex;
       raw.data ->> 'verb'       = ops.k8s_action
   AND raw.data ->> 'requestURI' ~ ops.regex;
