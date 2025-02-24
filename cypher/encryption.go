package cypher


import (
	"os"
	"fmt"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
)


type EncryptedData struct {
	Content    string `json:"content"`    // base64 encoded encrypted content
	WrappedKey string `json:"wrappedKey"` // base64 encoded encrypted AES key
	Nonce      string `json:"nonce"`      // base64 encoded nonce
}

func Encrypt() error {
	// Read the public key
	keyBytes, err := os.ReadFile("keys/public_key.pem")
	if err != nil {
		return fmt.Errorf("reading public key: %w", err)
	}

	block, _ := pem.Decode(keyBytes)
    
	if block == nil {
        return fmt.Errorf("failed to decode PEM block")
	}
    
	publicKey, err := x509.ParsePKIXPublicKey(block.Bytes)
    
	if err != nil {
        return fmt.Errorf("parsing public key: %w", err)
	}
    
	rsaPublicKey, ok := publicKey.(*rsa.PublicKey)

	if !ok {
		return fmt.Errorf("not an RSA public key")
	}

	// Read files from static directory
	files, err := os.ReadDir("static")
	if err != nil {
		return fmt.Errorf("reading static directory: %w", err)
	}

	for _, file := range files {
		// Read file content
		content, err := os.ReadFile("static/" + file.Name())
		if err != nil {
			return fmt.Errorf("reading file %s: %w", file.Name(), err)
		}

		// Generate AES key
		aesKey := make([]byte, 32)
		if _, err := rand.Read(aesKey); err != nil {
			return fmt.Errorf("generating AES key: %w", err)
		}

		// Create AES cipher
		block, err := aes.NewCipher(aesKey)
		if err != nil {
			return fmt.Errorf("creating AES cipher: %w", err)
		}

		// Create GCM mode
		gcm, err := cipher.NewGCM(block)
		if err != nil {
			return fmt.Errorf("creating GCM: %w", err)
		}

		// Create nonce
		nonce := make([]byte, gcm.NonceSize())
		if _, err := rand.Read(nonce); err != nil {
			return fmt.Errorf("generating nonce: %w", err)
		}

		// Encrypt content with AES-GCM
		ciphertext := gcm.Seal(nil, nonce, content, nil)

		// Encrypt AES key with RSA
		encryptedKey, err := rsa.EncryptOAEP(
			sha256.New(),
			rand.Reader,
			rsaPublicKey,
			aesKey,
			nil,
		)
		if err != nil {
			return fmt.Errorf("encrypting AES key: %w", err)
		}

		content_string := base64.StdEncoding.EncodeToString(ciphertext)

		err = os.WriteFile("public/"+file.Name(), []byte(content_string), 0644)
		if err != nil {
			return fmt.Errorf("writing encrypted file %s: %w", file.Name(), err)
		}
		

		// Create encrypted data structure
		encData := EncryptedData{
			Content:    base64.StdEncoding.EncodeToString(ciphertext),
			WrappedKey: base64.StdEncoding.EncodeToString(encryptedKey),
			Nonce:      base64.StdEncoding.EncodeToString(nonce),
		}

		// Marshal to JSON and save
		jsonData, err := json.Marshal(encData)
		if err != nil {
			return fmt.Errorf("marshaling JSON: %w", err)
		}

		err = os.WriteFile("public/"+file.Name()+".json", jsonData, 0644)
		if err != nil {
			return fmt.Errorf("writing encrypted file %s: %w", file.Name(), err)
		}
	}

	return nil
}