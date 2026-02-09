import React, { useState, useEffect } from 'react';

const PlayerEditor = ({ player, onSave, onCancel }) => {
    const [stats, setStats] = useState({
        pac: 0, sho: 0, pas: 0, dri: 0, def: 0, phy: 0,
        rating: 0
    });

    useEffect(() => {
        if (player) {
            // Initialize with current stats or simulated ones if not present
            // We need a way to get the current stats. 
            // Ideally onSave we pass back the full object with overrides.
            // For now, let's assume the parent passes specific stats or we use the utils.
            // Wait, we can't easily import getPlayerStats here without circular deps if not careful.
            // Let's rely on props or just standard initializing.
            // Actually, let's import the util, it likely doesn't depend on components.
            import('../utils/squadUtils').then(({ getPlayerStats }) => {
                const current = getPlayerStats(player);
                setStats({
                    pac: current.pac,
                    sho: current.sho,
                    pas: current.pas,
                    dri: current.dri,
                    def: current.def,
                    phy: current.phy,
                    rating: current.rating
                });
            });
        }
    }, [player]);

    const handleChange = (key, val) => {
        setStats(prev => ({
            ...prev,
            [key]: parseInt(val) || 0
        }));
    };

    const handleSave = () => {
        onSave({
            ...player,
            customStats: { // Store overrides here
                pac: stats.pac,
                sho: stats.sho,
                pas: stats.pas,
                dri: stats.dri,
                def: stats.def,
                phy: stats.phy,
                rating: stats.rating
            },
            customRating: stats.rating // Top level for easy access
        });
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 4000,
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '12px',
                padding: '24px',
                width: '350px',
                color: '#fff',
                fontFamily: 'sans-serif'
            }}>
                <h3 style={{ marginTop: 0, color: 'var(--primary, #00ff88)' }}>Edit {player.strPlayer}</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <div className="stat-input">
                        <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Overall Rating</label>
                        <input
                            type="number" min="1" max="99"
                            value={stats.rating}
                            onChange={e => handleChange('rating', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div className="stat-input">
                        <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Pace (PAC)</label>
                        <input
                            type="number" min="1" max="99"
                            value={stats.pac}
                            onChange={e => handleChange('pac', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div className="stat-input">
                        <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Shooting (SHO)</label>
                        <input
                            type="number" min="1" max="99"
                            value={stats.sho}
                            onChange={e => handleChange('sho', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div className="stat-input">
                        <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Passing (PAS)</label>
                        <input
                            type="number" min="1" max="99"
                            value={stats.pas}
                            onChange={e => handleChange('pas', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div className="stat-input">
                        <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Dribbling (DRI)</label>
                        <input
                            type="number" min="1" max="99"
                            value={stats.dri}
                            onChange={e => handleChange('dri', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div className="stat-input">
                        <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Defending (DEF)</label>
                        <input
                            type="number" min="1" max="99"
                            value={stats.def}
                            onChange={e => handleChange('def', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div className="stat-input">
                        <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Physical (PHY)</label>
                        <input
                            type="number" min="1" max="99"
                            value={stats.phy}
                            onChange={e => handleChange('phy', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={onCancel}
                        style={{ ...btnStyle, background: '#333', border: '1px solid #444', color: '#fff' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        style={{ ...btnStyle, background: 'var(--primary, #00ff88)', color: '#000', fontWeight: 'bold' }}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '8px',
    background: '#333',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '16px',
    textAlign: 'center'
};

const btnStyle = {
    flex: 1,
    padding: '12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    border: 'none'
};

export default PlayerEditor;
