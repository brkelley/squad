package main

import (
	"fmt"
	"log"
	"net/http"
)

func homePage (w http.ResponseWriter, r *http.Request){
    fmt.Fprintf(w, "Welcome to the HomePage!")
    fmt.Println("Endpoint Hit: homePage")
}

func main () {
	http.HandleFunc("/", homePage);
	log.Fatal(http.ListenAndServe(":4444", nil));
}
