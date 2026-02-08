
import { FORMATIONS } from '../data/formations';

// Generate consistent stats for players with missing data
export const getSimulatedStat = (id, salt) => {
    const str = (id || '') + salt;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return 60 + Math.abs(hash % 39); // 60-98 range
};

export const getPlayerStats = (player) => {
    if (!player) return null;
    const pid = player.idPlayer || player.strPlayer;
    return {
        pac: getSimulatedStat(pid, 'pac'),
        sho: getSimulatedStat(pid, 'sho'),
        pas: getSimulatedStat(pid, 'pas'),
        dri: getSimulatedStat(pid, 'dri'),
        def: getSimulatedStat(pid, 'def'),
        phy: getSimulatedStat(pid, 'phy'),
        rating: player.customRating || (95 + Math.abs(getSimulatedStat(pid, 'r') % 5)) // High ratings for fun
    };
};

export const calculateSquadStats = (squad) => {
    const players = Object.values(squad);
    if (players.length === 0) return null;

    const totals = { pac: 0, sho: 0, pas: 0, dri: 0, def: 0, phy: 0, rating: 0 };

    players.forEach(p => {
        const stats = getPlayerStats(p);
        totals.pac += stats.pac;
        totals.sho += stats.sho;
        totals.pas += stats.pas;
        totals.dri += stats.dri;
        totals.def += stats.def;
        totals.phy += stats.phy;
        totals.rating += stats.rating;
    });

    const count = players.length;
    return {
        pac: Math.round(totals.pac / count),
        sho: Math.round(totals.sho / count),
        pas: Math.round(totals.pas / count),
        dri: Math.round(totals.dri / count),
        def: Math.round(totals.def / count),
        phy: Math.round(totals.phy / count),
        rating: Math.round(totals.rating / count)
    };
};

export const calculateChemistry = (squad, formationId) => {
    const formation = FORMATIONS[formationId];
    if (!formation) return 0;

    let totalScore = 0;
    const playersArr = Object.values(squad);
    const posKeys = Object.keys(squad);

    // 1. Position Chemistry
    posKeys.forEach(key => {
        const player = squad[key];
        const slot = formation.positions.find(p => p.id === key);
        if (!slot || !player) return;

        // Simplify position checking
        // 10 pts for exact or close match
        const pPos = player.strPosition?.toLowerCase() || '';
        const sLabel = slot.label.toLowerCase();

        let posScore = 0;

        if (pPos.includes(sLabel) || sLabel.includes(pPos)) {
            posScore = 10;
        } else if (
            // Defender in defense slot
            (sLabel.includes('b') && pPos.includes('back')) ||
            (sLabel.includes('m') && pPos.includes('midfield')) ||
            (sLabel.includes('t') && pPos.includes('forward')) ||
            (sLabel.includes('w') && pPos.includes('wing'))
        ) {
            posScore = 5;
        } else {
            posScore = 0;
        }

        // 2. Links (Nation/Team)
        // Check if player shares Nation or Team with ANY OTHER player in squad
        let linksScore = 0;
        const hasNationLink = playersArr.some(p => p !== player && p.strNationality === player.strNationality);
        const hasTeamLink = playersArr.some(p => p !== player && p.strTeam === player.strTeam);

        if (hasTeamLink) linksScore += 3;
        else if (hasNationLink) linksScore += 1;

        // Cap individual chem at 10 (FIFA styleish)
        const totalPlayerChem = Math.min(10, posScore + linksScore);
        totalScore += totalPlayerChem;
    });

    // Normalize to 100
    // Max possible is 11 * 10 = 110. Cap at 100.
    return Math.min(100, totalScore);
};

export const getStarRating = (avgRating) => {
    if (!avgRating) return 0;
    if (avgRating >= 80) return 5;
    if (avgRating >= 75) return 4.5;
    if (avgRating >= 70) return 4;
    if (avgRating >= 65) return 3.5;
    if (avgRating >= 60) return 3;
    return 2.5;
};
