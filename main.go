package main

import (
    "fmt"
    "log"
    "net/http"
    "os"
)

func encrypt(){
    files, err := os.ReadDir("static")
    if err != nil {
        log.Fatal(err)
    }

    for _, file := range files {
        content, err := os.ReadFile("static/" + file.Name())
        if err != nil {
            log.Fatal(err)
        }

        // Encrypt content using a ceaser cipher
        shift := 3
        encryptedContent := make([]byte, len(content))
        for i, b := range content {
            if b >= 'a' && b <= 'z' {
            encryptedContent[i] = 'a' + (b-'a'+byte(shift))%26
            } else if b >= 'A' && b <= 'Z' {
            encryptedContent[i] = 'A' + (b-'A'+byte(shift))%26
            } else {
            encryptedContent[i] = b
            }
        }

        err = os.WriteFile("public/"+file.Name(), encryptedContent, 0644)
        if err != nil {
            log.Fatal(err)
        }


        // fmt.Printf("Contents of %s:\n%s\n", file.Name(), content)
    }
}

func handler(w http.ResponseWriter, r *http.Request) {
    files, err := os.ReadDir("static")
    if err != nil {
        log.Fatal(err)
    }
    for _, file := range files {
        content, err := os.ReadFile("public/" + file.Name())
        fmt.Fprint(w, string(content))
        if err != nil {
            log.Fatal(err)
        }
    }
    // fmt.Fprintf(w, "Hello, World!")
}

func main() {
    encrypt()
    http.HandleFunc("/", handler)
    log.Println("Starting server on :8080")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        log.Fatal(err)
    }
}
