- [OpenAPI Schema Objects](#sec-1)
  - [V2](#sec-1-1)
  - [Release status of Fields/Properties](#sec-1-2)
  - [Feature Gated Fields/Properties](#sec-1-3)
  - [Deprecated Objects/Schemas](#sec-1-4)
  - [Deprecated Fields/Properties](#sec-1-5)
  - [Required Fields/Properties](#sec-1-6)
  - [Mutable Fields/Properties](#sec-1-7)


# OpenAPI Schema Objects<a id="sec-1"></a>

## V2<a id="sec-1-1"></a>

-   **schemaObject.[parameterObject](https://swagger.io/specification/v2/#parameterObject).<sup>x</sup>-:** 

-   **schemaObject.[parameterObject](https://swagger.io/specification/v2/#parameterObject).<sup>x</sup>-k8s-deprecated:** boolean - specifies that a parametr

## Release status of Fields/Properties<a id="sec-1-2"></a>

APISnoop generates \`api<sub>schema</sub><sub>field.release</sub>\` by searching for the following 8 matches to set a boolean. This would likely better be set as as string via \`x-k8s-feature-gate\` or similar.

This could probably be applied to operations and parameters as well.

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

## Feature Gated Fields/Properties<a id="sec-1-3"></a>

Finding Feature Gated Fields was a bit of a pain, there were 8 possible combinations that seem to conculsively match them all. We currently store this

APISnoop generates \`api<sub>schema</sub><sub>field.feature</sub><sub>gated</sub>\` by searching for the following 8 matches to set a boolean. This would likely better be set as as string via \`x-k8s-feature-gate\` or similar.

This could probably be applied to operations and parameters as well.

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

## Deprecated Objects/Schemas<a id="sec-1-4"></a>

APISnoop calculates \`api<sub>schema.deprecated</sub>\` by simply case insensitively searching \`api<sub>schema.description</sub>\` 'deprecated':

```sql-mode
SELECT (lower((d.value ->> 'description'::text)) ~~ '%deprecated%'::text) AS deprecated,
  FROM api_swagger, jsonb_each((api_swagger.data -> 'paths'::text)) paths(key, value)
```

In v3 we can use deprecated, but can we look into generating \`x-k8s-deprecated: true\` until then?

-   **[OpenAPIv2.schemaObject](https://swagger.io/specification/v2/#schemaObject).object.<sup>x</sup>-k8r-deprecated:** boolean specifies that this schema is deprecated&#x2026;
-   **[OpenAPIv3.schemaObject](https://swagger.io/specification/v2/#schemaObject).deprecated:** boolean Specifies that a schema is deprecated and SHOULD be transitioned out of usage. Default value is false.

## Deprecated Fields/Properties<a id="sec-1-5"></a>

Note the distinction in deprecated field/property VS object/schema above.

```sql-mode
SELECT WHEN  d.value->>'description' ilike '%deprecated%' THEN true
         ELSE false
         END AS deprecated,
    FROM (api_schema
          JOIN LATERAL jsonb_each(api_schema.properties) d(key, value) ON (true));
```

In v3 we can use deprecated, but can we look into generating \`x-k8s-deprecated: true\` until then?

-   **[OpenAPIv2.schemaObject.parameterObject](https://swagger.io/specification/v2/#parameterObject).<sup>x</sup>-k8s-deprecated:** boolean - specifies that this parameter is deprecated
-   **[OpenAPIv3.schemaObject.parameterObject](https://swagger.io/specification/#parameterObject).deprecated:** boolean : Specifies that a parameter is deprecated and SHOULD be transitioned out of usage. Default value is false.

## Required Fields/Properties<a id="sec-1-6"></a>

APISnoop currently generated \`api<sub>schema</sub><sub>field.required</sub>\` by looking for \`api<sub>schema</sub><sub>field.name</sub>\` in the \`api<sub>schema.required</sub>\` array. Both V2 and V3 have a \`required\` field which may be a bit more clear.

```sql-mode
-- within our api_schema pulling from each .definition
ARRAY(SELECT jsonb_array_elements_text(d.value -> 'required')) as required_fields
-- within our api_schema_field checking for the field name in the array above
WHEN d.key = ANY(api_schema.required_fields) THEN true
  ELSE false
  END AS required,
```

Would it be better to store this directly in the object itself?

-   **[OpenAPIv2.schemaObject.parameterObject](https://swagger.io/specification/v2/#parameterObject).required:** boolean :
-   **[OpenAPIv3.schemaObject.parameterObject](https://swagger.io/specification/#parameterObject).required:** boolean :

## Mutable Fields/Properties<a id="sec-1-7"></a>

These look like they should only apply to fields, but either way we don't currently have method to enumerate immutable fields.

-   **[OpenAPIv2.schemaObject](https://swagger.io/specification/v2/#schemaObject).readOnly:** boolean
-   **[OpenAPIv3.schemaObject](https://swagger.io/specification/v2/#schemaObject).readOnly:** boolean
-   **[OpenAPIv3.schemaObject](https://swagger.io/specification/v2/#schemaObject).writeOnly:** boolean
