from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

def generate_keys():
    # Generate private key
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048
    )
    
    # Generate public key
    public_key = private_key.public_key()
    
    # Save private key to a file
    # Save private key in PKCS#8 format
    with open("private_key.pem", "wb") as private_file:
        private_file.write(
            private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,  # Convert to PKCS#8
                encryption_algorithm=serialization.NoEncryption()
            )
        )

    
    # Save public key to a file
    with open("public_key.pem", "wb") as public_file:
        public_file.write(
            public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            )
        )
    
    print("Keys generated successfully!")

if __name__ == "__main__":
    generate_keys()