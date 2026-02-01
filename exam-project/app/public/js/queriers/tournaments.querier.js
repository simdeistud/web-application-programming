export async function getTournaments(query){
    const res = await fetch(`http://localhost:3000/api/tournaments?q=${encodeURIComponent(query)}`, {
        method: "GET",
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return;
    }
    const data = await res.json();
    return data.tournaments;
}