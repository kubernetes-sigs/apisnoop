# Running Docker


. kubemacs-tmate.env
docker run \
       --env-file kubemacs-tmate.env \
       --name kubemacs-docker-init \
       --user root \
       --privileged \
       --network host \
       --rm \
       -it \
       -v "$HOME/.kube:/tmp/.kube" \
       -v /var/run/docker.sock:/var/run/docker.sock \
       $KUBEMACS_IMAGE \
       docker-init.sh
