document.getElementById("decode").addEventListener("click", () => {
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
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "decode",
      privateKey: privateKey,
    });
  });
});

document.getElementById("test").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "test",
    });
  });
});