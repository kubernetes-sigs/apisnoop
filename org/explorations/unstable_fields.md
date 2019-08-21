- [calculating fields](#sec-1)
  - [required => checks field exist in required section of schema](#sec-1-1)
  - [deprecated => description containing 'deprecated' cases insensitive](#sec-1-2)
  - [release => a very specific description search => alpha, beta, or ga](#sec-1-3)
  - [feature<sub>gated</sub> => a very specific description search => boolean](#sec-1-4)
- [alpha/beta, deprecated and feature<sub>gated</sub> fields](#sec-2)


# calculating fields<a id="sec-1"></a>

## required => checks field exist in required section of schema<a id="sec-1-1"></a>

## deprecated => description containing 'deprecated' cases insensitive<a id="sec-1-2"></a>

## release => a very specific description search => alpha, beta, or ga<a id="sec-1-3"></a>

See <https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md#alpha-field-in-existing-api-version>

```sql-mode
CASE
WHEN (   description ilike '%This field is alpha-level%'
      or description ilike '%This is an alpha field%'
      or description ilike '%This is an alpha feature%') THEN 'alpha'
WHEN (   description ilike '%This field is beta-level%'
      or description ilike '%This field is beta%'
      or description ilike '%This is a beta feature%'
      or description ilike '%This is an beta feature%'
      or description ilike '%This is an beta field%') THEN 'beta'
ELSE 'ga'
END AS release,
```

## feature<sub>gated</sub> => a very specific description search => boolean<a id="sec-1-4"></a>

```sql-mode
CASE
WHEN (   description ilike '%requires the % feature gate to be enabled%'
      or description ilike '%depends on the % feature gate being enabled%'
      or description ilike '%requires the % feature flag to be enabled%'
      or description ilike '%honored if the API server enables the % feature gate%'
      or description ilike '%honored by servers that enable the % feature%'
      or description ilike '%requires enabling % feature gate%'
      or description ilike '%honored by clusters that enables the % feature%'
      or description ilike '%only if the % feature gate is enabled%'
) THEN true
ELSE false
             END AS feature_gated,
```

# alpha/beta, deprecated and feature<sub>gated</sub> fields<a id="sec-2"></a>

```sql-mode
select  release as rel, required as req, deprecated as depr, feature_gated as feat, field_schema, field_name, field_kind
from api_schema_field
where release = 'alpha' or release = 'beta' or deprecated or feature_gated
order by release, depr, feat, length(field_schema), field_schema, field_name;
```
