import { renderFieldsList } from './renderers/field.renderer.js';
import { closeAllMenus } from './ui.js';

const loginButton = document.getElementById('btn-login');
const registerButton = document.getElementById('btn-register');
const myaccountButton = document.getElementById('btn-myaccount');
const logoutButton = document.getElementById('btn-logout');
const searchButton = document.getElementById('btn-search-form');
const myteamsSelector = document.getElementById('select-myteams');
const newteamSelector = document.getElementById('select-newteam');
const mytournamentsSelector = document.getElementById('select-mytournaments');
const newtournamentSelector = document.getElementById('select-newtournament');
const upcomingmatchesSelector = document.getElementById('select-upcomingmatches');
const matcheshistorySelector = document.getElementById('select-matcheshistory');


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

myteamsSelector.addEventListener('click', async () => {
    closeAllMenus();
    const frame = document.querySelector('main');

    const res = await fetch("http://localhost:3000/api/teams", {
        method: "GET",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        frame.innerHTML = `<p>[ERROR: ${err.error || res.statusText}]</p>`;
        return;
    }

    const data = await res.json();
    const teams = data.teams;


    if (teams.length === 0) {
        frame.innerHTML = `<p>[NO TEAMS FOUND]</p>`;
        return;
    }

    const ul = document.createElement('ul');
    ul.className = 'teams-list';
    teams.forEach(team => {
        const li = document.createElement('li');

        const label = document.createElement('label');
        label.textContent = team.name;

        const detailsBtn = document.createElement('button');
        detailsBtn.textContent = '[DETAILS]';
        detailsBtn.addEventListener('click', () => {
            alert(`Team: ${team.name}\nPlayers:\n` + team.players.map(p => `- ${p.name} ${p.surname}` + (p.jersey !== undefined ? ` (#${p.jersey})` : '')).join('\n'));
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '[DELETE]';
        deleteBtn.addEventListener('click', async () => {
            const res = await fetch(`http://localhost:3000/api/teams/${encodeURIComponent(team.name)}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (res.ok) {
                alert(`[TEAM DELETED SUCCESSFULLY]`);
                li.remove();
            } else {
                res.json().then(err => {
                    alert("Error: " + (err.error || res.statusText));
                });
            }
        });

        li.appendChild(label);
        li.appendChild(detailsBtn);
        li.appendChild(deleteBtn);
        ul.appendChild(li);
    });
    frame.innerHTML = `<h2>[MY TEAMS]</h2>`;
    frame.appendChild(ul);

});

newteamSelector.addEventListener('click', async () => {
    closeAllMenus();
    const frame = document.querySelector('main');

    const form = document.createElement('form');
    form.id = 'form-new-team';

    const fieldset = document.createElement('fieldset');
    form.appendChild(fieldset);

    const legend = document.createElement('legend');
    legend.textContent = '[CREATE NEW TEAM]';
    fieldset.appendChild(legend);

    // --- Team name ---
    const labelName = document.createElement('label');
    labelName.htmlFor = 'team-name';
    labelName.textContent = 'Team Name:';
    fieldset.appendChild(labelName);

    const inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.id = 'team-name';
    inputName.name = 'name';
    inputName.required = true;
    fieldset.appendChild(inputName);

    // --- Players block (NEW) ---
    const playersLegend = document.createElement('p');
    playersLegend.className = 'hline';
    playersLegend.textContent = 'Players:';
    fieldset.appendChild(playersLegend);

    const playersContainer = document.createElement('div');
    playersContainer.id = 'players-container';
    fieldset.appendChild(playersContainer);

    // Row factory
    function createPlayerRow() {
        const row = document.createElement('div');
        row.className = 'player-row';
        row.style.display = 'grid';
        row.style.gridTemplateColumns = '1fr 1fr 120px auto';
        row.style.gap = '8px';
        row.style.margin = '6px 0';

        // Name
        const inName = document.createElement('input');
        inName.type = 'text';
        inName.placeholder = 'Name';
        inName.className = 'player-name';
        inName.required = false; // final validation done on submit
        row.appendChild(inName);

        // Surname
        const inSurname = document.createElement('input');
        inSurname.type = 'text';
        inSurname.placeholder = 'Surname';
        inSurname.className = 'player-surname';
        row.appendChild(inSurname);

        // Jersey (optional numeric)
        const inNumber = document.createElement('input');
        inNumber.type = 'number';
        inNumber.placeholder = 'Jersey # (opt)';
        inNumber.min = '0';
        inNumber.step = '1';
        inNumber.className = 'player-number';
        row.appendChild(inNumber);

        // Add button (only visible on last row)
        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'player-add btn'; // reuse your .btn style if desired
        addBtn.textContent = '+';
        row.appendChild(addBtn);

        return row;
    }

    // Ensure only the last row shows the "+" button
    function refreshAddButtons() {
        const rows = playersContainer.querySelectorAll('.player-row');
        rows.forEach((row, idx) => {
            const addBtn = row.querySelector('.player-add');
            if (!addBtn) return;
            addBtn.hidden = idx !== rows.length - 1;
        });
    }

    // Add first empty row
    function addPlayerRow(focus = true) {
        const row = createPlayerRow();
        playersContainer.appendChild(row);
        refreshAddButtons();
        if (focus) row.querySelector('.player-name')?.focus({ preventScroll: true });
    }
    addPlayerRow(true);

    // Handle clicks on the "+" of the last row
    playersContainer.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.player-add');
        if (!addBtn) return;
        addPlayerRow(true);
    });

    // --- Submit button ---
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = '[SUBMIT]';
    fieldset.appendChild(submitButton);

    // Mount form in frame
    frame.innerHTML = '';
    frame.appendChild(form);

    // --- Submit handler: build { name, players } payload ---
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('team-name').value.trim();

        // Collect players (only rows with both name & surname)
        const players = [];
        playersContainer.querySelectorAll('.player-row').forEach((row) => {
            const pname = row.querySelector('.player-name')?.value.trim() || '';
            const psurname = row.querySelector('.player-surname')?.value.trim() || '';
            const pnumRaw = row.querySelector('.player-number')?.value.trim() || '';

            if (pname && psurname) {
                const player = { name: pname, surname: psurname };
                if (pnumRaw !== '') {
                    const n = parseInt(pnumRaw, 10);
                    if (Number.isFinite(n)) player.jersey = n; // optional
                }
                players.push(player);
            }
        });

        // Basic validation: team name required; players optional
        if (!name) {
            alert('[ERROR] Team name is required.');
            document.getElementById('team-name').focus();
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/api/teams", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, players })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                alert("Error: " + (err.error || res.statusText));
                return;
            }

            alert('[TEAM CREATED SUCCESSFULLY]');
            form.reset();
            // Reset players block to a single empty row
            playersContainer.innerHTML = '';
            addPlayerRow(false);
        } catch (err) {
            console.error(err);
            alert('[NETWORK ERROR] Could not create team.');
        }
    });
});

mytournamentsSelector.addEventListener('click', async () => {
    closeAllMenus();

    const res = await fetch("http://localhost:3000/api/tournaments", {
        method: "GET",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        frame.innerHTML = `<p>[ERROR: ${err.error || res.statusText}]</p>`;
        return;
    }

    const data = await res.json();
    const tournaments = data.tournaments;

    const frame = document.querySelector('main');
    if (tournaments.length === 0) {
        frame.innerHTML = `<p>[NO TOURNAMENTS FOUND]</p>`;
        return;
    }

    const ul = document.createElement('ul');
    ul.className = 'tournaments-list';
    tournaments.forEach(tournament => {
        const li = document.createElement('li');

        const label = document.createElement('label');
        label.textContent = tournament.name + ` [${tournament.sport_type}]`;

        const detailsBtn = document.createElement('button');
        detailsBtn.textContent = '[DETAILS]';
        detailsBtn.addEventListener('click', () => {
            alert(`Tournament: ${tournament.name}\nSport Type: ${tournament.sport_type}\nStart Date: ${new Date(tournament.start_date).toLocaleDateString()}\nMax Teams: ${tournament.max_teams}`);
        });

        if (tournament.start_date < Date.now() && !tournament.end_date) {
            const ongoingLabel = document.createElement('span');
            ongoingLabel.textContent = ' [ONGOING]';
            label.appendChild(ongoingLabel);
        }

        if (tournament.start_date > Date.now()) {
            const upcomingLabel = document.createElement('span');
            upcomingLabel.textContent = ' [UPCOMING]';
            label.appendChild(upcomingLabel);
        }

        if (tournament.end_date) {
            const endedLabel = document.createElement('span');
            endedLabel.textContent = ' [ENDED]';
            label.appendChild(endedLabel);
        }

        if (!tournament.details) {
            const draftLabel = document.createElement('span');
            draftLabel.textContent = ' [DRAFT]';
            label.appendChild(draftLabel);

            const generateBtn = document.createElement('button');
            generateBtn.textContent = '[FINALIZE]';
            generateBtn.addEventListener('click', async () => {
                frame.innerHTML = ``;
                const form = document.createElement('form');
                form.id = 'form-finalize-tournament';

                const fieldset = document.createElement('fieldset');
                form.appendChild(fieldset);

                const legend = document.createElement('legend');
                legend.textContent = `[FINALIZE TOURNAMENT: ${tournament.name}]`;
                fieldset.appendChild(legend);

                // --- TEAMS BLOCK ---
                const teamsLegend = document.createElement('p');
                teamsLegend.className = 'hline';
                teamsLegend.textContent = 'Teams:';
                fieldset.appendChild(teamsLegend);

                const teamsContainer = document.createElement('div');
                teamsContainer.id = 'teams-container';
                fieldset.appendChild(teamsContainer);

                // Row factory
                function createTeamRow() {
                    const row = document.createElement('div');
                    row.className = 'team-row';
                    row.style.display = 'grid';
                    row.style.gridTemplateColumns = '1fr 1fr 120px auto';
                    row.style.gap = '8px';
                    row.style.margin = '6px 0';

                    // Name
                    const inName = document.createElement('input');
                    inName.type = 'text';
                    inName.placeholder = 'Name';
                    inName.className = 'team-name';
                    inName.required = true; // final validation done on submit
                    row.appendChild(inName);

                    // Add button (only visible on last row)
                    const addBtn = document.createElement('button');
                    addBtn.type = 'button';
                    addBtn.className = 'team-add-btn'; // reuse your .btn style if desired
                    addBtn.textContent = '+';
                    row.appendChild(addBtn);

                    return row;
                }

                // Ensure only the last row shows the "+" button
                function refreshAddButtons() {
                    const rows = teamsContainer.querySelectorAll('.team-row');
                    rows.forEach((row, idx) => {
                        const addBtn = row.querySelector('.team-add-btn');
                        if (!addBtn) return;
                        addBtn.hidden = idx !== rows.length - 1;
                    });
                }

                // Add first empty row
                function addTeamRow(focus = true) {
                    const row = createTeamRow();
                    teamsContainer.appendChild(row);
                    refreshAddButtons();
                    if (focus) row.querySelector('.team-name')?.focus({ preventScroll: true });
                }
                addTeamRow(true);

                // Handle clicks on the "+" of the last row
                teamsContainer.addEventListener('click', (e) => {
                    const addBtn = e.target.closest('.team-add-btn');
                    if (!addBtn) return;
                    addTeamRow(true);
                });

                

                const submitButton = document.createElement('button');
                submitButton.type = 'submit';
                submitButton.textContent = '[GENERATE MATCH SCHEDULE]';
                fieldset.appendChild(submitButton);
                // Mount form in frame
                frame.appendChild(form);

                // --- Submit handler: build { teams } payload ---
                form.addEventListener('submit', async (event) => {
                    event.preventDefault();

                    // Collect teams (only rows with name)
                    const teams = [];
                    teamsContainer.querySelectorAll('.team-row').forEach((row) => {
                        const tname = row.querySelector('.team-name')?.value.trim() || '';

                        if (tname) {
                            teams.push(tname);
                        }
                    });

                    // Basic validation: at least 2 teams required
                    if (teams.length < 2) {
                        alert('[ERROR] At least 2 teams are required.');
                        return;
                    }

                    try {
                        const resMod = await fetch(`http://localhost:3000/api/tournaments/${encodeURIComponent(tournament._id)}`, {
                            method: "PUT",
                            credentials: "include",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ details: { teams } })
                        });

                        if (!resMod.ok) {
                            const err = await resMod.json().catch(() => ({}));
                            alert("Error: " + (err.error || resMod.statusText));
                            return;
                        }

                        const resGen = await fetch(`http://localhost:3000/api/tournaments/${encodeURIComponent(tournament._id)}/matches/generate`, {
                            method: "POST",
                            credentials: "include",
                            headers: { "Content-Type": "application/json" },
                        });

                        if (!resGen.ok) {
                            const err = await resGen.json().catch(() => ({}));
                            alert("Error: " + (err.error || resGen.statusText));
                            return;
                        }

                        alert('[TOURNAMENT FINALIZED SUCCESSFULLY]');
                        form.reset();
                    } catch (err) {
                        console.error(err);
                        alert('[NETWORK ERROR] Could not finalize tournament.');
                    }
                });
            });
            li.appendChild(generateBtn);
        }

        li.appendChild(label);
        li.appendChild(detailsBtn);
        ul.appendChild(li);
    });
    frame.innerHTML = `<h2>[MY TOURNAMENTS]</h2>`;
    frame.appendChild(ul);

});

newtournamentSelector.addEventListener('click', () => {
    closeAllMenus();
    const frame = document.querySelector('main');
    frame.innerHTML = `<h2>[CREATE NEW TOURNAMENT]</h2>`;

    const form = document.createElement('form');
    form.id = 'form-new-tournament';

    const fieldset = document.createElement('fieldset');
    form.appendChild(fieldset);

    const legend = document.createElement('legend');
    legend.textContent = '[CREATE NEW TOURNAMENT]';
    fieldset.appendChild(legend);

    // --- Tournament Name ---
    const labelName = document.createElement('label');
    labelName.htmlFor = 'tournament-name';
    labelName.textContent = 'Tournament Name:';
    fieldset.appendChild(labelName);

    const inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.id = 'tournament-name';
    inputName.name = 'name';
    inputName.required = true;
    fieldset.appendChild(inputName);

    const inputSport = document.createElement('select');
    inputSport.id = 'tournament-sport-type';
    inputSport.name = 'sport_type';
    inputSport.required = true;

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Select Sport Type --';
    inputSport.appendChild(defaultOption);

    const sportTypes = ['Football', 'Basketball', 'Volleyball'];
    sportTypes.forEach((type) => {
        const option = document.createElement('option');
        option.value = type.toLowerCase();
        option.textContent = type;
        inputSport.appendChild(option);
    });

    fieldset.appendChild(inputSport);

    const inputDate = document.createElement('input');
    inputDate.type = 'date';
    inputDate.id = 'tournament-start-date';
    inputDate.name = 'start_date';
    inputDate.required = true;
    fieldset.appendChild(inputDate);

    const inputMaxTeams = document.createElement('input');
    inputMaxTeams.type = 'number';
    inputMaxTeams.id = 'tournament-max-teams';
    inputMaxTeams.name = 'max_teams';
    inputMaxTeams.required = true;
    fieldset.appendChild(inputMaxTeams);

    // --- Submit button ---
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = '[SUBMIT]';
    fieldset.appendChild(submitButton);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const tournamentData = Object.fromEntries(formData.entries());

        try {
            const res = await fetch("http://localhost:3000/api/tournaments", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tournamentData)
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                alert("Error: " + (err.error || res.statusText));
                return;
            }

            alert('[TOURNAMENT CREATED SUCCESSFULLY]');
            form.reset();
        } catch (err) {
            console.error(err);
            alert('[NETWORK ERROR] Could not create tournament.');
        }
    });

    // Mount form in frame
    frame.appendChild(form);

});

upcomingmatchesSelector.addEventListener('click', () => {
    alert('Upcoming Matches selected (functionality to be implemented)');
});

matcheshistorySelector.addEventListener('click', () => {
    alert('Matches History selected (functionality to be implemented)');
});

// UI interactions (menus, filters, etc.)
import './ui.js';