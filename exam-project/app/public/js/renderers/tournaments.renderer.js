export function renderTournamentsList(tournaments, htmlElement) {
    const tournamentsContainer = htmlElement;
    tournamentsContainer.innerHTML = '';

    if (tournaments.length === 0) {
        tournamentsContainer.innerHTML = '<p>No tournaments found.</p>';
        return;
    }

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
        start_date.textContent = `Start Date: ${tournament.start_date.split("T")[0]}`;
        li.appendChild(start_date);

        if(tournament.end_date){
            const end_date = document.createElement('p');
            end_date.textContent = `Start Date: ${tournament.end_date.split("T")[0]}`;
            li.appendChild(end_date);
        }

        if(tournament.details){
            if(tournament.details.infomation){
                const info = document.createElement('p');
                info.textContent = `Info: ${tournament.details.infomation}`;
                li.appendChild(info);
            }

            if(tournament.details.teams){
                const teams = document.createElement('p');
                teams.textContent = `Partecipating Teams: ${tournament.details.teams}`;
                li.appendChild(teams);
            }
        }

        ul.appendChild(li);
    });

    tournamentsContainer.appendChild(ul);

}