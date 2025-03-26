package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"ssws/api"
	"ssws/cypher"
	"syscall"
	"time"
	"github.com/fatih/color"
	"github.com/leaanthony/spinner"
)

func handler(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()

	// Create colored loggers
	info := color.New(color.FgCyan).PrintfFunc()
	success := color.New(color.FgGreen).PrintfFunc()
	errLog := color.New(color.FgRed).PrintfFunc()

	// Log request details
	info("[%s] Request received: %s %s\n",
		time.Now().Format("15:04:05"),
		r.Method,
		r.URL.Path,
	)

	content, err := os.ReadFile("public/index.html")
	if err != nil {
		errLog("❌ [%s] Error reading file: %v\n",
			time.Now().Format("15:04:05"),
			err,
		)
		log.Fatal(err)
	}
<<<<<<< HEAD
	seo_content, err := os.ReadFile("public/summary.html")
=======
	summarycontent, err := os.ReadFile("public/summary.html")
>>>>>>> 3dde55217a337b31ab47cc3a32692b340f617133
	if err != nil {
		errLog("❌ [%s] Error reading file: %v\n",
			time.Now().Format("15:04:05"),
			err,
		)
		log.Fatal(err)
	}

	// Combine both HTML content and SEO content
	combinedContent := string(seo_content) + string(content) 
	fmt.Fprintln(w, combinedContent)
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("SWSS", "true")
	w.Header().Set("Access-Control-Expose-Headers", "SWSS")

<<<<<<< HEAD
=======
	fmt.Fprintln(w, string(summarycontent) + string(content))
	

>>>>>>> 3dde55217a337b31ab47cc3a32692b340f617133
	// Log response details
	success("[%s] Response sent: %d bytes in %v\n",
		time.Now().Format("15:04:05"),
		len(content),
		time.Since(startTime),
	)
}

func statushandler(w http.ResponseWriter, r *http.Request) {

	// Create colored loggers
	info := color.New(color.FgCyan).PrintfFunc()
	success := color.New(color.FgGreen).PrintfFunc()

	// Log request details
	info("[%s] Request received: %s %s\n",
		time.Now().Format("15:04:05"),
		r.Method,
		r.URL.Path,
		)

	if r.Method == "POST" {
		success("[%s] Sucessfull Decryption Response Recived ✅\n",
			time.Now().Format("15:04:05"),
		)
	}

	w.WriteHeader(http.StatusOK)
	// Log response details
}

func jsonhandler(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()

	// Create colored loggers
	info := color.New(color.FgCyan).PrintfFunc()
	success := color.New(color.FgGreen).PrintfFunc()
	errLog := color.New(color.FgRed).PrintfFunc()

	// Log request details
	info("[%s] JSON Request received: %s %s\n",
		time.Now().Format("15:04:05"),
		r.Method,
		r.URL.Path,
	)

	content, err := os.ReadFile("public/index.html.json")
	if err != nil {
		errLog("[%s] Error reading JSON file: %v\n",
			time.Now().Format("15:04:05"),
			err,
		)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(content)

	// Log response details
	success("[%s] JSON Response sent: %d bytes in %v\n",
		time.Now().Format("15:04:05"),
		len(content),
		time.Since(startTime),
	)
}

func main() {

	encstat := spinner.New("Encryping data")
	encstat.SetSuccessSymbol("🎉")
	encstat.Start()

	if err := cypher.Encrypt(); err != nil {
		log.Fatal(err)
	}

	encstat.Success("Encryption completed!")

	sumstat := spinner.New("Summarizing website")
	sumstat.SetSuccessSymbol("🎉")
	sumstat.Start()

	apiClient := api.NewClient("https://glitchyi--web-sumaru-flask-app.modal.run")
	_, err := apiClient.GetSummary()
	if err != nil {
		log.Fatal(err)
	}

	sumstat.Success("Summarizing completed!")

	server := &http.Server{
		Addr: ":8080",
	}

	// Setup routes
	http.HandleFunc("/", handler)
	http.HandleFunc("/index.html.json", jsonhandler)
	http.HandleFunc("/status", statushandler)

	// Create channel for shutdown signals
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	// Start server in goroutine
	go func() {
		fmt.Printf("\nServer starting...\n")
		fmt.Printf("\033[1;36mAccess the server at: http://localhost:8080\033[0m\n")
		fmt.Printf("\033[1;33mPress Ctrl+C to stop the server\033[0m\n\n")
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// Wait for interrupt signal
	<-stop
	log.Println("Shutting down server...")

	// Create shutdown context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Attempt graceful shutdown
	if err := server.Shutdown(ctx); err != nil {
		log.Printf("Server forced to shutdown: %v", err)
	}

	log.Println("Server stopped gracefully")
}
