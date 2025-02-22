from cryptography.hazmat.primitives import hashes, serialization, padding
from cryptography.hazmat.primitives.asymmetric import rsa, padding as asym_padding
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import json
import base64

def load_private_key(key_path):
    """Load the RSA private key from PEM file"""
    with open(key_path, 'rb') as key_file:
        private_key = serialization.load_pem_private_key(
            key_file.read(),
            password=None
        )
    return private_key

def decrypt_file(encrypted_file_path, private_key):
    """Decrypt a single encrypted file"""
    # Read the encrypted data
    with open(encrypted_file_path, 'r') as f:
        encrypted_data = json.load(f)
    
    # Decode base64 strings
    ciphertext = base64.b64decode(encrypted_data['content'])
    wrapped_key = base64.b64decode(encrypted_data['wrappedKey'])
    nonce = base64.b64decode(encrypted_data['nonce'])
    
    # Decrypt the AES key using RSA
    aes_key = private_key.decrypt(
        wrapped_key,
        asym_padding.OAEP(
            mgf=asym_padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    
    # Create AESGCM cipher
    aesgcm = AESGCM(aes_key)
    
    # Decrypt the content
    decrypted_data = aesgcm.decrypt(nonce, ciphertext, None)
    
    return decrypted_data

def main():
    # Path to your private key
    private_key_path = "private_key.pem"
    
    # Load the private key
    private_key = load_private_key(private_key_path)
    
    # Example: decrypt a specific file
    encrypted_file_path = "../public/index.html.json"  # Replace with your file name
    
    try:
        decrypted_content = decrypt_file(encrypted_file_path, private_key)
        print("Decrypted content:", decrypted_content.decode('utf-8'))

            
    except Exception as e:
        print(f"Error during decryption: {e}")

if __name__ == "__main__":
    main()