const loginButton = document.getElementById('btn-login');
const registerButton = document.getElementById('btn-register');

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
            loginFormButton.addEventListener('click', (event) => {
                event.preventDefault();
                const username = document.getElementById('login-username').value;
                const password = document.getElementById('login-password').value;
                console.log(`Logging in with Username: ${username}, Password: ${password}`);
                fetch("http://localhost:3000/api/auth/signin", {
                    method: "POST",
                    body: JSON.stringify({
                        username: username,
                        password: password
                    }),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                })
                    .then((response) => response.json())
                    .then((json) => console.log(json));
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
            registerFormButton.addEventListener('click', (event) => {
                event.preventDefault();
                // Handle registration form submission
                const username = document.getElementById('register-username').value;
                const firstName = document.getElementById('register-first-name').value;
                const lastName = document.getElementById('register-last-name').value;
                const password = document.getElementById('register-password').value;
                console.log(`Registering with Username: ${username}, First Name: ${firstName}, Last Name: ${lastName}, Password: ${password}`);
                // Add your registration logic here
                fetch("http://localhost:3000/api/auth/signup", {
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
                })
                    .then((response) => response.json())
                    .then((json) => console.log(json));
            });
        }
    });
}