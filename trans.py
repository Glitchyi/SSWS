import json

# Caesar Cipher Encryption Function
def caesar_cipher(text, shift=3):
    encrypted_text = ""
    for char in text:
        if 'a' <= char <= 'z':
            encrypted_text += chr(((ord(char) - ord('a') + shift) % 26) + ord('a'))
        elif 'A' <= char <= 'Z':
            encrypted_text += chr(((ord(char) - ord('A') + shift) % 26) + ord('A'))
        else:
            encrypted_text += char
    return encrypted_text

# Load JSON File
input_file = "medical_meadow_wikidoc (1).json"
output_file = "encrypted_dataset.json"

with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f)

# Encrypt Outputs in the Dataset
for entry in data:
    if "output" in entry:
        entry["output"] = caesar_cipher(entry["output"], shift=3)

# Save to a new JSON file
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print(f"Updated dataset with encrypted outputs saved to {output_file}")
