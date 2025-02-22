package api

import (
    "io"
    "net/http"
    "net/url"
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
func (c *Client) GetSummary(websiteURL string) (string, error) {
    // Create request URL with query parameter
    endpoint := c.baseURL + "/"
    params := url.Values{}
    params.Add("url", websiteURL)
    
    // Make GET request
    resp, err := c.httpClient.Get(endpoint + "?" + params.Encode())
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()

    // Read response body
    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return "", err
    }

    return string(body), nil
}