import React, { useState, useEffect } from 'react';
import { getPlayerStats } from '../utils/squadUtils';
import { fetchWikiBio } from '../data/api';

const PlayerDetailsModal = ({ player, onClose, onEdit, onRemove }) => {
    const [wikiBio, setWikiBio] = useState(null);
    const [loadingBio, setLoadingBio] = useState(false);

    useEffect(() => {
        const getBio = async () => {
            if (!player.strDescriptionEN) {
                setLoadingBio(true);
                const bio = await fetchWikiBio(player.strPlayer);
                setWikiBio(bio);
                setLoadingBio(false);
            }
        };
        getBio();
    }, [player]);

    if (!player) return null;

    const stats = getPlayerStats(player);
    const playerImage = player.strCutout || player.strThumb || player.strRender;

    const displayBio = player.strDescriptionEN || wikiBio;

    // ... (styles same as before)

    const modalStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(8px)',
        padding: '20px'
    };

    const contentStyle = {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
        width: '100%',
        maxWidth: '700px',
        maxHeight: '90vh',
        borderRadius: '20px',
        position: 'relative',
        overflowY: 'auto',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column'
    };

    const headerStyle = {
        padding: '30px',
        display: 'flex',
        gap: '30px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        flexWrap: 'wrap'
    };

    const bodyStyle = {
        padding: '30px'
    };

    const statRowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
    };

    const actionBtnStyle = {
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.2s ease'
    };

    return (
        <div style={modalStyle} onClick={onClose}>
            <div style={contentStyle} onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '25px',
                        background: 'transparent',
                        border: 'none',
                        color: '#666',
                        fontSize: '30px',
                        cursor: 'pointer',
                        zIndex: 10
                    }}
                >✕</button>

                <div style={headerStyle}>
                    <div style={{ width: '200px', height: '200px', flexShrink: 0 }}>
                        <img
                            src={playerImage}
                            alt={player.strPlayer}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
                        />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h2 style={{ fontSize: '32px', margin: '0 0 10px 0', fontFamily: 'var(--font-display)' }}>{player.strPlayer}</h2>
                        <div style={{ display: 'flex', gap: '15px', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '15px' }}>
                            <span>{player.strPosition}</span>
                            <span>•</span>
                            <span>{player.strTeam === '_Retired Soccer' || player.strTeam === '_Retired' ? '(Retired)' : player.strTeam}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 15px', borderRadius: '4px' }}>
                                <div style={{ fontSize: '10px', color: '#666' }}>RATING</div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{player.customRating || stats.rating}</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 15px', borderRadius: '4px' }}>
                                <div style={{ fontSize: '10px', color: '#666' }}>NATION</div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{player.strNationality}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={bodyStyle}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
                        {/* Stats Section */}
                        <div>
                            <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '15px', letterSpacing: '2px' }}>ATTRIBUTES</h3>
                            <div style={statRowStyle}><span>PAC</span> <strong>{stats.pac}</strong></div>
                            <div style={statRowStyle}><span>SHO</span> <strong>{stats.sho}</strong></div>
                            <div style={statRowStyle}><span>PAS</span> <strong>{stats.pas}</strong></div>
                            <div style={statRowStyle}><span>DRI</span> <strong>{stats.dri}</strong></div>
                            <div style={statRowStyle}><span>DEF</span> <strong>{stats.def}</strong></div>
                            <div style={statRowStyle}><span>PHY</span> <strong>{stats.phy}</strong></div>
                        </div>

                        {/* Bio Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '15px', letterSpacing: '2px' }}>BIOGRAPHY</h3>
                            <div style={{
                                fontSize: '14px',
                                color: '#aaa',
                                lineHeight: '1.6',
                                marginBottom: '20px',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                paddingRight: '10px',
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#444 transparent'
                            }}>
                                {loadingBio ? (
                                    <span style={{ fontStyle: 'italic', opacity: 0.6 }}>Fetching biographical data...</span>
                                ) : (
                                    displayBio || 'No biographical data available for this player.'
                                )}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
                                <div style={{ fontSize: '13px' }}><span style={{ color: '#666' }}>Born:</span> <span style={{ marginLeft: '10px' }}>{player.dateBorn || 'Unknown'}</span></div>
                                <div style={{ fontSize: '13px' }}><span style={{ color: '#666' }}>Height:</span> <span style={{ marginLeft: '10px' }}>{player.strHeight || 'Unknown'}</span></div>
                                <div style={{ fontSize: '13px' }}><span style={{ color: '#666' }}>Weight:</span> <span style={{ marginLeft: '10px' }}>{player.strWeight || 'Unknown'}</span></div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '40px', display: 'flex', gap: '15px', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                        <button
                            onClick={onRemove}
                            style={{ ...actionBtnStyle, background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', border: '1px solid rgba(255, 68, 68, 0.3)' }}
                        >
                            Remove Player
                        </button>
                        <button
                            onClick={onEdit}
                            style={{ ...actionBtnStyle, background: 'var(--accent)', color: '#000' }}
                        >
                            Edit Attributes ✎
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerDetailsModal;
