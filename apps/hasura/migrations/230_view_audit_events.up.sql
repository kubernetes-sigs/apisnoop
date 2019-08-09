-- Initial View

CREATE OR REPLACE VIEW "public"."audit_events" AS
  SELECT (raw.data ->> 'auditID') as audit_id,
         raw.bucket,
         raw.job,
         raw.data ->> 'kind' as kind,
         raw.data -> 'user' as event_user,
         raw.data ->> 'verb' as event_verb,
         raw.data ->> 'level' as event_level,
         raw.data ->> 'stage' as event_stage,
         raw.data -> 'objectRef' as object_ref,
         raw.data -> 'sourceIPs' as source_ips,
         raw.data ->> 'userAgent' as useragent,
         raw.data ->> 'apiVersion' as api_version,
         raw.data ->> 'requestURI' as request_uri,
         raw.data -> 'annotations' as annotations,
         raw.data -> 'requestObject' as request_object,
         raw.data -> 'responseObject' as response_object,
         raw.data -> 'responseStatus' as response_status,
         raw.data ->> 'stageTimestamp' as stage_timestamp,
         raw.data ->> 'requestReceivedTimestamp' as request_received_timestamp,
         raw.data as data,
         ops.operation_id
  FROM raw_audit_events raw
  JOIN api_operations ops ON raw.data ->> 'requestURI' ~ ops.regex;
