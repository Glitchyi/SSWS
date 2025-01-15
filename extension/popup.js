// popup.js
document.getElementById('decode').addEventListener('click', () => {
    const shift = parseInt(document.getElementById('shift').value);
    
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'decode',
        shift: shift
      });
    });
  });
  