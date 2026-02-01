export function renderUsersList(users, htmlElement) {
    const usersContainer = htmlElement;
    usersContainer.innerHTML = '';

    if (users.length === 0) {
        usersContainer.innerHTML = '<p>No users found.</p>';
        return;
    }

    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.innerText = "[USERS]"
    fieldset.appendChild(legend)

    const ul = document.createElement('ul');
    ul.id = 'users-list';

    users.forEach(user => {
        const li = document.createElement('li');

        const h3 = document.createElement('h3');
        h3.textContent = `${user.name} "${user.username}" ${user.surname}`;
        li.appendChild(h3);

        user.tournaments.forEach( t => {
            const tournament = document.createElement('p');
            tournament.textContent = `${t.name}`;
            li.appendChild(tournament);
        });

        ul.appendChild(li);
    });

    fieldset.appendChild(ul);
    usersContainer.appendChild(fieldset);

}