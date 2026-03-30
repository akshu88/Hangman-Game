const API = 'http://localhost:5002/api';

async function handleLogin() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorMsg = document.getElementById('error-msg');

  if (!username || !password) {
    errorMsg.textContent = 'Please fill in both fields.';
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorMsg.textContent = data.message || 'Login failed.';
      return;
    }

    // Save token and user info to localStorage
    localStorage.setItem('hangman_token', data.token);
    localStorage.setItem('hangman_user', data.user.username);
    localStorage.setItem('hangman_userId', data.user.id);

    window.location.href = 'index.html';

  } catch (err) {
    errorMsg.textContent = 'Cannot connect to server. Is it running?';
  }
}

function handleGoogle() {
  alert('Google login not supported in this version.');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleLogin();
});