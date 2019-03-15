draft version
&version.Version{SemVer:"canary", GitCommit:"35a8c5271997973c99c8aacdd19bd33db1ae2103", GitTreeState:"clean"}

https://console.cloud.google.com/gcr/images/ii-coop/GLOBAL?project=ii-coop&authuser=1&organizationId=65205373123

To use on GCR:
```
draft config set registry.org GitLab-ii-coop
draft config set registry.url gcr.io/ii-coop/
draft config set basedomain 35.184.228.71.xip.io
draft config set registry gcr.io/ii-coop 
```

To use on DockerHub:
```
draft config set registry <org name> 
```

```
# may have to run these every so often... token expires
draft config set registry.authtoken	$(echo "{\"registrytoken\":\"$(gcloud auth application-default print-access-token)\"}" | base64 -w 0)
docker login -u oauth2accesstoken -p "$(gcloud auth application-default print-access-token)" https://gcr.io
```
