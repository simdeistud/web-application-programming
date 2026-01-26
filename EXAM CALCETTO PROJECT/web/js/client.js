const loginButton = document.getElementById('btn-login');
const registerButton = document.getElementById('btn-register');

if (loginButton && registerButton) {
    loginButton.addEventListener('click', () => {
        const frame = document.querySelector('.frame');
        // Inject login form
        frame.innerHTML = `
    <div class="login-wrapper">
      <h2>Login</h2>
      <form id="login-form" autocomplete="on" novalidate>
        <div class="field">
          <label for="username">Username</label>
          <input id="username" name="username" type="text" required />
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input id="password" name="password" type="password" required />
        </div>
        <button id="login-submit" type="submit">Login</button>
      </form>
      <p id="login-error" role="alert" style="color:#c00;display:none;"></p>
    </div>
  `;

    });

    registerButton.addEventListener('click', () => {
        alert('Register button clicked');
    });
}