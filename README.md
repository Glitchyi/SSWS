![swss-long](https://github.com/user-attachments/assets/5e07dc3e-dba1-4b05-abd3-aa46b648c33b)

# Safe Secure Web Server (SSWS)

> [!IMPORTANT]
> NOW WITH AN EXTENSION BUILT-IN

A web server implementation similar to NGINX designed to work against unauthorized web scraping.

## Project Structure

```txt
SSWS/
├── api/
│   └── summarise.go            # API client for webpage summarization
├── cypher/
│   └── encryption.go           # Encryption logic implementation
├── extension/                  # Chrome extension files
│   ├── background.js           # Extension background script
│   ├── content.js              # Content script for webpage modification
│   ├── manifest.json           # Extension manifest
│   ├── popup.html              # Extension popup UI
│   └── popup.js                # Popup UI logic
├── images/
│   └── url.png                 # Image assets
├── keys/                       # Encryption key management
│   ├── keygen.py               # Key generation script
│   ├── keytest.py              # Key testing utilities
│   ├── private_key.pem         # Private key file
│   ├── public_key.pem          # Public key file
│   └── requirements.txt        # Python dependencies
├── public/                     # Server output directory
│   ├── index.html              # Encrypted/jumbled content
│   ├── index.html.json         # Encryption metadata
│   └── summary.html            # Generated summary
├── static/                     # Original content directory
│   └── index.html              # Source webpage
├── utils/                      # Utility scripts
│   ├── webpage-summary.py      # Summary generation
│   └── webscrape.py            # Test scraping script
├── .gitignore                  # Git ignore rules
├── go.mod                      # Go module file
├── go.sum                      # Go dependencies checksum
├── main.go                     # Server entry point
└── README.md                   # Project documentation
```

## Features

- Serves jumbled/poisoned content to web scraping bots
- Test scraping script to verify behavior
- Chrome extension to undo the jumbled content

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

> [!NOTE]
> In the case of poisoned text we plan to implement some way of sending back the original content.

## Getting Started

### Prerequisites

- Go 1.20 or later
- Python 3.x (for testing scraper)
- Chrome browser (for extension)

### Running the Server

1. Generate keys using the `keys/keygen.py`, the requrements for the program are given in the `keys/requrements.txt`

2. Public and private keys will be generated and these will be used to encrypt and decrypt the data. The client extension expects the private key named as `private_key.py` and `public_key.py` is the public key that the server uses.

3. Start the Go server:

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

1. **Open the url**

    ```text
    chrome://extensions/
    ```

    > [!NOTE]
    > This is the extensions page for chrome where you will see all your install extensions

2. **Toggle developer mode**

    ![image](https://github.com/user-attachments/assets/bf000a0b-c790-4df8-b615-bc5b18a34c26)

    > On the top and right corner of the page there will be a toggle to turn on developer mode, turn this on as we want to load our extension.

3. **Load an upacked extension**

    ![image](https://github.com/user-attachments/assets/410031c4-f322-4630-bb18-8a0a16f2eb7c)

    > Once this option is choosed a folder picker should open up and then you have to select the `extension` folder from this project.

4. **Use**

    ![image](https://github.com/user-attachments/assets/5a89da02-7409-4361-84fb-7b8f7d488653)

    > Now you should be able to see the extension on your browser and you can activate it by clicking on it.

> [!CAUTION]
> This is the extensions is updating the contents on the website, this will work on all websites but may lead to undesirable results

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Note: This server is designed as an educational tool to demonstrate anti-scraping measures and should be used responsibly.
