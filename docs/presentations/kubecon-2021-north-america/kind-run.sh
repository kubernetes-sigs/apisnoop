#!/usr/bin/env sh

v_k8s="${1:-"1.18.0"}"

e2e_focus="${e2e_focus}"
rerun_failed="${rerun_failed}"

set -eu

folder="v${v_k8s}_$(date +"%F_%H:%M.%S")"

# https://github.com/kubernetes-sigs/kind/releases/tag/v0.7.0
image_tags="
v1.18.0@sha256:0e20578828edd939d25eb98496a685c76c98d54084932f76069f886ec315d694
v1.17.0@sha256:9512edae126da271b66b990b6fff768fbb7cd786c7d39e86bdf55906352fdf62
v1.16.4@sha256:b91a2c2317a000f3a783489dfb755064177dbc3a0b2f4147d50f04825d016f55
v1.15.7@sha256:e2df133f80ef633c53c0200114fce2ed5e1f6947477dbc83261a6a921169488d
v1.14.10@sha256:81ae5a3237c779efc4dda43cc81c696f88a194abcc4f8fa34f86cf674aa14977
v1.13.12@sha256:5e8ae1a4e39f3d151d420ef912e18368745a2ede6d20ea87506920cd947a7e3a
v1.12.10@sha256:68a6581f64b54994b824708286fafc37f1227b7b54cbb8865182ce1e036ed1cc
v1.11.10@sha256:e6f3dade95b7cb74081c5b9f3291aaaa6026a90a977e0b990778b6adc9ea6248
"

v_tag="$( echo "${image_tags}" | grep "${v_k8s}" )"

GIT_ROOT=$(git rev-parse --show-toplevel)
pushd $GIT_ROOT/kind
kind create cluster \
     --name "${v_k8s}-conformance" \
     --image="kindest/node:${v_tag}" \
     --config=kind+apisnoop.yaml \
    || true
popd
ctx="--context=kind-${v_k8s}-conformance"

sonobuoy delete "${ctx}" --wait

if [ "${e2e_focus}" ]; then
  echo e2e_focus
  folder="${folder}-e2e_focus"
  sonobuoy run "${ctx}" --wait "--e2e-focus=${e2e_focus}"
elif [ "${rerun_failed}" ]; then
  echo rerun
  folder="${folder}-rerun"
  sonobuoy e2e "${ctx}" --wait "${rerun_failed}" --rerun-failed
else
  echo certified_conformance_run
  sonobuoy run "${ctx}" --wait --mode=quick
  # sonobuoy run "${ctx}" --wait --mode=certified-conformance
fi

outfile="$(sonobuoy retrieve "${ctx}")"
mkdir -p "./${folder}"
tar xzf "${outfile}" -C "./${folder}"

sonobuoy results --plugin=e2e "${outfile}"
