provider "google" {
  project     = "ii-coop"
  region      = "australia-southeast1"
}
module "k8s" {
  source            = "../../../terraform-google-k8s-gce"
  #source            = "github.com/ii/terraform-google-k8s-gce?ref=audit-webhook"
  name              = "apisnoop"
  # network           = "snoopnet"
  # subnetwork           = "snoopsubnet"
  region            = "australia-southeast1"
  zone              = "australia-southeast1-c"
  k8s_version       = "1.9.6"
  # cni_version       = "0.5.1"
  # docker_version    = "17.06.0"
  # dashboard_version = "v1.6.3"
  # calico_version   = "2.4"
  # pod_network_type = "calico"
  # compute_image = "ubuntu-os-cloud/ubuntu-1704"
  # access_config = [{}]
  master_machine_type = "n1-standard-4"
  node_machine_type = "n1-highmem-2"
  num_nodes         = "3"
  # master_ip = "10.152.0.10"
}
