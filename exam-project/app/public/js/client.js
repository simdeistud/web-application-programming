const loginButton = document.getElementById('btn-login');
const registerButton = document.getElementById('btn-register');
const myaccountButton = document.getElementById('btn-myaccount');
const logoutButton = document.getElementById('btn-logout');

async function hasSession() {
  const res = await fetch("http://localhost:3000/api/whoami", {
    method: "GET",
    credentials: "include",
  });
  return res.ok;
}

function setUIMode(loggedIn) {
  loginButton.style.display = loggedIn ? 'none'   : 'inline';
  registerButton.style.display = loggedIn ? 'none': 'inline';
  myaccountButton.style.display = loggedIn ? 'inline' : 'none';
  logoutButton.style.display = loggedIn ? 'inline' : 'none';
}

// initial render
(async () => setUIMode(await hasSession()))();

loginButton.addEventListener('click', () => {
  const frame = document.querySelector('main');
  frame.innerHTML = `
    <form id="form-login">
      <fieldset>
        <legend>[LOGIN]</legend>
        <label for="login-username">Username:</label>
        <input type="text" id="login-username" name="username" required />
        <label for="login-password">Password:</label>
        <input type="password" id="login-password" name="password" required />
        <button type="submit">[SUBMIT]</button>
      </fieldset>
    </form>
  `;

  document.getElementById('form-login').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const res = await fetch("http://localhost:3000/api/auth/signin", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert("Error: " + (err.error || res.statusText));
      setUIMode(false);
      return;
    }

    // after successful login, refresh UI mode
    setUIMode(true);
    frame.innerHTML = '<h2>[WELCOME]</h2><p>[YOU ARE NOW LOGGED IN]</p>';
  });
});

myaccountButton.addEventListener('click', async () => {
  const res = await fetch("http://localhost:3000/api/whoami", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    alert("Error: " + (err.error || res.statusText));
    setUIMode(false);
    return;
  }

  const userData = await res.json();
  document.querySelector('main').innerHTML = `
    <h2>My Account</h2>
    <p>Username: ${userData.username}</p>
    <p>Full Name: ${userData.name} ${userData.surname}</p>
  `;

  setUIMode(true);
});

logoutButton.addEventListener('click', async () => {
  const res = await fetch("http://localhost:3000/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  if (res.status !== 204) {
    setUIMode(true); // or set false directly if logout returns ok
  } else {
    setUIMode(false);
  }
});
