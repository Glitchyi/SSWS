async function decryptData(encryptedData, privateKeyPem) {
  // Convert PEM to ArrayBuffer
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = privateKeyPem
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/[\r\n]/g, "")
    .trim();
  const fromBase64 = (base64String) =>
    Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));
  const binaryKey = fromBase64(pemContents);
  // Import the RSA private key
  let privateKey;
  try {
    privateKey = await window.crypto.subtle.importKey(
      "pkcs8",
      binaryKey,
      {
        name: "RSA-OAEP",
        hash: { name: "SHA-256" },
      },
      true,
      ["decrypt"]
    );
  } catch (error) {
    console.error("Failed to import key:", error);
    throw error; // Re-throw to handle the error in the calling function
  }
  // Decode base64 data
  const wrappedKey = base64ToArrayBuffer(encryptedData.wrappedKey);
  const nonce = base64ToArrayBuffer(encryptedData.nonce);
  const ciphertext = base64ToArrayBuffer(encryptedData.content);

  // Decrypt the AES key using RSA-OAEP
  const aesKey = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    wrappedKey
  );

  // Import the AES-GCM key
  const aesGcmKey = await window.crypto.subtle.importKey(
    "raw",
    aesKey,
    {
      name: "AES-GCM",
    },
    true,
    ["decrypt"]
  );

  // Decrypt the content using AES-GCM
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: nonce,
    },
    aesGcmKey,
    ciphertext
  );

  // Convert the decrypted ArrayBuffer to text
  return new TextDecoder().decode(decrypted);
}

// Utility function to convert base64 to ArrayBuffer
function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Listen for message from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "decode") {
    // Create an async function to handle the promise chain
    const handleDecryption = async () => {
      try {
        const response = await fetch(window.location.href + "index.html.json");
        const data = await response.json();
        // Fix: Swap the parameters - privateKey should be first, data second
        const decodedHTML = await decryptData(data, request.privateKey);
        document.getElementsByTagName("body")[0].innerHTML = decodedHTML;
        sendResponse({ result: "Decoded message" });
      } catch (error) {
        console.error("Operation failed:", error);
        alert("Operation failed: Try checking the private key / Connection or try contacting the admin");
        sendResponse({ error: error.message });
      }
    };

    // Execute the async function
    handleDecryption();

    // Return true to indicate we'll send a response asynchronously
    return true;
  }
});
