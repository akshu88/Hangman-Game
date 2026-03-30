const API = 'http://localhost:5002/api';

async function handleSignup() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirm  = document.getElementById('confirm-password').value.trim();
  const errorMsg = document.getElementById('error-msg');

  if (!username || !password || !confirm) {
    errorMsg.textContent = 'Please fill in all fields.'; return;
  }
  if (password !== confirm) {
    errorMsg.textContent = 'Passwords do not match.'; return;
  }
  if (username.length < 3) {
    errorMsg.textContent = 'Username must be at least 3 characters.'; return;
  }
  if (password.length < 6) {
    errorMsg.textContent = 'Password must be at least 6 characters.'; return;
  }

  try {
    const res = await fetch(`${API}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email: username + '@hangman.com' })
    });

    const data = await res.json();

    if (!res.ok) {
      errorMsg.textContent = data.message || 'Signup failed.'; return;
    }

    alert('Account created! Please login.');
    window.location.href = 'login.html';
  } catch (err) {
    errorMsg.textContent = 'Cannot connect to server. Is it running?';
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSignup();
});