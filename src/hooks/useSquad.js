
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

    // --- Snapshots / Persistence ---
    const [savedSquads, setSavedSquads] = useState(() => {
        const saved = localStorage.getItem('fc26-snapshots');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('fc26-snapshots', JSON.stringify(savedSquads));
    }, [savedSquads]);

    const saveSnapshot = (name) => {
        const snapshot = {
            id: Date.now(),
            name: name || `Squad ${savedSquads.length + 1}`,
            timestamp: Date.now(),
            squad,
            formation
        };
        setSavedSquads(prev => [snapshot, ...prev]);
    };

    const loadSnapshot = (snapshot) => {
        if (window.confirm(`Load squad "${snapshot.name}"? Unsaved changes will be lost.`)) {
            setSquad(snapshot.squad);
            setFormation(snapshot.formation);
        }
    };

    const deleteSnapshot = (id) => {
        if (window.confirm('Delete this snapshot?')) {
            setSavedSquads(prev => prev.filter(s => s.id !== id));
        }
    };

    const importSquad = (data) => {
        // Basic validation
        if (data && data.squad && data.formation) {
            setSquad(data.squad);
            setFormation(data.formation);
            return true;
        }
        return false;
    };

    const updatePlayerStats = (positionId, updatedPlayer) => {
        setSquad(prev => ({
            ...prev,
            [positionId]: updatedPlayer
        }));
    };

    return {
        squad,
        formation,
        setFormation,
        addPlayer,
        removePlayer,
        resetSquad,
        updatePlayerStats,
        savedSquads,
        saveSnapshot,
        loadSnapshot,
        deleteSnapshot,
        importSquad
    };
}
