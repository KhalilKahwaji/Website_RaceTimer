//overriding alert with custom alert
window.alert = function(message) {
  showCustomAlert(message);
};

function showCustomAlert(message) {
  const overlay = document.getElementById("custom-alert");
  const box = document.getElementById("custom-alert-message");
  box.innerText = message;
  overlay.classList.remove("alert-hidden");
}
function closeCustomAlert() {
  document.getElementById("custom-alert").classList.add("alert-hidden");
}