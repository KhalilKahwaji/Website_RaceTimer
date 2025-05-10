//overriding alert with custom alert
window.alert = function(message) {
  showCustomAlert(message);
};

window.confirm = function(message) {
  return customConfirm(message);
}

function showCustomAlert(message) {
  const overlay = document.getElementById("custom-alert");
  const box = document.getElementById("custom-alert-message");
  box.innerText = message;
  overlay.classList.remove("alert-hidden");
}
function closeCustomAlert() {
  document.getElementById("custom-alert").classList.add("alert-hidden");
}

function customConfirm(message, confirmYes = "OK", confirmNo = "Cancel") {
  return new Promise((resolve) => {
    document.getElementById("custom-confirm-message").innerText = message;
    document.getElementById("custom-confirm").classList.remove("alert-hidden");

    const yesBtn = document.getElementById("confirm-yes");
    const noBtn = document.getElementById("confirm-no");

    // Set custom button labels
    yesBtn.innerText = confirmYes;
    noBtn.innerText = confirmNo;

    const cleanUp = () => {
      document.getElementById("custom-confirm").classList.add("alert-hidden");
      yesBtn.onclick = null;
      noBtn.onclick = null;
    };

    yesBtn.onclick = () => {
      cleanUp();
      resolve(true);
    };

    noBtn.onclick = () => {
      cleanUp();
      resolve(false);
    };
  });
}
