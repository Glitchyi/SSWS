# Safe Secure Web Server (SSWS)

> [!IMPORTANT]
> NOW WITH AN EXTENSION BUILT-IN

A web server implementation designed to display warnings against unauthorized web scraping.

## Project Structure

```txt
SSWS/
├── extension/              # Chrome extension files
│   ├── content.js         # Extension content script
│   ├── jquery-3.7.1.min.js
│   ├── manifest.json      # Extension configuration
│   ├── popup.html        
│   └── popup.js
├── server/                # Server implementation
│   └── server.go         # Core server logic
├── static/                # Static web content
│   └── index.html        # Warning page
├── public/               # Public assets
├── images/              
├── main.go               # Main application entry
├── webscrape.py         # Test scraping script
└── go.mod               # Go module definition
```

## Features

- Serves warning messages to web scraping bots
- Static file serving capability
- Test scraping script to verify behavior
- Chrome extension support

## Working

This project is a simple webserver that jumbles up the content from an input website that we put in the ` static ` folder. When the server starts up the contents from the ` static ` gets loaded and jumbled (in later version posioned for LLMs) and gets placed in the ` public ` folder, a simple web server then serves the files from this directory to address :

```text
http://localhost:8080
```

The content deliverd to the client will be jumbled (later poisoned) content an examples for this would be:

> Original content

```html
<p>Strict regulations are needed to ensure ethical and legal data collection practices.</p>
```

> Jumbled (Later poisoned) content

```html
<s>Vwulfw uhjxodwlrqv duh qhhghg wr hqvxuh hwklfdo dqg ohjdo gdwd froohfwlrq sudfwlfhv.</s>
```

This can be undone using browser extension, that will unscramble the `Jumbled content` and converts it back to the `Original content`.

In the case of poisoned text we plan to implement some way of sending back the original content.

## Getting Started

### Prerequisites

- Go 1.20 or later
- Python 3.x (for testing scraper)
- Chrome browser (for extension)

### Running the Server

1. Start the Go server:

```sh
go run .
```

The server will start on port 8080 by default.

### Testing the Scraper

To test the anti-scraping measures:

```sh
python webscrape.py
```

## Chrome Extension

The extension component is located in the extension directory and can be loaded into Chrome for additional functionality.

The steps are:

1. 

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Note: This server is designed as an educational tool to demonstrate anti-scraping measures and should be used responsibly.
