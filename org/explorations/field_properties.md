- [Suggested OpenAPI Schema Object Field/Property updates](#sec-1)
  - [Release status](#sec-1-1)
  - [Feature Gated](#sec-1-2)
  - [Required](#sec-1-3)
  - [Deprecated](#sec-1-4)
  - [Mutable](#sec-1-5)
- [Manual Field Calculation](#sec-2)
- [69 gated, deprecated, or non-ga fields](#sec-3)
- [12 NonDeprecated GA fields behind FeatureGates](#sec-4)
- [606 required of 2797 total fields](#sec-5)
  - [2797 total field](#sec-5-1)
  - [606 required fields](#sec-5-2)


# Suggested OpenAPI Schema Object Field/Property updates<a id="sec-1"></a>

In our work to measure and increase the tested surface area of Kubernetes, we required knowing the more information about each field.

This led to us calculating a few fields that would probably be better served by inclusion in our OpenAPI schema.

## Release status<a id="sec-1-1"></a>

This could probably be applied to operations and parameters as well.

APISnoop generates \`api-schema-field.release\` by searching for for 8 variations of alpha/beta within the description to set this as 'alpha', 'beta', or 'ga'.

This would likely better be set as as string via \`x-k8s-field-release\` or similar.

## Feature Gated<a id="sec-1-2"></a>

APISnoop generates \`api-schema-field.feature-gated\` by searching for 8 variation of 'feature gate' to set a boolean. This would likely better be set as as string via \`x-k8s-field-feature-gate\` or similar.

This could probably be applied to operations and parameters as well.

## Required<a id="sec-1-3"></a>

APISnoop currently generated \`api<sub>schema</sub><sub>field.required</sub>\` by looking for \`api<sub>schema</sub><sub>field.name</sub>\` in the \`api<sub>schema.required</sub>\` array.

Both V2 and V3 have a \`required\` field which may be a bit more clear.

Would it be better to store this directly in the object itself?

-   **[OpenAPIv2.schemaObject.parameterObject](https://swagger.io/specification/v2/#parameterObject).required:** boolean :
-   **[OpenAPIv3.schemaObject.parameterObject](https://swagger.io/specification/#parameterObject).required:** boolean :

## Deprecated<a id="sec-1-4"></a>

Note the distinction in deprecated field/property VS object/schema.

In v3 we can use deprecated, but should we look into generating \`x-k8s-field-deprecated: true\` until then?

-   **[OpenAPIv2.schemaObject.parameterObject](https://swagger.io/specification/v2/#parameterObject).<sup>x</sup>-k8s-field-deprecated:** boolean - specifies that this parameter is deprecated
-   **[OpenAPIv3.schemaObject.parameterObject](https://swagger.io/specification/#parameterObject).deprecated:** boolean : Specifies that a parameter is deprecated and SHOULD be transitioned out of usage. Default value is false.

## Mutable<a id="sec-1-5"></a>

These look like they should only apply to fields, but either way we don't currently have method to enumerate immutable fields.

-   **[OpenAPIv2.schemaObject](https://swagger.io/specification/v2/#schemaObject).readOnly:** boolean
-   **[OpenAPIv3.schemaObject](https://swagger.io/specification/v2/#schemaObject).readOnly:** boolean
-   **[OpenAPIv3.schemaObject](https://swagger.io/specification/v2/#schemaObject).writeOnly:** boolean

# Manual Field Calculation<a id="sec-2"></a>

-   **release:** 'alpha', 'beta', or 'ga' - via a very specific description search

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

-   **feature-gated:** boolean - via a very specific description search

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

-   **required:** <span class="underline">boolean</span> : checks field exist in required section of schema

```sql-mode
-- within our api_schema pulling from each .definition
ARRAY(SELECT jsonb_array_elements_text(d.value -> 'required')) as required_fields
-- within our api_schema_field checking for the field name in the array above
CASE
WHEN d.key = ANY(api_schema.required_fields) THEN true
ELSE false
END AS required,
```

-   **deprecated:** <span class="underline">boolean</span> : property description containing 'deprecated' cases insensitive

```sql-mode
CASE
WHEN d.value->>'description' ilike '%deprecated%' THEN true
ELSE false
END AS deprecated,
```

# 69 gated, deprecated, or non-ga fields<a id="sec-3"></a>

This should be the full inclusive list.

```sql-mode
select
  release as rel,
  required as req,
  deprecated as depr,
  feature_gated as feat,
  ( field_schema || ' / ' || field_name ) as field_path
  -- field_name,
  -- field_kind
  from api_schema_field
 where
 release = 'alpha'
 or release = 'beta'
 or deprecated
 or feature_gated
 order by release, depr, feat,
          length(field_schema),
          field_schema, field_name;
```

```sql-mode
  rel  | req | depr | feat |                                                        field_path                                                        
-------|-----|------|------|--------------------------------------------------------------------------------------------------------------------------
 alpha | f   | f    | f    | io.k8s.api.storage.v1.VolumeAttachmentSource / inlineVolumeSpec
 alpha | f   | f    | f    | io.k8s.api.storage.v1beta1.VolumeAttachmentSource / inlineVolumeSpec
 alpha | f   | f    | f    | io.k8s.api.storage.v1alpha1.VolumeAttachmentSource / inlineVolumeSpec
 alpha | f   | f    | t    | io.k8s.api.core.v1.PodSpec / ephemeralContainers
 alpha | f   | f    | t    | io.k8s.api.core.v1.PodSpec / overhead
 alpha | f   | f    | t    | io.k8s.api.core.v1.PodSpec / preemptionPolicy
 alpha | f   | f    | t    | io.k8s.api.core.v1.PodSpec / topologySpreadConstraints
 alpha | f   | f    | t    | io.k8s.api.batch.v1.JobSpec / ttlSecondsAfterFinished
 alpha | f   | f    | t    | io.k8s.api.core.v1.PodStatus / ephemeralContainerStatuses
 alpha | f   | f    | t    | io.k8s.api.node.v1beta1.RuntimeClass / overhead
 alpha | f   | f    | t    | io.k8s.api.scheduling.v1.PriorityClass / preemptionPolicy
 alpha | f   | f    | t    | io.k8s.api.node.v1alpha1.RuntimeClassSpec / overhead
 alpha | f   | f    | t    | io.k8s.api.scheduling.v1beta1.PriorityClass / preemptionPolicy
 alpha | f   | f    | t    | io.k8s.api.core.v1.CSIPersistentVolumeSource / controllerExpandSecretRef
 alpha | f   | f    | t    | io.k8s.api.scheduling.v1alpha1.PriorityClass / preemptionPolicy
 alpha | f   | f    | t    | io.k8s.api.policy.v1beta1.PodSecurityPolicySpec / allowedCSIDrivers
 alpha | f   | f    | t    | io.k8s.api.core.v1.WindowsSecurityContextOptions / gmsaCredentialSpec
 alpha | f   | f    | t    | io.k8s.api.core.v1.WindowsSecurityContextOptions / gmsaCredentialSpecName
 alpha | f   | f    | t    | io.k8s.api.core.v1.WindowsSecurityContextOptions / runAsUserName
 alpha | f   | f    | t    | io.k8s.apimachinery.pkg.apis.meta.v1.APIResource / storageVersionHash
 alpha | f   | f    | t    | io.k8s.api.extensions.v1beta1.PodSecurityPolicySpec / allowedCSIDrivers
 alpha | f   | f    | t    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceConversion / webhookClientConfig
 alpha | f   | f    | t    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceDefinitionVersion / additionalPrinterColumns
 alpha | f   | f    | t    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceDefinitionVersion / schema
 alpha | f   | f    | t    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceDefinitionVersion / subresources
 beta  | f   | f    | f    | io.k8s.api.core.v1.PodSpec / runtimeClassName
 beta  | f   | f    | f    | io.k8s.api.core.v1.PodSpec / shareProcessNamespace
 beta  | f   | f    | f    | io.k8s.api.core.v1.Container / volumeDevices
 beta  | f   | f    | f    | io.k8s.api.core.v1.VolumeMount / mountPropagation
 beta  | f   | f    | f    | io.k8s.api.core.v1.VolumeMount / subPathExpr
 beta  | f   | f    | f    | io.k8s.api.core.v1.EphemeralContainer / volumeDevices
 beta  | f   | f    | f    | io.k8s.api.core.v1.PersistentVolumeSpec / volumeMode
 beta  | f   | f    | f    | io.k8s.api.networking.v1.NetworkPolicySpec / egress
 beta  | f   | f    | f    | io.k8s.api.networking.v1.NetworkPolicySpec / policyTypes
 beta  | f   | f    | f    | io.k8s.api.core.v1.PersistentVolumeClaimSpec / volumeMode
 beta  | f   | f    | f    | io.k8s.api.extensions.v1beta1.NetworkPolicySpec / egress
 beta  | f   | f    | f    | io.k8s.api.extensions.v1beta1.NetworkPolicySpec / policyTypes
 ga    | f   | f    | t    | io.k8s.api.core.v1.SecurityContext / procMount
 ga    | f   | f    | t    | io.k8s.api.storage.v1.StorageClass / allowedTopologies
 ga    | f   | f    | t    | io.k8s.api.storage.v1.StorageClass / volumeBindingMode
 ga    | f   | f    | t    | io.k8s.api.storage.v1beta1.StorageClass / allowedTopologies
 ga    | f   | f    | t    | io.k8s.api.storage.v1beta1.StorageClass / volumeBindingMode
 ga    | f   | f    | t    | io.k8s.api.core.v1.PersistentVolumeClaimSpec / dataSource
 ga    | f   | f    | t    | io.k8s.api.policy.v1beta1.PodSecurityPolicySpec / allowedProcMountTypes
 ga    | f   | f    | t    | io.k8s.api.policy.v1beta1.PodSecurityPolicySpec / runAsGroup
 ga    | f   | f    | t    | io.k8s.api.policy.v1beta1.PodSecurityPolicySpec / runtimeClass
 ga    | f   | f    | t    | io.k8s.api.extensions.v1beta1.PodSecurityPolicySpec / allowedProcMountTypes
 ga    | f   | f    | t    | io.k8s.api.extensions.v1beta1.PodSecurityPolicySpec / runAsGroup
 ga    | f   | f    | t    | io.k8s.api.extensions.v1beta1.PodSecurityPolicySpec / runtimeClass
 ga    | f   | t    | f    | io.k8s.api.core.v1.Volume / gitRepo
 ga    | f   | t    | f    | io.k8s.api.core.v1.PodSpec / serviceAccount
 ga    | f   | t    | f    | io.k8s.api.core.v1.NodeSpec / externalID
 ga    | f   | t    | f    | io.k8s.api.core.v1.NodeStatus / phase
 ga    | f   | t    | f    | io.k8s.api.core.v1.EventSeries / state
 ga    | f   | t    | f    | io.k8s.api.events.v1beta1.Event / deprecatedCount
 ga    | f   | t    | f    | io.k8s.api.events.v1beta1.Event / deprecatedFirstTimestamp
 ga    | f   | t    | f    | io.k8s.api.events.v1beta1.Event / deprecatedLastTimestamp
 ga    | f   | t    | f    | io.k8s.api.events.v1beta1.Event / deprecatedSource
 ga    | t   | t    | f    | io.k8s.api.events.v1beta1.EventSeries / state
 ga    | f   | t    | f    | io.k8s.api.apps.v1beta1.DeploymentSpec / rollbackTo
 ga    | f   | t    | f    | io.k8s.api.core.v1.FlockerVolumeSource / datasetName
 ga    | f   | t    | f    | io.k8s.api.core.v1.PersistentVolumeSpec / persistentVolumeReclaimPolicy
 ga    | f   | t    | f    | io.k8s.api.extensions.v1beta1.DaemonSetSpec / templateGeneration
 ga    | f   | t    | f    | io.k8s.api.extensions.v1beta1.DeploymentSpec / rollbackTo
 ga    | f   | t    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.ListMeta / selfLink
 ga    | f   | t    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta / selfLink
 ga    | f   | t    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.DeleteOptions / orphanDependents
 ga    | f   | t    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionSpec / preserveUnknownFields
 ga    | f   | t    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceDefinitionSpec / version
(69 rows)

```

# 12 NonDeprecated GA fields behind FeatureGates<a id="sec-4"></a>

This should be the full inclusive list.

```sql-mode
select
  release as rel,
  required as req,
  deprecated as depr,
  feature_gated as feat,
  ( field_schema || ' / ' || field_name ) as field_path
  -- field_name,
  -- field_kind
  from api_schema_field
 where
 release != 'alpha'
 and release != 'beta'
 and not deprecated
 and feature_gated
 order by release, depr, feat,
          length(field_schema),
          field_schema, field_name;
```

```sql-mode
 rel | req | depr | feat |                                 field_path                                  
-----|-----|------|------|-----------------------------------------------------------------------------
 ga  | f   | f    | t    | io.k8s.api.core.v1.SecurityContext / procMount
 ga  | f   | f    | t    | io.k8s.api.storage.v1.StorageClass / allowedTopologies
 ga  | f   | f    | t    | io.k8s.api.storage.v1.StorageClass / volumeBindingMode
 ga  | f   | f    | t    | io.k8s.api.storage.v1beta1.StorageClass / allowedTopologies
 ga  | f   | f    | t    | io.k8s.api.storage.v1beta1.StorageClass / volumeBindingMode
 ga  | f   | f    | t    | io.k8s.api.core.v1.PersistentVolumeClaimSpec / dataSource
 ga  | f   | f    | t    | io.k8s.api.policy.v1beta1.PodSecurityPolicySpec / allowedProcMountTypes
 ga  | f   | f    | t    | io.k8s.api.policy.v1beta1.PodSecurityPolicySpec / runAsGroup
 ga  | f   | f    | t    | io.k8s.api.policy.v1beta1.PodSecurityPolicySpec / runtimeClass
 ga  | f   | f    | t    | io.k8s.api.extensions.v1beta1.PodSecurityPolicySpec / allowedProcMountTypes
 ga  | f   | f    | t    | io.k8s.api.extensions.v1beta1.PodSecurityPolicySpec / runAsGroup
 ga  | f   | f    | t    | io.k8s.api.extensions.v1beta1.PodSecurityPolicySpec / runtimeClass
(12 rows)

```

# 606 required of 2797 total fields<a id="sec-5"></a>

This should be the full inclusive list.

## 2797 total field<a id="sec-5-1"></a>

```sql-mode
select count(*) from api_schema_field;
```

```sql-mode
 count 
-------
  2797
(1 row)

```

## 606 required fields<a id="sec-5-2"></a>

```sql-mode
select
  release as rel,
  required as req,
  deprecated as depr,
  feature_gated as feat,
  ( field_schema || ' / ' || field_name ) as field_path
  -- field_name,
  -- field_kind
  from api_schema_field
 where required
 order by release, depr, feat,
          length(field_schema),
          field_schema, field_name;
```

```sql-mode
 rel | req | depr | feat |                                                    field_path                                                     
-----|-----|------|------|-------------------------------------------------------------------------------------------------------------------
 ga  | t   | f    | f    | io.k8s.api.core.v1.Event / involvedObject
 ga  | t   | f    | f    | io.k8s.api.core.v1.Event / metadata
 ga  | t   | f    | f    | io.k8s.api.core.v1.Taint / effect
 ga  | t   | f    | f    | io.k8s.api.core.v1.Taint / key
 ga  | t   | f    | f    | io.k8s.api.core.v1.EnvVar / name
 ga  | t   | f    | f    | io.k8s.api.core.v1.Sysctl / name
 ga  | t   | f    | f    | io.k8s.api.core.v1.Sysctl / value
 ga  | t   | f    | f    | io.k8s.api.core.v1.Volume / name
 ga  | t   | f    | f    | io.k8s.api.core.v1.Binding / target
 ga  | t   | f    | f    | io.k8s.api.core.v1.PodList / items
 ga  | t   | f    | f    | io.k8s.api.core.v1.PodSpec / containers
 ga  | t   | f    | f    | io.k8s.api.rbac.v1.RoleRef / apiGroup
 ga  | t   | f    | f    | io.k8s.api.rbac.v1.RoleRef / kind
 ga  | t   | f    | f    | io.k8s.api.rbac.v1.RoleRef / name
 ga  | t   | f    | f    | io.k8s.api.rbac.v1.Subject / kind
 ga  | t   | f    | f    | io.k8s.api.rbac.v1.Subject / name
 ga  | t   | f    | f    | io.k8s.api.batch.v1.JobList / items
 ga  | t   | f    | f    | io.k8s.api.batch.v1.JobSpec / template
 ga  | t   | f    | f    | io.k8s.api.core.v1.NodeList / items
 ga  | t   | f    | f    | io.k8s.api.rbac.v1.RoleList / items
 ga  | t   | f    | f    | io.k8s.api.core.v1.Container / name
 ga  | t   | f    | f    | io.k8s.api.core.v1.EventList / items
 ga  | t   | f    | f    | io.k8s.api.core.v1.KeyToPath / key
 ga  | t   | f    | f    | io.k8s.api.core.v1.KeyToPath / path
 ga  | t   | f    | f    | io.k8s.api.core.v1.HTTPHeader / name
 ga  | t   | f    | f    | io.k8s.api.core.v1.HTTPHeader / value
 ga  | t   | f    | f    | io.k8s.api.core.v1.SecretList / items
 ga  | t   | f    | f    | io.k8s.api.rbac.v1.PolicyRule / verbs
 ga  | t   | f    | f    | io.k8s.api.core.v1.NodeAddress / address
 ga  | t   | f    | f    | io.k8s.api.core.v1.NodeAddress / type
 ga  | t   | f    | f    | io.k8s.api.core.v1.ServiceList / items
 ga  | t   | f    | f    | io.k8s.api.core.v1.ServicePort / port
 ga  | t   | f    | f    | io.k8s.api.core.v1.VolumeMount / mountPath
 ga  | t   | f    | f    | io.k8s.api.core.v1.VolumeMount / name
 ga  | t   | f    | f    | io.k8s.api.rbac.v1.RoleBinding / roleRef
 ga  | t   | f    | f    | io.k8s.api.core.v1.EndpointPort / port
 ga  | t   | f    | f    | io.k8s.api.core.v1.NodeSelector / nodeSelectorTerms
 ga  | t   | f    | f    | io.k8s.api.core.v1.PodCondition / status
 ga  | t   | f    | f    | io.k8s.api.core.v1.PodCondition / type
 ga  | t   | f    | f    | io.k8s.api.core.v1.VolumeDevice / devicePath
 ga  | t   | f    | f    | io.k8s.api.core.v1.VolumeDevice / name
 ga  | t   | f    | f    | io.k8s.api.events.v1beta1.Event / eventTime
 ga  | t   | f    | f    | io.k8s.api.rbac.v1beta1.RoleRef / apiGroup
 ga  | t   | f    | f    | io.k8s.api.rbac.v1beta1.RoleRef / kind
 ga  | t   | f    | f    | io.k8s.api.rbac.v1beta1.RoleRef / name
 ga  | t   | f    | f    | io.k8s.api.rbac.v1beta1.Subject / kind
 ga  | t   | f    | f    | io.k8s.api.rbac.v1beta1.Subject / name
 ga  | t   | f    | f    | io.k8s.api.apps.v1.DaemonSetList / items
 ga  | t   | f    | f    | io.k8s.api.apps.v1.DaemonSetSpec / selector
 ga  | t   | f    | f    | io.k8s.api.apps.v1.DaemonSetSpec / template
 ga  | t   | f    | f    | io.k8s.api.batch.v1.JobCondition / status
 ga  | t   | f    | f    | io.k8s.api.batch.v1.JobCondition / type
 ga  | t   | f    | f    | io.k8s.api.core.v1.ConfigMapList / items
 ga  | t   | f    | f    | io.k8s.api.core.v1.ContainerPort / containerPort
 ga  | t   | f    | f    | io.k8s.api.core.v1.EndpointsList / items
 ga  | t   | f    | f    | io.k8s.api.core.v1.HTTPGetAction / port
 ga  | t   | f    | f    | io.k8s.api.core.v1.NamespaceList / items
 ga  | t   | f    | f    | io.k8s.api.core.v1.NodeCondition / status
 ga  | t   | f    | f    | io.k8s.api.core.v1.NodeCondition / type
 ga  | t   | f    | f    | io.k8s.api.networking.v1.IPBlock / cidr
 ga  | t   | f    | f    | io.k8s.api.rbac.v1alpha1.RoleRef / apiGroup
 ga  | t   | f    | f    | io.k8s.api.rbac.v1alpha1.RoleRef / kind
 ga  | t   | f    | f    | io.k8s.api.rbac.v1alpha1.RoleRef / name
 ga  | t   | f    | f    | io.k8s.api.rbac.v1alpha1.Subject / kind
 ga  | t   | f    | f    | io.k8s.api.rbac.v1alpha1.Subject / name
 ga  | t   | f    | f    | io.k8s.api.rbac.v1beta1.RoleList / items
 ga  | t   | f    | f    | io.k8s.api.apps.v1.DeploymentList / items
 ga  | t   | f    | f    | io.k8s.api.apps.v1.DeploymentSpec / selector
 ga  | t   | f    | f    | io.k8s.api.apps.v1.DeploymentSpec / template
 ga  | t   | f    | f    | io.k8s.api.apps.v1.ReplicaSetList / items
 ga  | t   | f    | f    | io.k8s.api.apps.v1.ReplicaSetSpec / selector
 ga  | t   | f    | f    | io.k8s.api.core.v1.AttachedVolume / devicePath
 ga  | t   | f    | f    | io.k8s.api.core.v1.AttachedVolume / name
 ga  | t   | f    | f    | io.k8s.api.core.v1.ContainerImage / names
 ga  | t   | f    | f    | io.k8s.api.core.v1.DaemonEndpoint / Port
 ga  | t   | f    | f    | io.k8s.api.core.v1.LimitRangeList / items
 ga  | t   | f    | f    | io.k8s.api.core.v1.LimitRangeSpec / limits
 ga  | t   | f    | f    | io.k8s.api.core.v1.NodeSystemInfo / architecture
 ga  | t   | f    | f    | io.k8s.api.core.v1.NodeSystemInfo / bootID
 ga  | t   | f    | f    | io.k8s.api.core.v1.NodeSystemInfo / containerRuntimeVersion
 ga  | t   | f    | f    | io.k8s.api.core.v1.NodeSystemInfo / kernelVersion
 ga  | t   | f    | f    | io.k8s.api.core.v1.NodeSystemInfo / kubeletVersion
 ga  | t   | f    | f    | io.k8s.api.core.v1.NodeSystemInfo / kubeProxyVersion
 ga  | t   | f    | f    | io.k8s.api.core.v1.NodeSystemInfo / machineID
 ga  | t   | f    | f    | io.k8s.api.core.v1.NodeSystemInfo / operatingSystem
 ga  | t   | f    | f    | io.k8s.api.core.v1.NodeSystemInfo / osImage
 ga  | t   | f    | f    | io.k8s.api.core.v1.NodeSystemInfo / systemUUID
 ga  | t   | f    | f    | io.k8s.api.policy.v1beta1.IDRange / max
 ga  | t   | f    | f    | io.k8s.api.policy.v1beta1.IDRange / min
 ga  | t   | f    | f    | io.k8s.api.rbac.v1alpha1.RoleList / items
 ga  | t   | f    | f    | io.k8s.api.apps.v1.DaemonSetStatus / currentNumberScheduled
 ga  | t   | f    | f    | io.k8s.api.apps.v1.DaemonSetStatus / desiredNumberScheduled
 ga  | t   | f    | f    | io.k8s.api.apps.v1.DaemonSetStatus / numberMisscheduled
 ga  | t   | f    | f    | io.k8s.api.apps.v1.DaemonSetStatus / numberReady
 ga  | t   | f    | f    | io.k8s.api.apps.v1.StatefulSetList / items
 ga  | t   | f    | f    | io.k8s.api.apps.v1.StatefulSetSpec / selector
 ga  | t   | f    | f    | io.k8s.api.apps.v1.StatefulSetSpec / serviceName
 ga  | t   | f    | f    | io.k8s.api.apps.v1.StatefulSetSpec / template
 ga  | t   | f    | f    | io.k8s.api.core.v1.ContainerStatus / image
 ga  | t   | f    | f    | io.k8s.api.core.v1.ContainerStatus / imageID
 ga  | t   | f    | f    | io.k8s.api.core.v1.ContainerStatus / name
 ga  | t   | f    | f    | io.k8s.api.core.v1.ContainerStatus / ready
 ga  | t   | f    | f    | io.k8s.api.core.v1.ContainerStatus / restartCount
 ga  | t   | f    | f    | io.k8s.api.core.v1.CSIVolumeSource / driver
 ga  | t   | f    | f    | io.k8s.api.core.v1.EndpointAddress / ip
 ga  | t   | f    | f    | io.k8s.api.core.v1.NFSVolumeSource / path
 ga  | t   | f    | f    | io.k8s.api.core.v1.NFSVolumeSource / server
 ga  | t   | f    | f    | io.k8s.api.core.v1.PodAffinityTerm / topologyKey
 ga  | t   | f    | f    | io.k8s.api.core.v1.PodTemplateList / items
 ga  | t   | f    | f    | io.k8s.api.core.v1.RBDVolumeSource / image
 ga  | t   | f    | f    | io.k8s.api.core.v1.RBDVolumeSource / monitors
 ga  | t   | f    | f    | io.k8s.api.core.v1.TCPSocketAction / port
 ga  | t   | f    | f    | io.k8s.api.rbac.v1beta1.PolicyRule / verbs
 ga  | t   | f    | f    | io.k8s.api.rbac.v1.ClusterRoleList / items
 ga  | t   | f    | f    | io.k8s.api.rbac.v1.RoleBindingList / items
 ga  | t   | f    | f    | io.k8s.api.storage.v1beta1.CSINode / spec
 ga  | t   | f    | f    | io.k8s.api.storage.v1.StorageClass / provisioner
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta1.ScaleStatus / replicas
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.ScaleStatus / replicas
 ga  | t   | f    | f    | io.k8s.api.apps.v1.ReplicaSetStatus / replicas
 ga  | t   | f    | f    | io.k8s.api.core.v1.FlexVolumeSource / driver
 ga  | t   | f    | f    | io.k8s.api.core.v1.PodReadinessGate / conditionType
 ga  | t   | f    | f    | io.k8s.api.events.v1beta1.EventList / items
 ga  | t   | f    | f    | io.k8s.api.rbac.v1alpha1.PolicyRule / verbs
 ga  | t   | f    | f    | io.k8s.api.rbac.v1beta1.RoleBinding / roleRef
 ga  | t   | f    | f    | io.k8s.api.apps.v1.StatefulSetStatus / replicas
 ga  | t   | f    | f    | io.k8s.api.batch.v1beta1.CronJobList / items
 ga  | t   | f    | f    | io.k8s.api.batch.v1beta1.CronJobSpec / jobTemplate
 ga  | t   | f    | f    | io.k8s.api.batch.v1beta1.CronJobSpec / schedule
 ga  | t   | f    | f    | io.k8s.api.coordination.v1.LeaseList / items
 ga  | t   | f    | f    | io.k8s.api.core.v1.ISCSIVolumeSource / iqn
 ga  | t   | f    | f    | io.k8s.api.core.v1.ISCSIVolumeSource / lun
 ga  | t   | f    | f    | io.k8s.api.core.v1.ISCSIVolumeSource / targetPortal
 ga  | t   | f    | f    | io.k8s.api.core.v1.LocalVolumeSource / path
 ga  | t   | f    | f    | io.k8s.api.core.v1.ResourceQuotaList / items
 ga  | t   | f    | f    | io.k8s.api.core.v1.SecretKeySelector / key
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.version.Info / buildDate
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.version.Info / compiler
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.version.Info / gitCommit
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.version.Info / gitTreeState
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.version.Info / gitVersion
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.version.Info / goVersion
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.version.Info / major
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.version.Info / minor
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.version.Info / platform
 ga  | t   | f    | f    | io.k8s.api.node.v1beta1.RuntimeClass / handler
 ga  | t   | f    | f    | io.k8s.api.rbac.v1alpha1.RoleBinding / roleRef
 ga  | t   | f    | f    | io.k8s.api.storage.v1beta1.CSIDriver / spec
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.DaemonSetList / items
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.DaemonSetSpec / selector
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.DaemonSetSpec / template
 ga  | t   | f    | f    | io.k8s.api.apps.v1.ControllerRevision / revision
 ga  | t   | f    | f    | io.k8s.api.apps.v1.DaemonSetCondition / status
 ga  | t   | f    | f    | io.k8s.api.apps.v1.DaemonSetCondition / type
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v1.ScaleStatus / replicas
 ga  | t   | f    | f    | io.k8s.api.batch.v2alpha1.CronJobList / items
 ga  | t   | f    | f    | io.k8s.api.batch.v2alpha1.CronJobSpec / jobTemplate
 ga  | t   | f    | f    | io.k8s.api.batch.v2alpha1.CronJobSpec / schedule
 ga  | t   | f    | f    | io.k8s.api.core.v1.CephFSVolumeSource / monitors
 ga  | t   | f    | f    | io.k8s.api.core.v1.CinderVolumeSource / volumeID
 ga  | t   | f    | f    | io.k8s.api.core.v1.ComponentCondition / status
 ga  | t   | f    | f    | io.k8s.api.core.v1.ComponentCondition / type
 ga  | t   | f    | f    | io.k8s.api.core.v1.EphemeralContainer / name
 ga  | t   | f    | f    | io.k8s.api.core.v1.ServiceAccountList / items
 ga  | t   | f    | f    | io.k8s.api.events.v1beta1.EventSeries / count
 ga  | t   | f    | f    | io.k8s.api.events.v1beta1.EventSeries / lastObservedTime
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.IDRange / max
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.IDRange / min
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.IPBlock / cidr
 ga  | t   | f    | f    | io.k8s.api.node.v1alpha1.RuntimeClass / spec
 ga  | t   | f    | f    | io.k8s.api.rbac.v1.ClusterRoleBinding / roleRef
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta1.DeploymentList / items
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta1.DeploymentSpec / template
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.DeploymentList / items
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.DeploymentSpec / selector
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.DeploymentSpec / template
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.ReplicaSetList / items
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.ReplicaSetSpec / selector
 ga  | t   | f    | f    | io.k8s.api.apps.v1.DeploymentCondition / status
 ga  | t   | f    | f    | io.k8s.api.apps.v1.DeploymentCondition / type
 ga  | t   | f    | f    | io.k8s.api.apps.v1.ReplicaSetCondition / status
 ga  | t   | f    | f    | io.k8s.api.apps.v1.ReplicaSetCondition / type
 ga  | t   | f    | f    | io.k8s.api.core.v1.ComponentStatusList / items
 ga  | t   | f    | f    | io.k8s.api.core.v1.GitRepoVolumeSource / repository
 ga  | t   | f    | f    | io.k8s.api.core.v1.ObjectFieldSelector / fieldPath
 ga  | t   | f    | f    | io.k8s.api.core.v1.QuobyteVolumeSource / registry
 ga  | t   | f    | f    | io.k8s.api.core.v1.QuobyteVolumeSource / volume
 ga  | t   | f    | f    | io.k8s.api.core.v1.ScaleIOVolumeSource / gateway
 ga  | t   | f    | f    | io.k8s.api.core.v1.ScaleIOVolumeSource / secretRef
 ga  | t   | f    | f    | io.k8s.api.core.v1.ScaleIOVolumeSource / system
 ga  | t   | f    | f    | io.k8s.api.scheduling.v1.PriorityClass / value
 ga  | t   | f    | f    | io.k8s.api.storage.v1beta1.CSINodeList / items
 ga  | t   | f    | f    | io.k8s.api.storage.v1beta1.CSINodeSpec / drivers
 ga  | t   | f    | f    | io.k8s.api.storage.v1.StorageClassList / items
 ga  | t   | f    | f    | io.k8s.api.storage.v1.VolumeAttachment / spec
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta1.StatefulSetList / items
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta1.StatefulSetSpec / serviceName
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta1.StatefulSetSpec / template
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.DaemonSetStatus / currentNumberScheduled
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.DaemonSetStatus / desiredNumberScheduled
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.DaemonSetStatus / numberMisscheduled
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.DaemonSetStatus / numberReady
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.StatefulSetList / items
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.StatefulSetSpec / selector
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.StatefulSetSpec / serviceName
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.StatefulSetSpec / template
 ga  | t   | f    | f    | io.k8s.api.apps.v1.StatefulSetCondition / status
 ga  | t   | f    | f    | io.k8s.api.apps.v1.StatefulSetCondition / type
 ga  | t   | f    | f    | io.k8s.api.core.v1.ConfigMapKeySelector / key
 ga  | t   | f    | f    | io.k8s.api.core.v1.HostPathVolumeSource / path
 ga  | t   | f    | f    | io.k8s.api.core.v1.PersistentVolumeList / items
 ga  | t   | f    | f    | io.k8s.api.core.v1.PortworxVolumeSource / volumeID
 ga  | t   | f    | f    | io.k8s.api.policy.v1beta1.HostPortRange / max
 ga  | t   | f    | f    | io.k8s.api.policy.v1beta1.HostPortRange / min
 ga  | t   | f    | f    | io.k8s.api.rbac.v1beta1.ClusterRoleList / items
 ga  | t   | f    | f    | io.k8s.api.rbac.v1beta1.RoleBindingList / items
 ga  | t   | f    | f    | io.k8s.api.storage.v1beta1.StorageClass / provisioner
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.ReplicaSetStatus / replicas
 ga  | t   | f    | f    | io.k8s.api.authentication.v1.TokenReview / spec
 ga  | t   | f    | f    | io.k8s.api.authorization.v1.ResourceRule / verbs
 ga  | t   | f    | f    | io.k8s.api.core.v1.AzureDiskVolumeSource / diskName
 ga  | t   | f    | f    | io.k8s.api.core.v1.AzureDiskVolumeSource / diskURI
 ga  | t   | f    | f    | io.k8s.api.core.v1.AzureFileVolumeSource / secretName
 ga  | t   | f    | f    | io.k8s.api.core.v1.AzureFileVolumeSource / shareName
 ga  | t   | f    | f    | io.k8s.api.core.v1.DownwardAPIVolumeFile / path
 ga  | t   | f    | f    | io.k8s.api.core.v1.GlusterfsVolumeSource / endpoints
 ga  | t   | f    | f    | io.k8s.api.core.v1.GlusterfsVolumeSource / path
 ga  | t   | f    | f    | io.k8s.api.core.v1.ProjectedVolumeSource / sources
 ga  | t   | f    | f    | io.k8s.api.core.v1.ResourceFieldSelector / resource
 ga  | t   | f    | f    | io.k8s.api.node.v1beta1.RuntimeClassList / items
 ga  | t   | f    | f    | io.k8s.api.rbac.v1alpha1.ClusterRoleList / items
 ga  | t   | f    | f    | io.k8s.api.rbac.v1alpha1.RoleBindingList / items
 ga  | t   | f    | f    | io.k8s.api.storage.v1beta1.CSIDriverList / items
 ga  | t   | f    | f    | io.k8s.api.storage.v1beta1.CSINodeDriver / name
 ga  | t   | f    | f    | io.k8s.api.storage.v1beta1.CSINodeDriver / nodeID
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta1.StatefulSetStatus / replicas
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.StatefulSetStatus / replicas
 ga  | t   | f    | f    | io.k8s.api.apps.v1.ControllerRevisionList / items
 ga  | t   | f    | f    | io.k8s.api.authentication.v1.TokenRequest / spec
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.MetricSpec / type
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.MetricSpec / type
 ga  | t   | f    | f    | io.k8s.api.coordination.v1beta1.LeaseList / items
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.IngressList / items
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.ScaleStatus / replicas
 ga  | t   | f    | f    | io.k8s.api.networking.v1beta1.IngressList / items
 ga  | t   | f    | f    | io.k8s.api.node.v1alpha1.RuntimeClassList / items
 ga  | t   | f    | f    | io.k8s.api.node.v1alpha1.RuntimeClassSpec / runtimeHandler
 ga  | t   | f    | f    | io.k8s.api.rbac.v1.ClusterRoleBindingList / items
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta1.ControllerRevision / revision
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta1.DeploymentRollback / name
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta1.DeploymentRollback / rollbackTo
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.ControllerRevision / revision
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.DaemonSetCondition / status
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.DaemonSetCondition / type
 ga  | t   | f    | f    | io.k8s.api.core.v1.NodeSelectorRequirement / key
 ga  | t   | f    | f    | io.k8s.api.core.v1.NodeSelectorRequirement / operator
 ga  | t   | f    | f    | io.k8s.api.core.v1.PreferredSchedulingTerm / preference
 ga  | t   | f    | f    | io.k8s.api.core.v1.PreferredSchedulingTerm / weight
 ga  | t   | f    | f    | io.k8s.api.core.v1.WeightedPodAffinityTerm / podAffinityTerm
 ga  | t   | f    | f    | io.k8s.api.core.v1.WeightedPodAffinityTerm / weight
 ga  | t   | f    | f    | io.k8s.api.networking.v1.NetworkPolicyList / items
 ga  | t   | f    | f    | io.k8s.api.networking.v1.NetworkPolicySpec / podSelector
 ga  | t   | f    | f    | io.k8s.api.policy.v1beta1.AllowedCSIDriver / name
 ga  | t   | f    | f    | io.k8s.api.rbac.v1beta1.ClusterRoleBinding / roleRef
 ga  | t   | f    | f    | io.k8s.api.scheduling.v1.PriorityClassList / items
 ga  | t   | f    | f    | io.k8s.api.settings.v1alpha1.PodPresetList / items
 ga  | t   | f    | f    | io.k8s.api.storage.v1.VolumeAttachmentList / items
 ga  | t   | f    | f    | io.k8s.api.storage.v1.VolumeAttachmentSpec / attacher
 ga  | t   | f    | f    | io.k8s.api.storage.v1.VolumeAttachmentSpec / nodeName
 ga  | t   | f    | f    | io.k8s.api.storage.v1.VolumeAttachmentSpec / source
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta1.DeploymentCondition / status
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta1.DeploymentCondition / type
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.DeploymentCondition / status
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.DeploymentCondition / type
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.ReplicaSetCondition / status
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.ReplicaSetCondition / type
 ga  | t   | f    | f    | io.k8s.api.authorization.v1.NonResourceRule / verbs
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.MetricStatus / type
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.MetricStatus / type
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.MetricTarget / type
 ga  | t   | f    | f    | io.k8s.api.core.v1.ContainerStateTerminated / exitCode
 ga  | t   | f    | f    | io.k8s.api.core.v1.TopologySpreadConstraint / maxSkew
 ga  | t   | f    | f    | io.k8s.api.core.v1.TopologySpreadConstraint / topologyKey
 ga  | t   | f    | f    | io.k8s.api.core.v1.TopologySpreadConstraint / whenUnsatisfiable
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.DaemonSetList / items
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.DaemonSetSpec / template
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.HostPortRange / max
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.HostPortRange / min
 ga  | t   | f    | f    | io.k8s.api.policy.v1beta1.AllowedFlexVolume / driver
 ga  | t   | f    | f    | io.k8s.api.rbac.v1alpha1.ClusterRoleBinding / roleRef
 ga  | t   | f    | f    | io.k8s.api.scheduling.v1beta1.PriorityClass / value
 ga  | t   | f    | f    | io.k8s.api.storage.v1beta1.StorageClassList / items
 ga  | t   | f    | f    | io.k8s.api.storage.v1beta1.VolumeAttachment / spec
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta1.StatefulSetCondition / status
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta1.StatefulSetCondition / type
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.StatefulSetCondition / status
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.StatefulSetCondition / type
 ga  | t   | f    | f    | io.k8s.api.auditregistration.v1alpha1.Policy / level
 ga  | t   | f    | f    | io.k8s.api.core.v1.ConfigMapNodeConfigSource / kubeletConfigKey
 ga  | t   | f    | f    | io.k8s.api.core.v1.ConfigMapNodeConfigSource / name
 ga  | t   | f    | f    | io.k8s.api.core.v1.ConfigMapNodeConfigSource / namespace
 ga  | t   | f    | f    | io.k8s.api.core.v1.CSIPersistentVolumeSource / driver
 ga  | t   | f    | f    | io.k8s.api.core.v1.CSIPersistentVolumeSource / volumeHandle
 ga  | t   | f    | f    | io.k8s.api.core.v1.PersistentVolumeClaimList / items
 ga  | t   | f    | f    | io.k8s.api.core.v1.RBDPersistentVolumeSource / image
 ga  | t   | f    | f    | io.k8s.api.core.v1.RBDPersistentVolumeSource / monitors
 ga  | t   | f    | f    | io.k8s.api.core.v1.ReplicationControllerList / items
 ga  | t   | f    | f    | io.k8s.api.core.v1.TypedLocalObjectReference / kind
 ga  | t   | f    | f    | io.k8s.api.core.v1.TypedLocalObjectReference / name
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.DeploymentList / items
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.DeploymentSpec / template
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.IngressBackend / serviceName
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.IngressBackend / servicePort
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.ReplicaSetList / items
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.runtime.RawExtension / Raw
 ga  | t   | f    | f    | io.k8s.api.networking.v1beta1.IngressBackend / serviceName
 ga  | t   | f    | f    | io.k8s.api.networking.v1beta1.IngressBackend / servicePort
 ga  | t   | f    | f    | io.k8s.api.scheduling.v1alpha1.PriorityClass / value
 ga  | t   | f    | f    | io.k8s.api.storage.v1alpha1.VolumeAttachment / spec
 ga  | t   | f    | f    | io.k8s.api.storage.v1.VolumeAttachmentStatus / attached
 ga  | t   | f    | f    | io.k8s.api.auditregistration.v1alpha1.Webhook / clientConfig
 ga  | t   | f    | f    | io.k8s.api.authentication.v1beta1.TokenReview / spec
 ga  | t   | f    | f    | io.k8s.api.authentication.v1.TokenRequestSpec / audiences
 ga  | t   | f    | f    | io.k8s.api.authorization.v1beta1.ResourceRule / verbs
 ga  | t   | f    | f    | io.k8s.api.core.v1.FlexPersistentVolumeSource / driver
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.DaemonSetStatus / currentNumberScheduled
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.DaemonSetStatus / desiredNumberScheduled
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.DaemonSetStatus / numberMisscheduled
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.DaemonSetStatus / numberReady
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.HTTPIngressPath / backend
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.APIGroup / name
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.APIGroup / versions
 ga  | t   | f    | f    | io.k8s.api.networking.v1beta1.HTTPIngressPath / backend
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta1.ControllerRevisionList / items
 ga  | t   | f    | f    | io.k8s.api.apps.v1beta2.ControllerRevisionList / items
 ga  | t   | f    | f    | io.k8s.api.core.v1.ISCSIPersistentVolumeSource / iqn
 ga  | t   | f    | f    | io.k8s.api.core.v1.ISCSIPersistentVolumeSource / lun
 ga  | t   | f    | f    | io.k8s.api.core.v1.ISCSIPersistentVolumeSource / targetPortal
 ga  | t   | f    | f    | io.k8s.api.core.v1.ReplicationControllerStatus / replicas
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.AllowedCSIDriver / name
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.ReplicaSetStatus / replicas
 ga  | t   | f    | f    | io.k8s.api.rbac.v1beta1.ClusterRoleBindingList / items
 ga  | t   | f    | f    | io.k8s.api.authentication.v1.TokenRequestStatus / expirationTimestamp
 ga  | t   | f    | f    | io.k8s.api.authentication.v1.TokenRequestStatus / token
 ga  | t   | f    | f    | io.k8s.api.authorization.v1.SubjectAccessReview / spec
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.PodsMetricSource / metricName
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.PodsMetricSource / targetAverageValue
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.PodsMetricStatus / currentAverageValue
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.PodsMetricStatus / metricName
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.MetricIdentifier / name
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.PodsMetricSource / metric
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.PodsMetricSource / target
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.PodsMetricStatus / current
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.PodsMetricStatus / metric
 ga  | t   | f    | f    | io.k8s.api.core.v1.CephFSPersistentVolumeSource / monitors
 ga  | t   | f    | f    | io.k8s.api.core.v1.CinderPersistentVolumeSource / volumeID
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.AllowedFlexVolume / driver
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.NetworkPolicyList / items
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.NetworkPolicySpec / podSelector
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.WatchEvent / object
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.WatchEvent / type
 ga  | t   | f    | f    | io.k8s.api.policy.v1beta1.PodSecurityPolicyList / items
 ga  | t   | f    | f    | io.k8s.api.policy.v1beta1.PodSecurityPolicySpec / fsGroup
 ga  | t   | f    | f    | io.k8s.api.policy.v1beta1.PodSecurityPolicySpec / runAsUser
 ga  | t   | f    | f    | io.k8s.api.policy.v1beta1.PodSecurityPolicySpec / seLinux
 ga  | t   | f    | f    | io.k8s.api.policy.v1beta1.PodSecurityPolicySpec / supplementalGroups
 ga  | t   | f    | f    | io.k8s.api.rbac.v1alpha1.ClusterRoleBindingList / items
 ga  | t   | f    | f    | io.k8s.api.scheduling.v1beta1.PriorityClassList / items
 ga  | t   | f    | f    | io.k8s.api.storage.v1beta1.VolumeAttachmentList / items
 ga  | t   | f    | f    | io.k8s.api.storage.v1beta1.VolumeAttachmentSpec / attacher
 ga  | t   | f    | f    | io.k8s.api.storage.v1beta1.VolumeAttachmentSpec / nodeName
 ga  | t   | f    | f    | io.k8s.api.storage.v1beta1.VolumeAttachmentSpec / source
 ga  | t   | f    | f    | io.k8s.api.authorization.v1beta1.NonResourceRule / verbs
 ga  | t   | f    | f    | io.k8s.api.core.v1.GCEPersistentDiskVolumeSource / pdName
 ga  | t   | f    | f    | io.k8s.api.core.v1.ScaleIOPersistentVolumeSource / gateway
 ga  | t   | f    | f    | io.k8s.api.core.v1.ScaleIOPersistentVolumeSource / secretRef
 ga  | t   | f    | f    | io.k8s.api.core.v1.ScaleIOPersistentVolumeSource / system
 ga  | t   | f    | f    | io.k8s.api.core.v1.ServiceAccountTokenProjection / path
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.DaemonSetCondition / status
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.DaemonSetCondition / type
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.DeploymentRollback / name
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.DeploymentRollback / rollbackTo
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.APIResource / kind
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.APIResource / name
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.APIResource / namespaced
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.APIResource / singularName
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.APIResource / verbs
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.APIVersions / serverAddressByClientCIDRs
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.APIVersions / versions
 ga  | t   | f    | f    | io.k8s.api.policy.v1beta1.SELinuxStrategyOptions / rule
 ga  | t   | f    | f    | io.k8s.api.scheduling.v1alpha1.PriorityClassList / items
 ga  | t   | f    | f    | io.k8s.api.storage.v1alpha1.VolumeAttachmentList / items
 ga  | t   | f    | f    | io.k8s.api.storage.v1alpha1.VolumeAttachmentSpec / attacher
 ga  | t   | f    | f    | io.k8s.api.storage.v1alpha1.VolumeAttachmentSpec / nodeName
 ga  | t   | f    | f    | io.k8s.api.storage.v1alpha1.VolumeAttachmentSpec / source
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.ObjectMetricSource / metricName
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.ObjectMetricSource / target
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.ObjectMetricSource / targetValue
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.ObjectMetricStatus / currentValue
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.ObjectMetricStatus / metricName
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.ObjectMetricStatus / target
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.ObjectMetricSource / describedObject
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.ObjectMetricSource / metric
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.ObjectMetricSource / target
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.ObjectMetricStatus / current
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.ObjectMetricStatus / describedObject
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.ObjectMetricStatus / metric
 ga  | t   | f    | f    | io.k8s.api.core.v1.PersistentVolumeClaimCondition / status
 ga  | t   | f    | f    | io.k8s.api.core.v1.PersistentVolumeClaimCondition / type
 ga  | t   | f    | f    | io.k8s.api.core.v1.ReplicationControllerCondition / status
 ga  | t   | f    | f    | io.k8s.api.core.v1.ReplicationControllerCondition / type
 ga  | t   | f    | f    | io.k8s.api.core.v1.VsphereVirtualDiskVolumeSource / volumePath
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.DeploymentCondition / status
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.DeploymentCondition / type
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.ReplicaSetCondition / status
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.ReplicaSetCondition / type
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.APIGroupList / groups
 ga  | t   | f    | f    | io.k8s.api.policy.v1beta1.PodDisruptionBudgetList / items
 ga  | t   | f    | f    | io.k8s.api.storage.v1beta1.VolumeAttachmentStatus / attached
 ga  | t   | f    | f    | io.k8s.api.authorization.v1.SelfSubjectRulesReview / spec
 ga  | t   | f    | f    | io.k8s.api.core.v1.AzureFilePersistentVolumeSource / secretName
 ga  | t   | f    | f    | io.k8s.api.core.v1.AzureFilePersistentVolumeSource / shareName
 ga  | t   | f    | f    | io.k8s.api.core.v1.GlusterfsPersistentVolumeSource / endpoints
 ga  | t   | f    | f    | io.k8s.api.core.v1.GlusterfsPersistentVolumeSource / path
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.HTTPIngressRuleValue / paths
 ga  | t   | f    | f    | io.k8s.api.networking.v1beta1.HTTPIngressRuleValue / paths
 ga  | t   | f    | f    | io.k8s.api.policy.v1beta1.RunAsUserStrategyOptions / rule
 ga  | t   | f    | f    | io.k8s.api.storage.v1alpha1.VolumeAttachmentStatus / attached
 ga  | t   | f    | f    | io.k8s.api.admissionregistration.v1.MutatingWebhook / admissionReviewVersions
 ga  | t   | f    | f    | io.k8s.api.admissionregistration.v1.MutatingWebhook / clientConfig
 ga  | t   | f    | f    | io.k8s.api.admissionregistration.v1.MutatingWebhook / name
 ga  | t   | f    | f    | io.k8s.api.admissionregistration.v1.MutatingWebhook / sideEffects
 ga  | t   | f    | f    | io.k8s.api.auditregistration.v1alpha1.AuditSinkList / items
 ga  | t   | f    | f    | io.k8s.api.auditregistration.v1alpha1.AuditSinkSpec / policy
 ga  | t   | f    | f    | io.k8s.api.auditregistration.v1alpha1.AuditSinkSpec / webhook
 ga  | t   | f    | f    | io.k8s.api.authorization.v1.SelfSubjectAccessReview / spec
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.ExternalMetricSource / metricName
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.ExternalMetricStatus / currentValue
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.ExternalMetricStatus / metricName
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.ResourceMetricSource / name
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.ResourceMetricStatus / currentAverageValue
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.ResourceMetricStatus / name
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.ExternalMetricSource / metric
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.ExternalMetricSource / target
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.ExternalMetricStatus / current
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.ExternalMetricStatus / metric
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.ResourceMetricSource / name
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.ResourceMetricSource / target
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.ResourceMetricStatus / current
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.ResourceMetricStatus / name
 ga  | t   | f    | f    | io.k8s.api.core.v1.AWSElasticBlockStoreVolumeSource / volumeID
 ga  | t   | f    | f    | io.k8s.api.core.v1.PhotonPersistentDiskVolumeSource / pdID
 ga  | t   | f    | f    | io.k8s.api.core.v1.TopologySelectorLabelRequirement / key
 ga  | t   | f    | f    | io.k8s.api.core.v1.TopologySelectorLabelRequirement / values
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.PodSecurityPolicyList / items
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.PodSecurityPolicySpec / fsGroup
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.PodSecurityPolicySpec / runAsUser
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.PodSecurityPolicySpec / seLinux
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.PodSecurityPolicySpec / supplementalGroups
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.OwnerReference / apiVersion
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.OwnerReference / kind
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.OwnerReference / name
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.OwnerReference / uid
 ga  | t   | f    | f    | io.k8s.api.policy.v1beta1.PodDisruptionBudgetStatus / currentHealthy
 ga  | t   | f    | f    | io.k8s.api.policy.v1beta1.PodDisruptionBudgetStatus / desiredHealthy
 ga  | t   | f    | f    | io.k8s.api.policy.v1beta1.PodDisruptionBudgetStatus / disruptionsAllowed
 ga  | t   | f    | f    | io.k8s.api.policy.v1beta1.PodDisruptionBudgetStatus / expectedPods
 ga  | t   | f    | f    | io.k8s.api.policy.v1beta1.RunAsGroupStrategyOptions / rule
 ga  | t   | f    | f    | io.k8s.api.admissionregistration.v1.ServiceReference / name
 ga  | t   | f    | f    | io.k8s.api.admissionregistration.v1.ServiceReference / namespace
 ga  | t   | f    | f    | io.k8s.api.authorization.v1beta1.SubjectAccessReview / spec
 ga  | t   | f    | f    | io.k8s.api.authorization.v1.LocalSubjectAccessReview / spec
 ga  | t   | f    | f    | io.k8s.api.authorization.v1.SubjectRulesReviewStatus / incomplete
 ga  | t   | f    | f    | io.k8s.api.authorization.v1.SubjectRulesReviewStatus / nonResourceRules
 ga  | t   | f    | f    | io.k8s.api.authorization.v1.SubjectRulesReviewStatus / resourceRules
 ga  | t   | f    | f    | io.k8s.api.core.v1.PersistentVolumeClaimVolumeSource / claimName
 ga  | t   | f    | f    | io.k8s.api.core.v1.ScopedResourceSelectorRequirement / operator
 ga  | t   | f    | f    | io.k8s.api.core.v1.ScopedResourceSelectorRequirement / scopeName
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.SELinuxStrategyOptions / rule
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.APIResourceList / groupVersion
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.APIResourceList / resources
 ga  | t   | f    | f    | io.k8s.api.admissionregistration.v1.ValidatingWebhook / admissionReviewVersions
 ga  | t   | f    | f    | io.k8s.api.admissionregistration.v1.ValidatingWebhook / clientConfig
 ga  | t   | f    | f    | io.k8s.api.admissionregistration.v1.ValidatingWebhook / name
 ga  | t   | f    | f    | io.k8s.api.admissionregistration.v1.ValidatingWebhook / sideEffects
 ga  | t   | f    | f    | io.k8s.api.authorization.v1.SubjectAccessReviewStatus / allowed
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v1.CrossVersionObjectReference / kind
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v1.CrossVersionObjectReference / name
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v1.HorizontalPodAutoscalerList / items
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v1.HorizontalPodAutoscalerSpec / maxReplicas
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v1.HorizontalPodAutoscalerSpec / scaleTargetRef
 ga  | t   | f    | f    | io.k8s.api.policy.v1beta1.RuntimeClassStrategyOptions / allowedRuntimeClassNames
 ga  | t   | f    | f    | io.k8s.api.auditregistration.v1alpha1.ServiceReference / name
 ga  | t   | f    | f    | io.k8s.api.auditregistration.v1alpha1.ServiceReference / namespace
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.RunAsUserStrategyOptions / rule
 ga  | t   | f    | f    | io.k8s.api.authorization.v1beta1.SelfSubjectRulesReview / spec
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v1.HorizontalPodAutoscalerStatus / currentReplicas
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v1.HorizontalPodAutoscalerStatus / desiredReplicas
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.RunAsGroupStrategyOptions / rule
 ga  | t   | f    | f    | io.k8s.api.admissionregistration.v1beta1.MutatingWebhook / clientConfig
 ga  | t   | f    | f    | io.k8s.api.admissionregistration.v1beta1.MutatingWebhook / name
 ga  | t   | f    | f    | io.k8s.api.authorization.v1beta1.SelfSubjectAccessReview / spec
 ga  | t   | f    | f    | io.k8s.api.admissionregistration.v1beta1.ServiceReference / name
 ga  | t   | f    | f    | io.k8s.api.admissionregistration.v1beta1.ServiceReference / namespace
 ga  | t   | f    | f    | io.k8s.api.authorization.v1beta1.LocalSubjectAccessReview / spec
 ga  | t   | f    | f    | io.k8s.api.authorization.v1beta1.SubjectRulesReviewStatus / incomplete
 ga  | t   | f    | f    | io.k8s.api.authorization.v1beta1.SubjectRulesReviewStatus / nonResourceRules
 ga  | t   | f    | f    | io.k8s.api.authorization.v1beta1.SubjectRulesReviewStatus / resourceRules
 ga  | t   | f    | f    | io.k8s.api.extensions.v1beta1.RuntimeClassStrategyOptions / allowedRuntimeClassNames
 ga  | t   | f    | f    | io.k8s.api.admissionregistration.v1beta1.ValidatingWebhook / clientConfig
 ga  | t   | f    | f    | io.k8s.api.admissionregistration.v1beta1.ValidatingWebhook / name
 ga  | t   | f    | f    | io.k8s.api.authorization.v1beta1.SubjectAccessReviewStatus / allowed
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.CrossVersionObjectReference / kind
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.CrossVersionObjectReference / name
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.HorizontalPodAutoscalerList / items
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.HorizontalPodAutoscalerSpec / maxReplicas
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.HorizontalPodAutoscalerSpec / scaleTargetRef
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.CrossVersionObjectReference / kind
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.CrossVersionObjectReference / name
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.HorizontalPodAutoscalerList / items
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.HorizontalPodAutoscalerSpec / maxReplicas
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.HorizontalPodAutoscalerSpec / scaleTargetRef
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.HorizontalPodAutoscalerStatus / conditions
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.HorizontalPodAutoscalerStatus / currentReplicas
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.HorizontalPodAutoscalerStatus / desiredReplicas
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.HorizontalPodAutoscalerStatus / conditions
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.HorizontalPodAutoscalerStatus / currentReplicas
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.HorizontalPodAutoscalerStatus / desiredReplicas
 ga  | t   | f    | f    | io.k8s.api.certificates.v1beta1.CertificateSigningRequestList / items
 ga  | t   | f    | f    | io.k8s.api.certificates.v1beta1.CertificateSigningRequestSpec / request
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.GroupVersionForDiscovery / groupVersion
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.GroupVersionForDiscovery / version
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelectorRequirement / key
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.LabelSelectorRequirement / operator
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.ServerAddressByClientCIDR / clientCIDR
 ga  | t   | f    | f    | io.k8s.apimachinery.pkg.apis.meta.v1.ServerAddressByClientCIDR / serverAddress
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.HorizontalPodAutoscalerCondition / status
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta1.HorizontalPodAutoscalerCondition / type
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.HorizontalPodAutoscalerCondition / status
 ga  | t   | f    | f    | io.k8s.api.autoscaling.v2beta2.HorizontalPodAutoscalerCondition / type
 ga  | t   | f    | f    | io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIServiceList / items
 ga  | t   | f    | f    | io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIServiceSpec / groupPriorityMinimum
 ga  | t   | f    | f    | io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIServiceSpec / service
 ga  | t   | f    | f    | io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIServiceSpec / versionPriority
 ga  | t   | f    | f    | io.k8s.api.certificates.v1beta1.CertificateSigningRequestCondition / type
 ga  | t   | f    | f    | io.k8s.api.admissionregistration.v1.MutatingWebhookConfigurationList / items
 ga  | t   | f    | f    | io.k8s.api.admissionregistration.v1.ValidatingWebhookConfigurationList / items
 ga  | t   | f    | f    | io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIServiceCondition / status
 ga  | t   | f    | f    | io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIServiceCondition / type
 ga  | t   | f    | f    | io.k8s.kube-aggregator.pkg.apis.apiregistration.v1beta1.APIServiceList / items
 ga  | t   | f    | f    | io.k8s.kube-aggregator.pkg.apis.apiregistration.v1beta1.APIServiceSpec / groupPriorityMinimum
 ga  | t   | f    | f    | io.k8s.kube-aggregator.pkg.apis.apiregistration.v1beta1.APIServiceSpec / service
 ga  | t   | f    | f    | io.k8s.kube-aggregator.pkg.apis.apiregistration.v1beta1.APIServiceSpec / versionPriority
 ga  | t   | f    | f    | io.k8s.api.admissionregistration.v1beta1.MutatingWebhookConfigurationList / items
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.ServiceReference / name
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.ServiceReference / namespace
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.WebhookConversion / conversionReviewVersions
 ga  | t   | f    | f    | io.k8s.api.admissionregistration.v1beta1.ValidatingWebhookConfigurationList / items
 ga  | t   | f    | f    | io.k8s.kube-aggregator.pkg.apis.apiregistration.v1beta1.APIServiceCondition / status
 ga  | t   | f    | f    | io.k8s.kube-aggregator.pkg.apis.apiregistration.v1beta1.APIServiceCondition / type
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.ServiceReference / name
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.ServiceReference / namespace
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceConversion / strategy
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinition / spec
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionList / items
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionSpec / group
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionSpec / names
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionSpec / scope
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionSpec / versions
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceConversion / strategy
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceDefinition / spec
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionNames / kind
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionNames / plural
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceColumnDefinition / jsonPath
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceColumnDefinition / name
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceColumnDefinition / type
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionStatus / acceptedNames
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionStatus / conditions
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionStatus / storedVersions
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceSubresourceScale / specReplicasPath
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceSubresourceScale / statusReplicasPath
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionVersion / name
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionVersion / served
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionVersion / storage
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceDefinitionList / items
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceDefinitionSpec / group
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceDefinitionSpec / names
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceDefinitionSpec / scope
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionCondition / status
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1.CustomResourceDefinitionCondition / type
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceDefinitionNames / kind
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceDefinitionNames / plural
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceColumnDefinition / JSONPath
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceColumnDefinition / name
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceColumnDefinition / type
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceDefinitionStatus / acceptedNames
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceDefinitionStatus / conditions
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceDefinitionStatus / storedVersions
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceSubresourceScale / specReplicasPath
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceSubresourceScale / statusReplicasPath
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceDefinitionVersion / name
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceDefinitionVersion / served
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceDefinitionVersion / storage
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceDefinitionCondition / status
 ga  | t   | f    | f    | io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.v1beta1.CustomResourceDefinitionCondition / type
 ga  | t   | t    | f    | io.k8s.api.events.v1beta1.EventSeries / state
(606 rows)

```
