- [10 Conformance Tests hitting PodSpec.serviceAccount](#sec-1)
- [18 Audit Log Entries for Conformance Test operations specifically hitting PodSpec.serviceAccount](#sec-2)


# 10 Conformance Tests hitting PodSpec.serviceAccount<a id="sec-1"></a>

We noticed this in the summary for podspec<sub>field</sub><sub>coverage</sub>.

```sql-mode
select distinct test
from podspec_field_coverage
where podspec_field = 'serviceAccount'
and test like '%Conformance%';
```

# 18 Audit Log Entries for Conformance Test operations specifically hitting PodSpec.serviceAccount<a id="sec-2"></a>

We wanted to see exactly which conformance test + operations were specifically trying to set PodSpec.serviceAccount

```sql-mode
select
    operation_id,
    split_part(audit_event.useragent, '--', 2) as test,
    CASE
    WHEN request_object->'spec'->'template'->'spec'->'serviceAccount' is not null
    THEN request_object->'spec'->'template'->'spec'->'serviceAccount'
    WHEN request_object->'template'->'spec'->'serviceAccount' is not null
    THEN request_object->'template'->'spec'->'serviceAccount'
    WHEN request_object->'spec'->'serviceAccount' is not null
    THEN request_object->'spec'->'serviceAccount'
    ELSE null
    END as service_account,
    CASE
    WHEN request_object->'spec'->'template'->'spec'->'serviceAccountName' is not null
    THEN request_object->'spec'->'template'->'spec'->'serviceAccountName'
    WHEN request_object->'template'->'spec'->'serviceAccountName' is not null
    THEN request_object->'template'->'spec'->'serviceAccountName'
    WHEN request_object->'spec'->'serviceAccountName' is not null
    THEN request_object->'spec'->'serviceAccountName'
    ELSE null
    END as service_account_name

-- select count(*) from audit_event
-- select count(*) from audit_event
from audit_event
where useragent like 'e2e%Conformance%'
and (request_object->'spec'->'template'->'spec'->'serviceAccount' is not null
or request_object->'template'->'spec'->'serviceAccount' is not null
or request_object->'spec'->'serviceAccount' is not null)
order by operation_id;
```
