# Hybrid Encryption Overview

1. **AES-GCM** (symmetric) encrypts the file content
2. **RSA** (asymmetric) encrypts the AES key

This approach combines the speed of symmetric encryption for data with the security of asymmetric encryption for key exchange.

## The Encryption Process

### 1. RSA Public Key Preparation
```go
keyBytes, err := os.ReadFile("keys/public_key.pem")
block, _ := pem.Decode(keyBytes)
publicKey, err := x509.ParsePKIXPublicKey(block.Bytes)
rsaPublicKey, ok := publicKey.(*rsa.PublicKey)
```
The code loads an RSA public key that will be used to encrypt the AES key.

### 2. AES Key Generation
```go
aesKey := make([]byte, 32) // 256-bit key
if _, err := rand.Read(aesKey); err != nil {
    // Handle error
}
```
A secure random 256-bit AES key is generated for each file.

### 3. AES-GCM Mode Setup
```go
block, err := aes.NewCipher(aesKey)
gcm, err := cipher.NewGCM(block)
```
The code creates an AES cipher and configures it to use GCM (Galois/Counter Mode), which provides both encryption and authentication.

### 4. Nonce Creation
```go
nonce := make([]byte, gcm.NonceSize())
if _, err := rand.Read(nonce); err != nil {
    // Handle error
}
```
A random nonce (number used once) is generated to ensure that identical data encrypts to different ciphertexts.

### 5. Content Encryption
```go
ciphertext := gcm.Seal(nil, nonce, content, nil)
```
The file content is encrypted using AES-GCM with the AES key and nonce.

### 6. AES Key Encryption
```go
encryptedKey, err := rsa.EncryptOAEP(
    sha256.New(),
    rand.Reader,
    rsaPublicKey,
    aesKey,
    nil,
)
```
The AES key itself is encrypted using RSA-OAEP (with SHA-256), which can only be decrypted with the corresponding RSA private key.

### 7. Storage
The code stores both:
- The base64-encoded ciphertext in files
- Complete packages (ciphertext, encrypted key, and nonce) in JSON files

## Security Benefits

- **Data Security**: Even if the encrypted content is intercepted, it can't be decrypted without the AES key
- **Key Security**: The AES key is protected by RSA encryption, requiring the private key to recover
- **Authenticity**: GCM provides built-in authentication to detect tampering
- **Unique Encryption**: Each file gets a unique AES key and nonce, limiting exposure if one file is compromised

This implementation follows standard cryptographic practices for secure data protection.