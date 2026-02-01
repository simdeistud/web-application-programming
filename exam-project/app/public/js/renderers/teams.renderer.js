export function renderTeamsList(teams, htmlElement) {
    const teamsContainer = htmlElement;
    teamsContainer.innerHTML = '';

    if (teams.length === 0) {
        teamsContainer.innerHTML = '<p>No teams found.</p>';
        return;
    }

    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.innerText = "[TEAMS]"
    fieldset.appendChild(legend)

    const ul = document.createElement('ul');
    ul.id = 'teams-list';

    teams.forEach(team => {
        const li = document.createElement('li');

        const h3 = document.createElement('h3');
        h3.textContent = `${team.name}`;
        li.appendChild(h3);

        team.players.forEach(p => {
            const player = document.createElement('p');
            const jerseyStr = p.jersey ? `#${p.jersey}` : "";
            player.textContent = `${p.name} ${p.surname} ${jerseyStr}`;
            li.appendChild(player);
        });

        ul.appendChild(li);
    });

    fieldset.appendChild(ul);

    teamsContainer.appendChild(fieldset);

}

export function renderTeam(team, htmlElement) {
    const teamContainer = htmlElement;
    teamContainer.innerHTML = '';

    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.innerText = `[${team.name}]`
    fieldset.appendChild(legend)

    team.players.forEach(p => {
        const player = document.createElement('p');
        const jerseyStr = p.jersey ? `#${p.jersey}` : "";
        player.textContent = `${p.name} ${p.surname} ${jerseyStr}`;
        fieldset.appendChild(player);
    });

    teamContainer.appendChild(fieldset);

}