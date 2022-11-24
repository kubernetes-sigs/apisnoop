// update-kubernetes-release-version
//
// Purpose: to update the latest version of Kubernetes as it's known by this repo
// Usage: go run cmd/update-kubernetes-release-version/main.go
//
// Behaviours
// - if the latest version matches what's in the first entry of the resources/coverage/releases.yaml file, the date of it's release will be set and a new unreleased version will be pushed to the first entry
// - if the latest version is less than the first entry of the resources/coverage/releases.yaml file, nothing will happen
//
// TODO quick refactor into functions
// TODO add tests

package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	semver "github.com/hashicorp/go-version"
	"sigs.k8s.io/yaml"
)

var (
	stableVersionURL       string = "https://storage.googleapis.com/kubernetes-release/release/stable.txt"
	kubernetesGitHubTagURL string = "https://api.github.com/repos/kubernetes/kubernetes/releases/tags"
)

type Release struct {
	Version     string `json:"version"`
	ReleaseDate string `json:"release_date"`
}

type GitHubRelease struct {
	CreatedAt string `json:"created_at"`
}

func readFile(path string) (string, error) {
	content, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}
	return string(content), nil
}

func writeFile(path string, content string) error {
	_, err := os.Create(path)
	if err != nil {
		return err
	}
	err = os.WriteFile(path, []byte(content), 0644)
	if err != nil {
		return err
	}
	return nil
}

func getHTTPFile(uri string) (content string, resp *http.Response, err error) {
	resp, err = http.Get(uri)
	if err != nil {
		return "", nil, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", nil, err
	}
	return string(body), resp, nil
}

func main() {
	log.Println("Running update-kubernetes-release-version")

	// parse resources/coverage/releases.yaml
	releasesYAML, err := readFile("resources/coverage/releases.yaml")
	if err != nil {
		log.Fatalf("unable to read resources/coverage/releases.yaml, %v", err)
	}
	var releases []Release
	err = yaml.Unmarshal([]byte(releasesYAML), &releases)
	if err != nil {
		log.Fatalf("failed to parse releasesYAML, %v", err)
	}

	// download kubernetes stable.txt
	stableVersionTxt, _, err := getHTTPFile(stableVersionURL)
	if err != nil {
		log.Fatalf("failed to fetch stable.txt, %v", err)
	}

	// parse the version string
	// stableVersionTxt = "v1.26.0"
	stableVersion, err := semver.NewSemver(stableVersionTxt)
	if err != nil {
		log.Fatalf("failed to parse stableVersion string, %v", err)
	}

	// contruct the major release version
	lastMajorRelease, err := semver.NewSemver(fmt.Sprintf("%v.%v.0", stableVersion.Segments()[0], stableVersion.Segments()[1]))
	if err != nil {
		log.Fatalf("failed to parse stableVersion string, %v", err)
	}

	// get the release date for the current major version
	req, err := http.NewRequest(http.MethodGet, kubernetesGitHubTagURL+"/v"+lastMajorRelease.String(), nil)
	if err != nil {
		log.Fatalf("failed to get contruct a HTTP request")
	}
	req.Header.Add("Accept", "application/vnd.github+json")
	req.Header.Add("Authorization", "Bearer "+os.Getenv("GITHUB_TOKEN"))
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalf("Failed to fetch current major version release tag info, %v", err)
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatalf("Failed to parse response body, %v", err)
	}
	var githubRelease GitHubRelease
	err = json.Unmarshal(body, &githubRelease)
	if err != nil {
		log.Fatalf("Failed to parse Github Release data, %v", err)
	}
	// githubRelease := GitHubRelease{
	// 	CreatedAt: "2022-11-24T16:08:01Z",
	// }

	// mark the version +1minor with empty release_date string
	unreleasedVersion, err := semver.NewSemver(releases[0].Version)
	if err != nil {
		log.Fatalf("Failed to parse new version, %v", err)
	}
	if !unreleasedVersion.Equal(lastMajorRelease) {
		log.Println("No new release available yet. Exiting!")
		return
	}
	currentReleaseDate, err := time.Parse("2006-01-02T15:04:05Z", githubRelease.CreatedAt)
	if err != nil {
		log.Fatalf("Failed to parse time, %v", err)
	}
	releases[0].ReleaseDate = currentReleaseDate.Format("2006-01-02")
	segments := unreleasedVersion.Segments()
	newVersion := fmt.Sprintf("%v.%v.0", segments[0], segments[1]+1)
	releases = append([]Release{{Version: newVersion, ReleaseDate: ""}}, releases...)

	// write new resources/coverage/releases.yaml
	releasesModified, err := yaml.Marshal(releases)
	if err != nil {
		log.Fatalf("Failed to marshal releases, %v", err)
	}
	err = writeFile("resources/coverage/releases.yaml", string(releasesModified))
	if err != nil {
		log.Fatalf("Failed to write resources/coverage/releases.yaml, %v", err)
	}
	log.Println("Process complete")
}
