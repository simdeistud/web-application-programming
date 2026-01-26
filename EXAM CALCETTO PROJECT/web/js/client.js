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
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required />
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required />
                <button id="btn-login-form">[SUBMIT]</button>
            </fieldset>
        </form>
        `;
    });

    registerButton.addEventListener('click', () => {
        const frame = document.querySelector('main');
        // Inject registration form
        frame.innerHTML = `
        <form id="form-register">
            <fieldset>
                <legend>[REGISTER]</legend>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required />
                <label for="first-name">First Name:</label>
                <input type="text" id="first-name" name="first-name" required />
                <label for="last-name">Last Name:</label>
                <input type="text" id="last-name" name="last-name" required />
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required />
                <button id="btn-register-form">[SUBMIT]</button>
            </fieldset>
        </form>
        `;
    });
}