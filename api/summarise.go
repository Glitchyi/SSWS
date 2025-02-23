package api

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"os"
)

// Client handles API requests
type Client struct {
	baseURL    string
	httpClient *http.Client
}

// NewClient creates a new API client
func NewClient(baseURL string) *Client {
	return &Client{
		baseURL:    baseURL,
		httpClient: &http.Client{},
	}
}

// GetSummary calls the webpage summary API endpoint
func (c *Client) GetSummary() (string, error) {
	// Read the HTML file
	htmlContent, err := os.ReadFile("static/index.html")
	if err != nil {
		return "", err
	}

	// Create JSON payload
	payload := map[string]string{
		"html": string(htmlContent),
	}
	
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	// Create request URL
	endpoint := c.baseURL + "/"
	
	// Make POST request with JSON body
	resp, err := c.httpClient.Post(endpoint, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	// Write response to file
	err = os.WriteFile("public/summary.html", body, 0644)
	if err != nil {
		return "", err
	}

	return string(body), nil
}
