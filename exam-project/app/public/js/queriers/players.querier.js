export async function getPlayer(query) {
  const res = await fetch(`http://localhost:3000/api/teams`, { method: "GET" });
  if (!res.ok) {
    // Optionally log/throw; returning [] keeps callers safe
    return [];
  }

  const data = await res.json();
  const teams = Array.isArray(data?.teams) ? data.teams : [];

  const qRaw = (query ?? '').trim();
  if (!qRaw) {
    // No filter: return original teams as-is
    return teams;
  }

  // Diacritics-insensitive + case-insensitive substring match
  const fold = (s) =>
    String(s ?? "")
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase();

  const needle = fold(qRaw);
  const matches = (s) => fold(s).includes(needle);

  // Keep only teams with >=1 matching player,
  // and within them keep only the matching players.
  const filtered = [];
  for (const t of teams) {
    const players = Array.isArray(t.players) ? t.players.filter(
      (p) => matches(p?.name) || matches(p?.surname)
    ) : [];

    if (players.length > 0) {
      filtered.push({
        ...t,
        players, // narrowed to only matching players
      });
    }
  }

  return filtered;
}