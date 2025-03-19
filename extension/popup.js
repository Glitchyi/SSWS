if (localStorage.getItem("privateKey")) {
  document.getElementById("private-key").style.display = "none"
}

document.getElementById("clear").addEventListener("click", () => {
  localStorage.removeItem("privateKey");
  document.getElementById("private-key").style.display = "block";
  document.getElementById("private-key").value = "";
});


document.getElementById("decode").addEventListener("click", () => {
  let privateKey;
  if (localStorage.getItem("privateKey")) {
    privateKey = localStorage.getItem(
      "privateKey"
    );

  } else {
    privateKey = document.getElementById("private-key").value;
    localStorage.setItem("privateKey", privateKey);
  }

  if (privateKey == ''){
    alert("Please enter a private key");
    return;
  }
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "decode",
      privateKey: privateKey,
    }, response => {
      if (response.result) {
        console.log(response.result);
      }else if (response.error) {
        console.error(response.error);
      }
    });
  });
});


