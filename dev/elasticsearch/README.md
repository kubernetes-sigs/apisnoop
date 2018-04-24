# ELK cluster in Kubernetes

Kubernetes manifests for ELK (Elasticsearch + Logstash + Kibana)

## Description
Approximate scheme of ELK:

```
Filebeat---Logstash------
                         \
Filebeat---Logstash-----Elasticsearch----Kibana
                         /
Filebeat---Logstash------
```

These manifests DO NOT include Filebeat installation! You could find manifests in another directories of this repo.   

## Configure new installation
1. Change ```namespace``` parameter in all manifests.
2. Create or change Logstash manifest for new index.
3. Change elasticsearch & logstash links in all manifests.
4. Change pods resource values if needed.

## Example:
```yaml
- name: "ES_JAVA_OPTS"
  value: "-Xms512m -Xmx512m"
resources:
  limits:
    memory: 1024Mi
  requests:
    memory: 1024Mi
```
In this example you could change -Xms, -Xmx, memory.
5. Change ```replica``` parameter if needed.

## Installation
Run this command for deploying ELK
```
kubectl apply -f .
```

## Adding new index of ELK stack
1. You should create new manifest for Logstash from copy of existing manifest (for example, ```logstash-new.yaml```).  
2. Change index field name in output section:

```yaml
output {
  elasticsearch {
    hosts => "elasticsearch-logging.elasticsearch:9200"
    index => "new_index-%{+YYYY.MM.dd}"
    document_type => "%{[@metadata][type]}"
  }
}
```
3. Run this command for deploying new Logstash:
```kubectl apply -f logstash-new.yaml```
