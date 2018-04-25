sudo add-apt-repository    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
sudo apt-get update
sudo apt-get install docker-ce ebtables socat
sudo usermod -aG docker vagrant

# this is probably not needed
sudo cp /config/kubelet.service /etc/systemd/system/
sudo systemctl enable kubelet.service
sudo cp /config/10-kubeadm.conf /etc/systemd/system/kubelet.service.d/

# must have
sudo sh /config/create-cni-config.sh

sudo /binaries/kubeadm init --config /config/kubeadm-config.yaml --ignore-preflight-errors=FileContent--proc-sys-net-bridge-bridge-nf-call-iptables --ignore-preflight-errors=SystemVerification --ignore-preflight-errors=KubeletVersion
