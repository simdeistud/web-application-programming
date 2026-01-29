const loginButton = document.getElementById('btn-login');
const registerButton = document.getElementById('btn-register');
const myaccountButton = document.getElementById('btn-myaccount');
const logoutButton = document.getElementById('btn-logout');
let accessToken = null

if (loginButton && registerButton) {
    loginButton.addEventListener('click', () => {
        const frame = document.querySelector('main');
        // Inject login form
        frame.innerHTML = `
        <form id="form-login">
            <fieldset>
                <legend>[LOGIN]</legend>
                <label for="login-username">Username:</label>
                <input type="text" id="login-username" name="username" required />
                <label for="login-password">Password:</label>
                <input type="password" id="login-password" name="password" required />
                <button id="btn-login-form">[SUBMIT]</button>
            </fieldset>
        </form>
        `;
        const loginFormButton = document.getElementById('btn-login-form');
        if (loginFormButton) {
            loginFormButton.addEventListener('click', async (event) => {
                event.preventDefault();
                const username = document.getElementById('login-username').value;
                const password = document.getElementById('login-password').value;
                console.log(`Logging in with Username: ${username}, Password: ${password}`);
                const response = await fetch("http://localhost:3000/api/auth/signin", {
                    method: "POST",
                    body: JSON.stringify({
                        username: username,
                        password: password
                    }),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
                if (response.ok) {
                    accessToken = (await response.json()).token;
                    console.log("Login successful, access token stored.");
                } else {
                    alert("Error: " + (await response.json()).error);
                    console.error("Login failed.");
                }
            });
        }
    });

    registerButton.addEventListener('click', () => {
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
                // Add your registration logic here
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
    });
}

if (myaccountButton && logoutButton) {
    myaccountButton.addEventListener('click', async () => {
        if (!accessToken) {
            alert("You must be logged in to access your account.");
            return;
        }
        const response = await fetch("http://localhost:3000/api/whoami", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        if (response.ok) {
            const userData = await response.json();
            const frame = document.querySelector('main');
            frame.innerHTML = `
            <h2>My Account</h2>
            <p>Username: ${userData.username}</p>
            <p>Full Name: ${userData.name} ${userData.surname}</p>
            `;
        } else {
            alert("Error: " + (await response.json()).error);
        }

        logoutButton.addEventListener('click', () => {
        accessToken = null;
        alert("You have been logged out.");
    });
    });
}