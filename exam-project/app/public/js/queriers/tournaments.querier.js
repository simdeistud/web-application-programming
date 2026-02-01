export async function getTournaments(query){
    const res = await fetch(`http://localhost:3000/api/tournaments?q=${encodeURIComponent(query)}`, {
        method: "GET",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return;
    }
    const data = await res.json();
    const tournaments = data.tournaments;

    for (const tournament of tournaments) {
        const resStand = await fetch(`http://localhost:3000/api/tournaments/${tournament._id}/standings`, {
            method: "GET",
        });

        const standingsData = await resStand.json();
        const standings = standingsData.standings;
        tournament.standings = standings;
    }

    return tournaments;
}

export async function getMyTournaments(){
    const res = await fetch(`http://localhost:3000/api/tournaments/my`, {
        method: "GET",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return;
    }
    const data = await res.json();
    const tournaments = data.tournaments;

    for (const tournament of tournaments) {
        const resStand = await fetch(`http://localhost:3000/api/tournaments/${tournament._id}/standings`, {
            method: "GET",
        });

        const standingsData = await resStand.json();
        const standings = standingsData.standings;
        tournament.standings = standings;
    }

    return tournaments;
}