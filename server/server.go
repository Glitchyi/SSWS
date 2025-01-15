package server

import (
    "net/http"
    "log"
)

type Server struct {
    address string
}

func NewServer(address string) *Server {
    return &Server{address: address}
}

func (s *Server) Start() {
    http.HandleFunc("/", s.HandleRequests)
    log.Printf("Starting server on %s\n", s.address)
    if err := http.ListenAndServe(s.address, nil); err != nil {
        log.Fatalf("Could not start server: %s\n", err)
    }
}

func (s *Server) HandleRequests(w http.ResponseWriter, r *http.Request) {
    http.StripPrefix("/", http.FileServer(http.Dir("./files"))).ServeHTTP(w, r)
}