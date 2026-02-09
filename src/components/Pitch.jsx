
import React from 'react';
import { FORMATIONS } from '../data/formations';
import PlayerCard from './PlayerCard';

const Pitch = ({ formationStr, squad, onPositionClick, onRemovePlayer, onEditPlayer }) => { // Added onEditPlayer
    const formation = FORMATIONS[formationStr] || FORMATIONS['4-4-2'];

    return (
        <div id="pitch-container" className="pitch-container" style={{
            position: 'relative',
            width: '100%',
            maxWidth: '800px',
            height: '0',
            paddingBottom: '65%', // Aspect ratio for pitch
            background: 'linear-gradient(to bottom, #1d4e28 0%, #2f7a40 50%, #1d4e28 100%)',
            margin: '0 auto',
            borderRadius: '8px',
            boxShadow: '0 0 50px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            border: '4px solid rgba(255,255,255,0.1)'
        }}>
            {/* Field markings */}
            <div style={{
                position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.2)'
            }} />
            <div style={{
                position: 'absolute', top: '50%', left: '50%', width: '15%', paddingTop: '15%',
                border: '2px solid rgba(255,255,255,0.2)', borderRadius: '50%', transform: 'translate(-50%, -50%)'
            }} />
            <div style={{
                position: 'absolute', top: 0, left: '25%', right: '25%', height: '15%',
                border: '2px solid rgba(255,255,255,0.2)', borderTop: 'none'
            }} />
            <div style={{
                position: 'absolute', bottom: 0, left: '25%', right: '25%', height: '15%',
                border: '2px solid rgba(255,255,255,0.2)', borderBottom: 'none'
            }} />

            {/* Players */}
            {formation.positions.map((pos) => {
                const player = squad[pos.id];
                return (
                    <div
                        key={pos.id}
                        style={{
                            position: 'absolute',
                            left: `${pos.left}%`,
                            top: `${pos.top}%`,
                            transform: 'translate(-50%, -50%)',
                            zIndex: 10,
                            width: player ? '14%' : '10%', // Larger if occupied
                            aspectRatio: '0.7',
                            transition: 'all 0.3s ease'
                        }}
                        onClick={() => onPositionClick(pos.id)}
                    >
                        {player ? (
                            <PlayerCard
                                player={player}
                                style={{ width: '100%', height: '100%', fontSize: '0.5em' }} // Scale down
                                showRemove={true}
                                onRemove={() => onRemovePlayer(pos.id)}
                                onEdit={(e) => { e.stopPropagation(); onEditPlayer(pos.id); }} // Pass edit handler
                            />
                        ) : (
                            <div style={{
                                width: '100%', height: '100%',
                                background: 'rgba(0,0,0,0.3)',
                                border: '2px dashed rgba(255,255,255,0.3)',
                                borderRadius: '8px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexDirection: 'column',
                                cursor: 'pointer'
                            }}>
                                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{pos.label}</span>
                                <span style={{ fontSize: '20px' }}>+</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Pitch;
