export async function getMatches(tournament, status = "all") {
    const res = await fetch(`http://localhost:3000/api/tournaments/${tournament._id}/matches`);
    const data = await res.json();
    let matches = data.matches;
    if (status == "upcoming") {
        matches = matches.filter(match => match.status === "upcoming" && new Date(match.date) >= new Date());
    } else if (status == "pending") {
        matches = matches.filter(match => match.status === "upcoming" && new Date(match.date) < new Date()).map(match => ({ ...match, status: "pending" }));
    } else if (status == "played") {
        matches = matches.filter(match => match.status === "played");
    }
    return matches;
}