
import React from 'react';
import '../styles/Card.css';

const PlayerCard = ({ player, onClick, style, showRemove, onRemove }) => {
    if (!player) return null;

    // Helper: Use images.weserv.nl proxy to fix CORS issues for export 
    // It is generally more robust for handling various image headers than wsrv.nl directly
    const getCorsUrl = (url) => {
        if (!url) return null;
        const cleanUrl = url.replace(/^https?:\/\//, '');
        return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&output=png`;
    };

    // Helper to generate a consistent sub-stat based on string hash
    const getSimulatedStat = (id, salt) => {
        const str = id + salt;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return 60 + Math.abs(hash % 40); // 60-99
    };

    const rating = player.rating || getSimulatedStat(player.idPlayer || player.strPlayer, 'rating') + 20;
    const isSpecial = rating >= 90;
    const displayRating = player.customRating || (95 + Math.abs(getSimulatedStat(player.idPlayer || '0', 'r') % 5));

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

    return (
        <div
            className={`player-card-container ${isSpecial ? 'card-special' : ''}`}
            style={style}
            onClick={onClick}
        >
            <div className="fut-card-bg">

                {/* Top Section: Info Col + Image (Reverted structure) */}
                <div className="card-top-section">

                    <div className="info-column">
                        <div className="rating">{displayRating}</div>
                        <div className="position">{position}</div>

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

                        <div className="club-badge" title={player.strTeam}>
                            {player.strTeamBadge ? (
                                <img src={getCorsUrl(player.strTeamBadge)} alt="Club" crossOrigin="anonymous" />
                            ) : (
                                <span style={{ fontSize: '12px' }}>⚽</span>
                            )}
                        </div>
                    </div>

                    <div className="player-image-container">
                        <img
                            src={getCorsUrl(playerImage) || 'https://via.placeholder.com/150x200?text=?'}
                            alt={player.strPlayer}
                            className="player-cutout"
                            crossOrigin="anonymous"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.opacity = 0;
                            }}
                        />
                    </div>
                </div>

                {/* Bottom Section: Name + Stats */}
                <div className="card-bottom-section">
                    <div className="player-name">{lastName}</div>

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

            {showRemove && (
                <button
                    className="remove-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove && onRemove();
                    }}
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default PlayerCard;
