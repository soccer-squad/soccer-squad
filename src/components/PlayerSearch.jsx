
import React, { useState, useEffect } from 'react';
import { searchPlayers } from '../data/api';
import { useDebounce } from '../hooks/useDebounce';
import { Search } from 'lucide-react';
import PlayerCard from './PlayerCard';

const PlayerSearch = ({ onSelectPlayer }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const debouncedQuery = useDebounce(query, 500);

    useEffect(() => {
        // Only search if query has changed to something meaningful
        if (debouncedQuery.length < 3) {
            setResults([]);
            return;
        }

        const fetchPlayers = async () => {
            setLoading(true);
            const players = await searchPlayers(debouncedQuery);
            setResults(players || []); // players is null if no results
            setLoading(false);
        };

        fetchPlayers();
    }, [debouncedQuery]);

    return (
        <div className="search-container" style={{ width: '100%', position: 'relative', zIndex: 100 }}>
            <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} size={20} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for players (e.g. Ronaldo)..."
                    style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        background: 'var(--surface)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '16px',
                        outline: 'none'
                    }}
                />
                {loading && <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>...</div>}
            </div>

            {results.length > 0 && (
                <div className="search-results" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'var(--surface)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    marginTop: '8px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                }}>
                    {results.map((player) => (
                        <div
                            key={player.idPlayer}
                            onClick={() => {
                                onSelectPlayer(player);
                                setQuery('');
                                setResults([]);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '10px',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <img
                                src={player.strThumb || player.strCutout || 'https://via.placeholder.com/50'}
                                alt={player.strPlayer}
                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%', marginRight: '10px' }}
                            />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold' }}>{player.strPlayer}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{player.strTeam} - {player.strNationality}</div>
                            </div>
                            <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                                {/* Show a hint of rating? */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlayerSearch;
