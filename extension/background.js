chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    const swssHeader = details.responseHeaders.find(
      header => header.name.toLowerCase() === 'swss'
    );
    alert(swssHeader);
    if (swssHeader && swssHeader.value === 'true') {
      const privateKey = localStorage.getItem('privateKey');
      if (privateKey) {
        chrome.tabs.sendMessage(details.tabId, {
          action: "decode",
          privateKey: privateKey,
        }, response => {
          if (response.result) {
            console.log(response.result);
          } else if (response.error) {
            console.error(response.error);
          }
        });
      }
    }
    return { responseHeaders: details.responseHeaders };
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);