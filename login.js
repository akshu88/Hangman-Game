// Simple demo credentials — in a real app this would be a backend check
const VALID_USERNAME = "player1";
const VALID_PASSWORD = "hangman123";

function handleLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("error-msg");

  if (!username || !password) {
    errorMsg.textContent = "Please fill in both fields.";
    return;
  }

  // Get saved users from localStorage
  const users = JSON.parse(localStorage.getItem("hangman_users") || "{}");

  if (users[username] && users[username] === password) {
    localStorage.setItem("hangman_user", username);
    window.location.href = "index.html";
  } else {
    errorMsg.textContent = "Invalid username or password.";
  }
}

function handleGoogle() {
  localStorage.setItem("hangman_user", "GoogleUser");
  window.location.href = "index.html";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleLogin();
});