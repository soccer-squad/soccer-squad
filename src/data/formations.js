
// Pitch coordinates in % (left, top)
// 4-4-2, 4-3-3, 3-5-2, 5-3-2

export const FORMATIONS = {
    '4-4-2': {
        name: '4-4-2 Flat',
        positions: [
            { id: 'gk', label: 'GK', left: 50, top: 85 },
            { id: 'lb', label: 'LB', left: 15, top: 60 },
            { id: 'lcb', label: 'CB', left: 35, top: 65 },
            { id: 'rcb', label: 'CB', left: 65, top: 65 },
            { id: 'rb', label: 'RB', left: 85, top: 60 },
            { id: 'lm', label: 'LM', left: 15, top: 40 },
            { id: 'lcm', label: 'CM', left: 38, top: 45 },
            { id: 'rcm', label: 'CM', left: 62, top: 45 },
            { id: 'rm', label: 'RM', left: 85, top: 40 },
            { id: 'lst', label: 'ST', left: 35, top: 15 },
            { id: 'rst', label: 'ST', left: 65, top: 15 },
        ]
    },
    '4-3-3': {
        name: '4-3-3 Attack',
        positions: [
            { id: 'gk', label: 'GK', left: 50, top: 85 },
            { id: 'lb', label: 'LB', left: 15, top: 60 },
            { id: 'lcb', label: 'CB', left: 35, top: 65 },
            { id: 'rcb', label: 'CB', left: 65, top: 65 },
            { id: 'rb', label: 'RB', left: 85, top: 60 },
            { id: 'lcm', label: 'CM', left: 30, top: 35 },
            { id: 'cam', label: 'CAM', left: 50, top: 50 },
            { id: 'rcm', label: 'CM', left: 70, top: 35 },
            { id: 'lw', label: 'LW', left: 15, top: 20 },
            { id: 'st', label: 'ST', left: 50, top: 15 },
            { id: 'rw', label: 'RW', left: 85, top: 20 },
        ]
    },
    '3-5-2': {
        name: '3-5-2',
        positions: [
            { id: 'gk', label: 'GK', left: 50, top: 85 },
            { id: 'lcb', label: 'CB', left: 30, top: 65 },
            { id: 'cb', label: 'CB', left: 50, top: 70 },
            { id: 'rcb', label: 'CB', left: 70, top: 65 },
            { id: 'lm', label: 'LM', left: 10, top: 40 },
            { id: 'ldm', label: 'CDM', left: 35, top: 55 },
            { id: 'rdm', label: 'CDM', left: 65, top: 55 },
            { id: 'cam', label: 'CAM', left: 50, top: 45 },
            { id: 'rm', label: 'RM', left: 90, top: 40 },
            { id: 'lst', label: 'ST', left: 35, top: 15 },
            { id: 'rst', label: 'ST', left: 65, top: 15 },
        ]
    }
};
