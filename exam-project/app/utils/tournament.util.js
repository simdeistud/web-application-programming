import { addDays, normalizeToDate, toIsoDate } from "./date.util.js";

export function generateMatchSchedule(tournament) {

    const ROUND_INTERVAL_DAYS = 2;

    if (!tournament || !tournament.details || !Array.isArray(tournament.details.teams)) {
        throw new Error("Invalid tournament: missing details.teams array.");
    }
    const originalTeams = [...tournament.details.teams];
    const startDate = normalizeToDate(tournament.start_date);
    if (Number.isNaN(startDate.getTime())) {
        throw new Error("Invalid start_date.");
    }
    if (originalTeams.length <= 1) {
        return [toIsoDate(startDate)];
    }

    const teams = [...originalTeams];
    if (teams.length % 2 !== 0) teams.push(null); // Add BYE if odd

    const n = teams.length;
    const rounds = n - 1;
    const half = n / 2;

    let arr = [...teams];
    const matches = [];

    for (let r = 0; r < rounds; r++) {
        const roundDate = addDays(startDate, r * ROUND_INTERVAL_DAYS);
        const roundDateISO = toIsoDate(roundDate);

        for (let i = 0; i < half; i++) {
            const home = arr[i];
            const away = arr[n - 1 - i];
            if (home == null || away == null) continue;

            matches.push({
                tournament_id: tournament._id,
                teams: [home, away],
                date: roundDateISO,
                status: "upcoming"
            });
        }

        // rotate (circle method)
        arr = [arr[0], arr[n - 1], ...arr.slice(1, n - 1)];
    }

    return matches;

}

export function getStandings(matches, sport_type) {

    if (!Array.isArray(matches)) throw new Error("matches must be an array");

    const key = String(sport_type || "").toLowerCase();
    const POINT_RULES = {
        football: { win: 3, draw: 1, loss: 0, allowDraw: true },
        basketball: { win: 2, draw: 0, loss: 0, allowDraw: false },
        volleyball: { win: 2, draw: 0, loss: 0, allowDraw: false }
    };
    const rules = POINT_RULES[key] || { win: 2, draw: 0, loss: 0, allowDraw: false };

    // --- Gather all teams (include upcoming so zero-played teams appear) ---
    const teamsSet = new Set();
    for (const m of matches) {
        const t = m?.teams;
        if (Array.isArray(t) && t.length === 2) {
            if (t[0] != null) teamsSet.add(t[0]);
            if (t[1] != null) teamsSet.add(t[1]);
        }
    }

    // --- Initialize table ---
    const table = {};
    for (const team of teamsSet) {
        table[team] = {
            team,
            points: 0,
            played: 0,
            scored: 0,
            conceded: 0,
            difference: 0
        };
    }

    // --- Process played matches only ---
    for (const m of matches) {
        const d = m?.status;
        if (!d || d !== "played") continue;

        const t = m?.teams;
        const s = m?.scores;
        if (!Array.isArray(t) || t.length !== 2) continue;
        if (!Array.isArray(s) || s.length !== 2) continue;

        const [A, B] = t;
        const [a, b] = (s ?? []).map(x => x === "" || x == null ? NaN : Number(x));
        if (A == null || B == null) continue;
        if (typeof a !== "number" || typeof b !== "number" || !Number.isFinite(a) || !Number.isFinite(b)) continue;

        // Ensure teams exist in table (in case a malformed match omitted them before)
        if (!table[A]) table[A] = { team: A, points: 0, played: 0, scored: 0, conceded: 0, difference: 0 };
        if (!table[B]) table[B] = { team: B, points: 0, played: 0, scored: 0, conceded: 0, difference: 0 };

        // Update tallies
        table[A].played += 1;
        table[B].played += 1;

        table[A].scored += a;
        table[A].conceded += b;
        table[B].scored += b;
        table[B].conceded += a;

        // Points allocation
        if (a === b) {
            if (rules.allowDraw) {
                table[A].points += rules.draw;
                table[B].points += rules.draw;
            } // else: draw not allowed (basketball/volleyball) → award 0 to both, but keep played & goals.
        } else if (a > b) {
            table[A].points += rules.win;
            table[B].points += rules.loss;
        } else {
            table[B].points += rules.win;
            table[A].points += rules.loss;
        }
    }

    // --- Finalize differences and return sorted array ---
    const standings = Object.values(table).map(r => ({
        ...r,
        difference: r.scored - r.conceded
    }));

    standings.sort((x, y) => {
        if (y.points !== x.points) return y.points - x.points;              // 1) Points
        if (y.difference !== x.difference) return y.difference - x.difference; // 2) GD
        if (y.scored !== x.scored) return y.scored - x.scored;              // 3) GS
        // 4) Deterministic fallback
        return String(x.team).localeCompare(String(y.team));
    });

    return standings;

}

