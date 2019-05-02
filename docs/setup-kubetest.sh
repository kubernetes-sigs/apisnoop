# Install Docker


TIME_START=$(date)
apt-get update
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
apt-get install -y docker-ce docker-ce-cli containerd.io

# Install git & gcc


apt-get install -y git gcc

# Install go


curl -L https://dl.google.com/go/go1.12.4.linux-amd64.tar.gz | sudo tar -C /usr/local -xzf -
export GOROOT=/usr/local/go/
export GOPATH=~/go
export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin
go version

# Install kubectl


curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | tee -a /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl

# Get Kubernetes, kubetest & KIND

# - Following feedback from [[https://kubernetes.slack.com/messages/CEKK1KTN2/convo/CEKK1KTN2-1555018633.255400/?thread_ts=1555018633.255400][@neolit123 on kubernetes.slack.com #kind]]


echo "Getting Kubernetes..."
go get k8s.io/kubernetes
echo "Getting Kubetest..."
go get k8s.io/test-infra
echo "Getting Kind..."
go get sigs.k8s.io/kind

# Build kubetest


echo "Build kubetest"
cd ~/go/src/k8s.io/test-infra/kubetest
go build
cp kubetest ../../kubernetes
cd ../../kubernetes
echo "Getting a cluster up with Kind..."
./kubetest --deployment=kind --kind-binary-version=build --provider=skeleton --build --up

# Update .bashrc 

# We need the PATH, GOROOT & GOPATH variables set for future shell sessions.


cat <<EOF >> ~/.bashrc
export GOROOT=/usr/local/go/
export GOPATH=~/go
export PATH=$PATH:$GOPATH/bin:/usr/local/go/bin:$GOPATH/src/k8s.io/test-infra/kubetest
EOF

# Check on Docker


echo -e "\nChecking on docker..."
docker ps -a
docker images

# Check Cluster State


echo -e "\nCheck on the state of the cluster..."
ln -sf ~/.kube/kind-config-kind-kubetest ~/.kube/config
kubectl version
kubectl get nodes
echo "Waiting on all pods to start..."
sleep 70
kubectl get pods --all-namespaces

echo "Start:    $TIME_START"
echo "Finished: $(date)"
