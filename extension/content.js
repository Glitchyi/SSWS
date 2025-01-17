// content.js
function caesarDecrypt(text, shift) {
    return text.split('').map(char => {
      
      const code = char.charCodeAt(0);
      
      // Handle uppercase letters
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
      }
      
      // Handle lowercase letters
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
      }
      // Return non-alphabetic characters unchanged
      return char;
    }).join('');
  }
  
  // Listen for message from popup
  chrome.runtime.onMessage.addListener((request,sender, sendResponse) => {
    if (request.action === 'decode') {
      const htmlContent = document.getElementsByTagName('pre')[0].innerHTML;  
      var tempElement = document.createElement('textarea');
      tempElement.innerHTML = htmlContent ;
      var decodedString = tempElement.value;
      console.log(request.shift);
      console.log(decodedString);
      const decodedHTML = caesarDecrypt(decodedString, request.shift);
      console.log(decodedHTML);
      document.getElementsByTagName('body')[0].innerHTML = decodedHTML
      sendResponse({ result: "Decoded message" });
    }
  });
  