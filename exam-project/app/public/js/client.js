import { renderFieldsList } from './renderers/field.renderer.js';

const loginButton = document.getElementById('btn-login');
const registerButton = document.getElementById('btn-register');
const myaccountButton = document.getElementById('btn-myaccount');
const logoutButton = document.getElementById('btn-logout');
const searchButton = document.getElementById('btn-search-form');

async function hasSession() {
    const res = await fetch("http://localhost:3000/api/whoami", {
        method: "GET",
        credentials: "include",
    });
    return res.ok;
}

function setUIMode(loggedIn) {
    loginButton.style.display = loggedIn ? 'none' : 'inline';
    registerButton.style.display = loggedIn ? 'none' : 'inline';
    myaccountButton.style.display = loggedIn ? 'inline' : 'none';
    logoutButton.style.display = loggedIn ? 'inline' : 'none';
    document.getElementById('account-features').style.display = loggedIn ? 'inline' : 'none';
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
        frame.innerHTML = `<h2>[WELCOME ${res.body.username}]</h2><p>[YOU ARE NOW LOGGED IN]</p>`;
    });
});

registerButton.addEventListener('click', async () => {
    const frame = document.querySelector('main');
    // Inject registration form
    frame.innerHTML = `
        <form id="form-register">
            <fieldset>
                <legend>[REGISTER]</legend>
                <label for="register-username">Username:</label>
                <input type="text" id="register-username" name="username" required />
                <label for="register-first-name">First Name:</label>
                <input type="text" id="register-first-name" name="first-name" required />
                <label for="register-last-name">Last Name:</label>
                <input type="text" id="register-last-name" name="last-name" required />
                <label for="register-password">Password:</label>
                <input type="password" id="register-password" name="password" required />
                <button id="btn-register-form">[SUBMIT]</button>
            </fieldset>
        </form>
        `;
    const registerFormButton = document.getElementById('btn-register-form');
    if (registerFormButton) {
        registerFormButton.addEventListener('click', async (event) => {
            event.preventDefault();
            // Handle registration form submission
            const username = document.getElementById('register-username').value;
            const firstName = document.getElementById('register-first-name').value;
            const lastName = document.getElementById('register-last-name').value;
            const password = document.getElementById('register-password').value;
            console.log(`Registering with Username: ${username}, First Name: ${firstName}, Last Name: ${lastName}, Password: ${password}`);
            const response = await fetch("http://localhost:3000/api/auth/signup", {
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    name: firstName,
                    surname: lastName,
                    password: password
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(r => r.json())
            console.log(response);
        });
    }
    if (await hasSession()) {
        await setUIMode(true);
        frame.innerHTML = `<h2>[WELCOME BACK]</h2><p>[YOU ARE LOGGED IN]</p>`;
    } else {
        alert('Registration unsuccessful.');
        await setUIMode(false);
    }
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
    const frame = document.querySelector('main');
    frame.innerHTML = `
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
    const frame = document.querySelector('main');
    frame.innerHTML = ``;
});

// Now it only works with fields, but can be extended later
searchButton.addEventListener('click', async () => {
    const query = document.getElementById('search-form-query').value;
    const type = document.getElementById('search-form-type').value;

    const res = await fetch(`http://localhost:3000/api/${type.toLowerCase()}?q=${encodeURIComponent(query)}`, {
        method: "GET",
    });

    const frame = document.querySelector('main');
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        frame.innerHTML = `<p>[ERROR: ${err.error || res.statusText}]</p>`;
        return;
    }

    const data = await res.json();
    renderFieldsList(data.trimmed, frame);

});