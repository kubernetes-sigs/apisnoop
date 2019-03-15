package main

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"log"
)

func hello(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "hello world")
}

func log_events(w http.ResponseWriter, r *http.Request) {
	requestDump, err := httputil.DumpRequest(r, true)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(requestDump))
}

func main() {
	http.HandleFunc("/", hello)
	http.HandleFunc("/events", log_events)
	err := http.ListenAndServe(":9900", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
