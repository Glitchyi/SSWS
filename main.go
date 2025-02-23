package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"ssws/api"
	"ssws/cypher"
)



func handler(w http.ResponseWriter, r *http.Request) {
	// files, err := os.ReadDir("public")
	// if err != nil {
	// 	log.Fatal(err)
	// }
    content, err := os.ReadFile("public/" + "index.html")
    if err != nil {
        log.Fatal(err)
    }
    fmt.Fprintln(w, string(content))
	// for _, file := range files {
	// }
}
func jsonhandler(w http.ResponseWriter, r *http.Request) {
	content, err := os.ReadFile("public/" + "index.html.json")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(content)
}

func main() {
	
	apiClient := api.NewClient("https://glitchyi--web-sumaru-flask-app.modal.run")
	_, err := apiClient.GetSummary()
	if err != nil {
		log.Fatal(err)
	}
	if err := cypher.Encrypt(); err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/", handler)
	http.HandleFunc("/index.html.json", jsonhandler)
	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
