
import React from 'react';
import { getStarRating } from '../utils/squadUtils';

const SquadStats = ({ stats, chemistry }) => {
    if (!stats) return null;

    const stars = getStarRating(stats.rating);
    const starArray = [];
    for (let i = 1; i <= 5; i++) {
        if (stars >= i) starArray.push('★');
        else if (stars >= i - 0.5) starArray.push('½'); // simplistic half star
        else starArray.push('☆');
    }

    return (
        <div style={{
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '15px 25px',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '30px',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            color: '#fff',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            maxWidth: '900px',
            width: '90%'
        }}>
            {/* Rating Section */}
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Squad Rating</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.rating}</span>
                    <div style={{ color: '#ffd700', fontSize: '20px' }}>
                        {starArray.map((s, i) => <span key={i}>{s}</span>)}
                    </div>
                </div>
            </div>

            {/* Chemistry Section */}
            <div style={{ textAlign: 'center', minWidth: '100px' }}>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Chemistry</div>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <svg width="60" height="60" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="8" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke={chemistry >= 80 ? '#00ff88' : chemistry >= 50 ? '#ffcc00' : '#ff4444'} strokeWidth="8"
                            strokeDasharray={`${chemistry * 2.83} 283`}
                            transform="rotate(-90 50 50)"
                        />
                    </svg>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '20px', fontWeight: 'bold'
                    }}>
                        {chemistry}
                    </div>
                </div>
            </div>

            {/* Attributes Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '15px', flex: 1 }}>
                {[
                    { l: 'PAC', v: stats.pac },
                    { l: 'SHO', v: stats.sho },
                    { l: 'PAS', v: stats.pas },
                    { l: 'DRI', v: stats.dri },
                    { l: 'DEF', v: stats.def },
                    { l: 'PHY', v: stats.phy },
                ].map((item, idx) => (
                    <div key={idx} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: item.v >= 80 ? '#00ff88' : '#fff' }}>{item.v}</div>
                        <div style={{ fontSize: '10px', opacity: 0.6 }}>{item.l}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SquadStats;
