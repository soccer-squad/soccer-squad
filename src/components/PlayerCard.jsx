
import React from 'react';
import '../styles/Card.css';

import { getSimulatedStat } from '../utils/squadUtils';

const PlayerCard = ({ player, onClick, style, showRemove, onRemove, onEdit, printMode }) => { // Added printMode
    if (!player) return null;

    // Helper: Use images.weserv.nl proxy to fix CORS issues for export 
    const getCorsUrl = (url) => {
        if (!url) return null;
        const cleanUrl = url.replace(/^https?:\/\//, '');
        return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&output=png`;
    };

    const rating = player.rating || (95 + Math.abs(getSimulatedStat(player.idPlayer || '0', 'r') % 5));
    const isSpecial = rating >= 90;
    const displayRating = player.customRating || rating;

    // Determine positions and shorter nation names if possible
    const position = player.strPosition ?
        (player.strPosition === 'Goalkeeper' ? 'GK' :
            player.strPosition.includes('Back') ? 'CB' :
                player.strPosition.includes('Midfield') ? 'CM' : 'ST')
        : 'CM';

    const lastName = player.strPlayer.split(' ').pop().toUpperCase();

    // Simple mapping for common football nations to ISO 2 code
    const getNationCode = (nation) => {
        if (!nation) return null;
        const n = nation.toLowerCase();
        const map = {
            'portugal': 'pt', 'argentina': 'ar', 'brazil': 'br', 'france': 'fr',
            'germany': 'de', 'spain': 'es', 'england': 'gb-eng', 'italy': 'it',
            'netherlands': 'nl', 'belgium': 'be', 'usa': 'us', 'uruguay': 'uy',
            'croatia': 'hr', 'morocco': 'ma', 'japan': 'jp', 'south korea': 'kr',
            'senegal': 'sn', 'poland': 'pl', 'sweden': 'se', 'denmark': 'dk',
            'norway': 'no', 'colombia': 'co', 'chile': 'cl', 'mexico': 'mx'
        };
        return map[n] || n.substring(0, 2); // Fallback to first 2 chars
    };

    const nationCode = getNationCode(player.strNationality);
    const flagUrl = nationCode ? `https://flagcdn.com/w40/${nationCode}.png` : null;
    const playerImage = player.strCutout || player.strThumb || player.strRender;

    const textColor = printMode ? '#000' : '#fff';

    return (
        <div
            className={`player-card-container ${isSpecial && !printMode ? 'card-special' : ''} ${printMode ? 'print-mode-card' : ''}`}
            style={{ ...style, color: textColor }}
            onClick={onClick}
        >
            <div className="fut-card-bg" style={{
                background: printMode ? '#fff' : undefined,
                borderColor: printMode ? '#000' : undefined,
                borderWidth: printMode ? '2px' : undefined,
                boxShadow: printMode ? 'none' : undefined,
                color: textColor
            }}>

                {/* Top Section */}
                <div className="card-top-section">

                    <div className="info-column" style={{ color: textColor, textShadow: printMode ? 'none' : undefined }}>
                        <div className="rating">{displayRating}</div>
                        <div className="position" style={{ borderColor: printMode ? '#000' : undefined }}>{position}</div>

                        <div className="nation-flag" title={player.strNationality}>
                            {flagUrl ? (
                                <img
                                    src={getCorsUrl(flagUrl)}
                                    alt={player.strNationality}
                                    crossOrigin="anonymous"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerText = player.strNationality?.substring(0, 3).toUpperCase();
                                    }}
                                />
                            ) : (
                                <span style={{ fontSize: '10px', fontWeight: 'bold', marginTop: '5px' }}>{player.strNationality?.substring(0, 3).toUpperCase()}</span>
                            )}
                        </div>
                    </div>

                    <div className="player-image-container">
                        <img
                            src={getCorsUrl(playerImage) || 'https://via.placeholder.com/150x200?text=?'}
                            alt={player.strPlayer}
                            className="player-cutout"
                            crossOrigin="anonymous"
                            style={{ filter: undefined }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.opacity = 0;
                            }}
                        />
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="card-bottom-section" style={{
                    background: printMode ? 'transparent' : undefined,
                    borderTop: printMode ? '1px solid #000' : undefined
                }}>
                    <div className="player-name" style={{
                        borderColor: printMode ? '#000' : undefined,
                        color: textColor,
                        textShadow: printMode ? 'none' : undefined
                    }}>{lastName}</div>

                    <div className="stat-grid">
                        <div className="stat-item"><span className="val">{getSimulatedStat(player.idPlayer, 'pac')}</span> <span className="label">PAC</span></div>
                        <div className="stat-item"><span className="val">{getSimulatedStat(player.idPlayer, 'dri')}</span> <span className="label">DRI</span></div>
                        <div className="stat-item"><span className="val">{getSimulatedStat(player.idPlayer, 'sho')}</span> <span className="label">SHO</span></div>
                        <div className="stat-item"><span className="val">{getSimulatedStat(player.idPlayer, 'def')}</span> <span className="label">DEF</span></div>
                        <div className="stat-item"><span className="val">{getSimulatedStat(player.idPlayer, 'pas')}</span> <span className="label">PAS</span></div>
                        <div className="stat-item"><span className="val">{getSimulatedStat(player.idPlayer, 'phy')}</span> <span className="label">PHY</span></div>
                    </div>
                </div>

            </div>

            {showRemove && !printMode && (
                <>
                    <button
                        className="remove-btn"
                        onClick={(e) => { e.stopPropagation(); onRemove && onRemove(); }}
                        title="Remove Player"
                    >
                        ✕
                    </button>
                    {onEdit && (
                        <button
                            className="edit-btn"
                            onClick={onEdit}
                            title="Edit Attributes"
                            style={{
                                position: 'absolute',
                                top: '-5px',
                                left: '-5px',
                                background: '#333',
                                color: '#fff',
                                border: '1px solid #555',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                fontSize: '10px',
                                cursor: 'pointer',
                                zIndex: 20
                            }}
                        >
                            ✎
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default PlayerCard;
