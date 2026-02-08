
// Pitch coordinates in % (left, top)
// 4-4-2, 4-3-3, 3-5-2, 5-3-2

export const FORMATIONS = {
    '4-4-2': {
        name: '4-4-2 Flat',
        positions: [
            { id: 'gk', label: 'GK', left: 50, top: 93 },
            { id: 'lb', label: 'LB', left: 15, top: 70 },
            { id: 'lcb', label: 'CB', left: 38, top: 75 },
            { id: 'rcb', label: 'CB', left: 62, top: 75 },
            { id: 'rb', label: 'RB', left: 85, top: 70 },
            { id: 'lm', label: 'LM', left: 15, top: 45 },
            { id: 'lcm', label: 'CM', left: 38, top: 50 },
            { id: 'rcm', label: 'CM', left: 62, top: 50 },
            { id: 'rm', label: 'RM', left: 85, top: 45 },
            { id: 'lst', label: 'ST', left: 35, top: 15 },
            { id: 'rst', label: 'ST', left: 65, top: 15 },
        ]
    },
    '4-3-3': {
        name: '4-3-3 Attack',
        positions: [
            { id: 'gk', label: 'GK', left: 50, top: 93 },
            { id: 'lb', label: 'LB', left: 15, top: 70 },
            { id: 'lcb', label: 'CB', left: 38, top: 75 },
            { id: 'rcb', label: 'CB', left: 62, top: 75 },
            { id: 'rb', label: 'RB', left: 85, top: 70 },
            { id: 'lcm', label: 'CM', left: 30, top: 50 },
            { id: 'cam', label: 'CAM', left: 50, top: 40 },
            { id: 'rcm', label: 'CM', left: 70, top: 50 },
            { id: 'lw', label: 'LW', left: 15, top: 20 },
            { id: 'st', label: 'ST', left: 50, top: 15 },
            { id: 'rw', label: 'RW', left: 85, top: 20 },
        ]
    },
    '3-5-2': {
        name: '3-5-2',
        positions: [
            { id: 'gk', label: 'GK', left: 50, top: 93 },
            { id: 'lcb', label: 'CB', left: 25, top: 75 },
            { id: 'cb', label: 'CB', left: 50, top: 80 },
            { id: 'rcb', label: 'CB', left: 75, top: 75 },
            { id: 'lm', label: 'LM', left: 10, top: 50 },
            { id: 'ldm', label: 'CDM', left: 35, top: 60 },
            { id: 'rdm', label: 'CDM', left: 65, top: 60 },
            { id: 'cam', label: 'CAM', left: 50, top: 40 },
            { id: 'rm', label: 'RM', left: 90, top: 50 },
            { id: 'lst', label: 'ST', left: 35, top: 15 },
            { id: 'rst', label: 'ST', left: 65, top: 15 },
        ]
    }
};
