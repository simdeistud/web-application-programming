export function renderMatchesList(matches, htmlElement) {
    const matchesContainer = htmlElement;
    matchesContainer.innerHTML = '';

    if (matches.length === 0) {
        matchesContainer.innerHTML = '<p>No matches found.</p>';
        return;
    }

    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.innerText = "[MATCHES]"
    fieldset.appendChild(legend)

    const ul = document.createElement('ul');
    ul.id = 'matches-list';

    matches.forEach(match => {
        const li = document.createElement('li');

        const h3 = document.createElement('h3');
        h3.textContent = `${match.teams[0]} vs ${match.teams[1]}`;
        li.appendChild(h3);

        const dateP = document.createElement('p');
        dateP.textContent = `Scheduled Date: ${match.date}`;
        li.appendChild(dateP);

        const statusP = document.createElement('p');
        statusP.textContent = `Status: ${match.status}`;
        li.appendChild(statusP);

        if (match.status === "played") {
            const resultP = document.createElement('p');
            resultP.textContent = `Result: ${match.scores[0]} - ${match.scores[1]}`;
            li.appendChild(resultP);
        } else if (match.status === "pending") {
            const form = document.createElement("form")
            form.id = "scores-form-" + match._id;

            const label = document.createElement("label")
            label.textContent = "Insert results:";

            const homeScore = document.createElement("input")
            homeScore.type = "number";
            homeScore.placeholder = "Home"
            homeScore.required = true;
            homeScore.id = "home-score-" + match.teams[0];
            const awayScore = document.createElement("input")
            awayScore.type = "number";
            awayScore.placeholder = "Away"
            awayScore.required = true;
            awayScore.id = "away-score-" + match.teams[1];

            const scoreSubmitButton = document.createElement('button');
            scoreSubmitButton.type = 'submit';
            scoreSubmitButton.textContent = '[SUBMIT]';
            scoreSubmitButton.addEventListener("click", async () => {
                const scores = [homeScore.value, awayScore.value];
                const res = await fetch(`http://localhost:3000/api/matches/${match._id}/result`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ scores })
                });

                if (!res.ok) {
                    alert('Failed to add result.');
                    return;
                }
                alert('Result added successfully!');
            });

            form.append(label, homeScore, awayScore, scoreSubmitButton);

            li.appendChild(form);
        }

        ul.appendChild(li);
    });

    fieldset.appendChild(ul);

    matchesContainer.appendChild(fieldset);

}

export function normalizeToDate(d) {
    if (d instanceof Date) return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    const parsed = new Date(d);
    return Number.isNaN(parsed.getTime()) ? new Date(NaN) : parsed;
}

export function addDays(baseDate, days) {
    const r = new Date(baseDate.getTime());
    r.setUTCDate(r.getUTCDate() + days);
    return r;
}

export function toIsoDate(d) {
    return d.toISOString().slice(0, 10);
}