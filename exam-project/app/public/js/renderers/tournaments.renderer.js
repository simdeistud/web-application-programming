export function renderTournamentsList(tournaments, htmlElement) {
    const tournamentsContainer = htmlElement;
    tournamentsContainer.innerHTML = '';

    if (!tournaments || tournaments.length === 0) {
        tournamentsContainer.innerHTML = '<p>No tournaments found.</p>';
        return;
    }

    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.innerText = "[TOURNAMENTS]";
    fieldset.appendChild(legend);

    const ul = document.createElement('ul');
    ul.id = 'tournaments-list';

    tournaments.forEach(tournament => {
        const li = document.createElement('li');

        const h3 = document.createElement('h3');
        h3.textContent = `${tournament.name}`;
        li.appendChild(h3);

        const sport_type = document.createElement('p');
        sport_type.textContent = `Sport: ${tournament.sport_type}`;
        li.appendChild(sport_type);

        const status = document.createElement('p');
        status.textContent = tournament.end_date ? `Status: [concluded]` : "Status: [ongoing]";
        li.appendChild(status);

        const start_date = document.createElement('p');
        start_date.textContent = `Start Date: ${tournament.start_date?.split?.("T")[0] ?? ''}`;
        li.appendChild(start_date);

        if (tournament.end_date) {
            const end_date = document.createElement('p');
            end_date.textContent = `End Date: ${tournament.end_date.split("T")[0]}`;
            li.appendChild(end_date);
        }

        if (tournament.details) {
            if (tournament.details.infomation) {
                const info = document.createElement('p');
                info.textContent = `Info: ${tournament.details.infomation}`;
                li.appendChild(info);
            }

            if (tournament.details.teams) {
                const teams = document.createElement('p');
                teams.textContent = `Partecipating Teams: ${tournament.details.teams}`;
                li.appendChild(teams);
            }
        }

        // --- Standings table (supports arbitrary number of teams) ---
        if (tournament.standings && tournament.standings.length > 0) {
            const title = document.createElement('p');
            title.textContent = "Standings";
            title.style.margin = "10px 0 4px 0";
            title.style.fontWeight = "600";
            li.appendChild(title);

            const table = document.createElement('table');
            table.style.marginTop = "4px";
            table.style.borderCollapse = "collapse";
            table.style.width = "100%";

            const applyCellStyle = (cell) => {
                cell.style.border = "1px solid #ccc";
                cell.style.padding = "4px 6px";
                cell.style.textAlign = "center";
            };

            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            ["Team", "Pts", "Pld", "GF", "GA", "Diff"].forEach(h => {
                const th = document.createElement('th');
                th.textContent = h;
                th.style.background = "#f6f6f6";
                th.style.fontWeight = "600";
                applyCellStyle(th);
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            tournament.standings.forEach(row => {
                const tr = document.createElement('tr');
                [row.team, row.points, row.played, row.scored, row.conceded, row.difference]
                    .forEach(val => {
                        const td = document.createElement('td');
                        td.textContent = val;
                        applyCellStyle(td);
                        tr.appendChild(td);
                    });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);

            li.appendChild(table);
        }
        // --- end standings ---

        ul.appendChild(li);
    });

    fieldset.appendChild(ul);
    tournamentsContainer.appendChild(fieldset);
}


export function renderTournament(tournament, htmlElement) {
    const tournamentContainer = htmlElement;
    tournamentContainer.innerHTML = '';

    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.innerText = `[${tournament.name}]`;
    fieldset.appendChild(legend);

    const sport_type = document.createElement('p');
    sport_type.textContent = `Sport: ${tournament.sport_type}`;
    fieldset.appendChild(sport_type);

    const status = document.createElement('p');
    status.textContent = tournament.end_date ? `Status: [concluded]` : "Status: [ongoing]";
    fieldset.appendChild(status);

    const start_date = document.createElement('p');
    start_date.textContent = `Start Date: ${tournament.start_date.split("T")[0]}`;
    fieldset.appendChild(start_date);

    if (tournament.end_date) {
        const end_date = document.createElement('p');
        end_date.textContent = `End Date: ${tournament.end_date.split("T")[0]}`;
        fieldset.appendChild(end_date);
    }

    if (tournament.details) {
        if (tournament.details.infomation) {
            const info = document.createElement('p');
            info.textContent = `Info: ${tournament.details.infomation}`;
            fieldset.appendChild(info);
        }

        if (tournament.details.teams) {
            const teams = document.createElement('p');
            teams.textContent = `Partecipating Teams: ${tournament.details.teams}`;
            fieldset.appendChild(teams);
        }
    }

    // --- Standings table ---
    if (tournament.standings && tournament.standings.length > 0) {

        const title = document.createElement('p');
        title.textContent = "Standings:";
        title.style.margin = "10px 0 4px 0";
        title.style.fontWeight = "600";
        fieldset.appendChild(title);

        const table = document.createElement('table');
        table.style.marginTop = "4px";
        table.style.borderCollapse = "collapse";
        table.style.width = "100%";

        const applyCellStyle = (cell) => {
            cell.style.border = "1px solid #ccc";
            cell.style.padding = "4px 6px";
            cell.style.textAlign = "center";
        };

        const headerRow = document.createElement('tr');
        ["Team", "Pts", "Pld", "GF", "GA", "Diff"].forEach(h => {
            const th = document.createElement('th');
            th.textContent = h;
            th.style.background = "#f6f6f6";
            th.style.fontWeight = "600";
            applyCellStyle(th);
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Unlimited teams → one table row per element
        tournament.standings.forEach(row => {
            const tr = document.createElement('tr');
            [row.team, row.points, row.played, row.scored, row.conceded, row.difference]
                .forEach(val => {
                    const td = document.createElement('td');
                    td.textContent = val;
                    applyCellStyle(td);
                    tr.appendChild(td);
                });
            table.appendChild(tr);
        });

        fieldset.appendChild(table);
    }
    // --- end standings ---

    tournamentContainer.appendChild(fieldset);
}