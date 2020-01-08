CREATE OR REPLACE VIEW "public"."audit_event" AS
  SELECT (raw.data ->> 'auditID') as audit_id,
         raw.bucket,
         raw.job,
         raw.data ->> 'level' as event_level,
         raw.data ->> 'stage' as event_stage,
         raw.operation_id,
         aop.param_schema,
         raw.data ->> 'verb' as event_verb,
         raw.data ->> 'apiVersion' as api_version,
         raw.data ->> 'requestURI' as request_uri,
         -- Always "Event"
         -- raw.data ->> 'kind' as kind,
         raw.data ->> 'userAgent' as useragent,
         raw.data -> 'user' as event_user,
         raw.data #>> '{objectRef,namespace}' as object_namespace,
         raw.data #>> '{objectRef,resource}' as object_type,
         raw.data #>> '{objectRef,apiGroup}' as object_group,
         raw.data #>> '{objectRef,apiVersion}' as object_ver,
         raw.data -> 'sourceIPs' as source_ips,
         raw.data -> 'annotations' as annotations,
         raw.data -> 'requestObject' as request_object,
         raw.data -> 'responseObject' as response_object,
         raw.data -> 'responseStatus' as response_status,
         raw.data ->> 'stageTimestamp' as stage_timestamp,
         raw.data ->> 'requestReceivedTimestamp' as request_received_timestamp,
         raw.data as data
    FROM raw_audit_event raw
           LEFT JOIN (
             select param_op, param_schema
               from api_operation_parameter_material
              WHERE param_name = 'body'
           ) aop
               ON (raw.operation_id = aop.param_op);
