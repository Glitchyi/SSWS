# Go File Server

This project implements a simple file server in Go. It allows users to serve files over HTTP.

## Project Structure

```
go-file-server
├── cmd
│   └── main.go        # Entry point of the application
├── internal
│   ├── server
│   │   └── server.go  # Contains the Server struct and methods for file serving
├── go.mod             # Module definition
└── README.md          # Project documentation
```

## Getting Started

### Prerequisites

- Go 1.16 or later

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/go-file-server.git
   cd go-file-server
   ```

2. Install dependencies:
   ```
   go mod tidy
   ```

### Running the Server

To run the file server, execute the following command:

```
go run cmd/main.go
```

The server will start and listen on port 8080 by default. You can access it at `http://localhost:8080`.

### Configuration

You can customize the port and other settings by modifying the code in `cmd/main.go` and `internal/server/server.go`.

## License

This project is licensed under the MIT License. See the LICENSE file for details.