function handleSignup() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirm = document.getElementById("confirm-password").value.trim();
  const errorMsg = document.getElementById("error-msg");

  // Validation
  if (!username || !password || !confirm) {
    errorMsg.textContent = "Please fill in all fields.";
    return;
  }

  if (password !== confirm) {
    errorMsg.textContent = "Passwords do not match.";
    return;
  }

  if (username.length < 3) {
    errorMsg.textContent = "Username must be at least 3 characters.";
    return;
  }

  if (password.length < 6) {
    errorMsg.textContent = "Password must be at least 6 characters.";
    return;
  }

  // Check if username already exists
  const users = JSON.parse(localStorage.getItem("hangman_users") || "{}");
  if (users[username]) {
    errorMsg.textContent = "Username already taken.";
    return;
  }

  // Save new user
  users[username] = password;
  localStorage.setItem("hangman_users", JSON.stringify(users));

  // Redirect to login
  alert("Account created! Please login.");
  window.location.href = "login.html";
}

// Allow pressing Enter to sign up
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSignup();
});