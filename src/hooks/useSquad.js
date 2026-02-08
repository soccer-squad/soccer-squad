
import { useState, useEffect } from 'react';

export function useSquad() {
    const [squad, setSquad] = useState(() => {
        const saved = localStorage.getItem('fc26-squad');
        return saved ? JSON.parse(saved) : {};
    });

    const [formation, setFormation] = useState(() => {
        const saved = localStorage.getItem('fc26-formation');
        return saved || '4-4-2';
    });

    useEffect(() => {
        localStorage.setItem('fc26-squad', JSON.stringify(squad));
    }, [squad]);

    useEffect(() => {
        localStorage.setItem('fc26-formation', formation);
    }, [formation]);

    const addPlayer = (positionId, player) => {
        setSquad(prev => ({
            ...prev,
            [positionId]: player
        }));
    };

    const removePlayer = (positionId) => {
        setSquad(prev => {
            const next = { ...prev };
            delete next[positionId];
            return next;
        });
    };

    const resetSquad = () => {
        if (window.confirm('Are you sure you want to reset your squad?')) {
            setSquad({});
        }
    };

    return {
        squad,
        formation,
        setFormation,
        addPlayer,
        removePlayer,
        resetSquad
    };
}
