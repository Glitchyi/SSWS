async function decryptData(encryptedData, privateKeyPem) {
  // Convert PEM to ArrayBuffer
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = privateKeyPem
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/[\r\n]/g, "")
    .trim();
  console.log(pemContents);
  const fromBase64 = (base64String) =>
    Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));
  const binaryKey = fromBase64(pemContents);
  console.log(binaryKey);
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

const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9iEVhRRgfX4Qm
K1RbwcHH0OCpABYRZB7Z+eI0SYGOxSQ4j//dyu10UWbTBmh6N0o3vYkIqlbXhvwf
zt1tdqObgdkcOwveBOg5Xqi7LR4MQCrS3Rl7VX0wuJT7MYWYOnKwYBcFIa8RUwhy
Y7EJFSxoTcySqP3sLkOkAvz8Gup4bo+een4YkktBoZqIoMoemxGAHyhVatU+3yfM
VMP6gNK1a2z14Cp+gVeXQ6tn7Fb9KwkBhJl+3QBr3lesUxf5Kekzs6Qf1sEaIT87
Gi9OxL2A9HdxoxMpa1OfZWzQiIfDfeumLAbII1HKVjPUOt8DUYBNPi5Gbnyhqine
3aEOP9KXAgMBAAECggEABO7pmLpi14TgcdqPM7jg3DHDJJL51We3koaPDTuxPBqZ
3UEI8L3J8sz1nLOI1PmLHH/586L0vLUTle5dVBk88UduyRh+Wr/iSC//EKmAI+Mo
WjG4FT4958k+KNBQAQzbFF0uluBwEpwzLEBiXhv8z8A1UsdESLlRjbt9g0BeGawC
NTgL7mnOPUbrAIi08lqEO7D2gR8b4ShUuVzVCjgx9qujCyE1qv8buiY2Zjs2CYKL
72IFDLAuQ1dEGPxWHsmPa0770s8KxMBeigN5mYennkgF7OkrT4On7P5ob852ez6a
NF4VWiw6LuJBJwV+nZ9iEucxs/xsn9LQ1i8jN18NkQKBgQDtvw6Ut4AourOzk4Rs
IyzHPw8QHA7sQMdRPpvmMQg8LiX76yBus8/v9aFtDsz6d7J5VscKG0FFHsJBQ056
a7b22b5ZrZMt0KCg7Vkh5aoRQYN6JA4UKXtOnfln+9wi98fAq/bmu0Ous5ryGIgE
qOOnl6D2G/NzOqwUgShDgVW+xwKBgQDMFY9Obz4CJhvB+Lsyk6+Ira++RHjy+4Ki
DIaOcMR4+/Aq98BwcvVt8iHS1D22AcTht7QdmjNQHuH+T4pdZxQE9IXxDw+J0D9e
MKNFVk6NCstgqVZurUCRYGsULlt2BecGPSwJrQo0V9KWdUrOethYFCUlFGAum7ot
IK66JPK9sQKBgQDGbf9SerG5zNJtoEMXKmiWR/hffrupzgtNsQ7Xmrb/25iSYVWp
b+Sup/m6l27X4g2RHq9zrPnWIe0KIY4fuUV1VJl+KdQ8mfNnPZJ2K0S9sEt3Jx6l
D1Y+cLWYZ2r9uIb9NcoWG9hKuNcrFvR3xypzV6fdociYtTCo0H/1j74sQwKBgHSd
PS3MUtpXfDTyM8VKrlqjJHDMH3B4VsTR83Eg7qNTEoD64HNgvOz+FmWp8Tk2+ZEg
r0LbAcceXnQ6bw3AAKh0MLT1riNJY2wmzqSoFGpzaJLrMAA9708ikQ0PECP4a3Id
MjS1M8eFB0gB7aTefRCXMkJlyi/XvCJdMnoa8rmBAoGATAIFXThyC/FPPHLDbnVT
hEdqeawz7u+Jx9Sxiap32E2ct6ZTas+d2sSNZl37kRS30nZF+6y4k27CoD60hwEa
MsXRZ1OE7r7xJVoYNlFtWwKI2vyraRKigewk2vwVSxl6hXd+EgW7s1b79dL1jZS+
FzU9X5rGqTbz57ffZfn9DaY=
-----END PRIVATE KEY-----

`;

// Listen for message from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "decode") {
    // Create an async function to handle the promise chain
    const handleDecryption = async () => {
      try {
        const response = await fetch(window.location.href + "index.html.json");
        const data = await response.json();
        console.error(data);
        // Fix: Swap the parameters - privateKey should be first, data second
        const decodedHTML = await decryptData(data, request.privateKey);
        document.getElementsByTagName("body")[0].innerHTML = decodedHTML;
        sendResponse({ result: "Decoded message" });
      } catch (error) {
        console.error("Operation failed:", error);
        sendResponse({ error: error.message });
      }
    };

    // Execute the async function
    handleDecryption();

    // Return true to indicate we'll send a response asynchronously
    return true;
  }
});

/*
  if (request.action === "test") {

    const fromBase64 = base64String => Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
    const getPkcs8Der = pkcs8Pem => {
        pkcs8Pem = pkcs8Pem.replace( /[\r\n]+/gm, "" );
        const pkcs8PemHeader = "-----BEGIN PRIVATE KEY-----";
        const pkcs8PemFooter = "-----END PRIVATE KEY-----";
        pkcs8Pem = pkcs8Pem.substring(pkcs8PemHeader.length, pkcs8Pem.length - pkcs8PemFooter.length);
        return fromBase64(pkcs8Pem);	
    }		
       
    async function importPrivateKey(pkcs8Pem) {		
        return await window.crypto.subtle.importKey(
            "pkcs8",
            getPkcs8Der(pkcs8Pem),
            {
                name: "RSA-OAEP",
                hash: "SHA-1",          // Replace SHA-256 with SHA-1
            },
            true,
            ["decrypt"]
        );
    }
    
    async function decryptRSA(key, ciphertext) {
        let decrypted = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            key,
            ciphertext
        );
        const dec = new TextDecoder();
        return dec.decode(decrypted);
    }
    
    async function init() {
    
        const privateKey = 
            '-----BEGIN PRIVATE KEY-----\
            MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC3jmTi3O1k2YXs\
            AM6nNTTIzDq5YWkxYrYb6cpO9eYuzmphgRnVDR6a1YWRXMoCuCfuNXcDGywzudRn\
            bBMw0FHKLUqCttVHGpZYu0+0tRR10ubxiz/xnd/aCmRYHcmUNn8Qdh3KU59A9HK5\
            HhYFf1vhK8r3fkoO4CjoGo1ROzXyMybUSy+4mSNscUtt5LwrVn48vXvG5i5B4DRT\
            nM4cINmutEzA2s5cDt+dzU4Py71fKBRDRIGGn0vdVSoZKbWuhm5WewyRewCk7HFc\
            PALCi5/1A7VKDAHUC4FlXmuG2+wzdchEyxMj6oLR7+BkKFQaTmuMM/22cGBjVTVt\
            pSr3iDovAgMBAAECggEBAIuTQW+oovNu3IDq1DkdIjgV5AmW4tBkySlMi0OjhBbP\
            auEdtDDnOwBtoJU6Q3nx4psmGItKHEBw6+yAp88UeT0NV30x3delhfGO7Trx/s7h\
            Qi8lvcfSTqeUA11luSR0lAZGaryw/YX820eccw5XG9yK2ll7tIC/PxvPJOpB5fF2\
            XGxGrionTjHDzXJ1OWX0i0aZlNNufInJAHhlt7aT3GiQMKcQs+AUb/+bWxI3Hln8\
            KcL13EUlD4pJW8vtTK3gCnQNKKMoPB5Ugqe5BrU8ElkBz+zSKDnVwt5bgjrlucYz\
            rKJxWr6/qTRZkzmvkhaJeNzzepfwkFsQ/eHcxYrtuDECgYEA8OXkQ2SqYDZwizCd\
            SuVkx2zHm3zXYRSlRtnXYoUdJyTyuZ4k2GvXBrlwRsOJ14emVkHKyR5enmNjwrW5\
            dcD2tbBzavcqOYAMiHcKklcS/gWgPx0X5QFHU33vr8u51BQWCz75lxddWNKxVAN/\
            cUTugONtS4+EP4dSZhuxHt6RscsCgYEAwxA9QmZrI54hjMkIyqwmviRmIk42S5kk\
            OxbhxBbt5qVueLRB092JyGmCR2kYiqdHCYkGFDOE4kni6Bsszq5CSJvhiATFeZeX\
            ldFQeZqAiRY2rAd7xD1upMug/cK3ODA8k3k/e72CtyxtBTR01q29SnPx5p/57MrI\
            3ogddHlGvK0CgYEA3VqhELwjQh1D9OJK5lM683SlRd7FGdOauyvYmhKu4xU0ZBNI\
            0ATnpKoo3R04P+/JjGEQMRXS4794H6ZUMDuLdxAYPiW3ivZ6jbq04BtavEf3I4dc\
            OXWfULzbzbFpo9KBHvxS4974S3Hut8AvDqnEbnKML25EmwuBT4oKis8BGVkCgYEA\
            nusPDZbFeNou+TUbzYrdcZHUB+TyhTq58s4clxYbMgrbaslozAQ0aavT8Pvle6j2\
            zgTth+3FOFr72x+wrJ358I/W+Wrxu7NOU0eZqci/KXCIkDT0l5d5GhewDK3jeYqK\
            /5cLqnNmGHfARjpLak9X5V162erBwjIf3nTEkozvnW0CgYB6L1CX3DkTFH3OBcJe\
            SvV18RDUfNI8MpUKcpofmwwvgER3GrehSZHRVxVwNbnJOqbh/oiwmmNJieKrFsk9\
            EzCRBVWdZByHHYW2js+gCrAp+ghnl1QEAeCU7YTxCJ2fZIAmfB9X4u/7ARtVxnZY\
            mOWlm65KUYr5lf2Ws5plL4pCRA==\
            -----END PRIVATE KEY-----';
    
        const ciphertext =
            'F6/NwENdUZSl+vrgpWVkyWPQuYaTGDNZPIvj4KmIRHVx4qybxN24LPIgk0Rl84KHcLFadZWCjNpM\
            vg3l826OaKZAtwvIp9IxVrMbvtNOymY6A1koKvC9ema92SR4DC9hmTtMxhUB6r3XgACtRLFqMfg+\
            zYSHfFqQEGJg3yZ43hfzIq/gCfHPk5sZXASq5WY5b9yd4gRonn5D4OCD6xna/r5ovHfrpO/Fwe8N\
            eeY2gqTAdtzvtmOw/HLQhGANejpJYr1IriQbepM7jLjBkJX+uCn38O1MxpQb7s5RXTvGvoEoofWV\
            Cq8gNFhgnVFuurdZUiY0bn58UwaVFdwzEfDSUQ==';
    
        try {
            const key = await importPrivateKey(privateKey);
            const decrypted = await decryptRSA(key, fromBase64(ciphertext));
            console.error(decrypted);
        } catch(error) {
            console.log(error);
        }


    init();    }  }
*/
