import React, { useState } from 'react';
import { calculateSquadStats, getStarRating } from '../utils/squadUtils';

const SquadManager = ({
    squad,
    formation,
    savedSquads,
    onSaveSnapshot,
    onLoadSnapshot,
    onDeleteSnapshot,
    onImport,
    onClose
}) => {
    const [tab, setTab] = useState('snapshots'); // 'snapshots' or 'import-export'
    const [snapshotName, setSnapshotName] = useState('');
    const [exportUrl, setExportUrl] = useState(null);
    const [exportData, setExportData] = useState(null); // { jsonSnippet }

    const currentStats = calculateSquadStats(squad);
    const currentRating = currentStats ? currentStats.rating : 0;
    const currentStars = getStarRating(currentRating);

    const handleSave = () => {
        if (!snapshotName.trim()) {
            alert('Please enter a name for your squad.');
            return;
        }
        onSaveSnapshot(snapshotName);
        setSnapshotName('');
    };

    const handlePrepareExport = () => {
        try {
            const data = {
                appName: 'FC26-Builder',
                version: '1.0',
                exportedAt: Date.now(),
                squad,
                formation,
            };
            const jsonStr = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });

            if (exportUrl) URL.revokeObjectURL(exportUrl);
            const url = URL.createObjectURL(blob);

            setExportUrl(url);
            // Just show first 200 chars as preview
            setExportData({
                jsonSnippet: jsonStr.substring(0, 300) + '...'
            });
        } catch (err) {
            console.error('Export failed:', err);
            alert('Export failed: ' + err.message);
        }
    };

    const handleFileImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                // Basic validation
                if (!data.squad || !data.formation) {
                    throw new Error('Invalid squad file format.');
                }
                onImport(data);
                alert('Squad imported successfully!');
                onClose();
            } catch (err) {
                alert('Failed to import squad: ' + err.message);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 3000,
            backdropFilter: 'blur(5px)'
        }} onClick={onClose}>
            <div style={{
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '12px',
                width: '600px',
                maxWidth: '90%',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                color: '#fff',
                fontFamily: 'sans-serif',
                overflow: 'hidden'
            }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{ padding: '20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, color: 'var(--primary, #00ff88)' }}>Squad Manager</h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid #333' }}>
                    <button
                        style={{ ...tabStyle, background: tab === 'snapshots' ? '#333' : 'transparent', color: tab === 'snapshots' ? '#fff' : '#888' }}
                        onClick={() => setTab('snapshots')}
                    >
                        Snapshots
                    </button>
                    <button
                        style={{ ...tabStyle, background: tab === 'import-export' ? '#333' : 'transparent', color: tab === 'import-export' ? '#fff' : '#888' }}
                        onClick={() => setTab('import-export')}
                    >
                        Import / Export
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                    {tab === 'snapshots' ? (
                        <>
                            {/* Save New */}
                            <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,255,136,0.05)', borderRadius: '8px', border: '1px solid rgba(0,255,136,0.2)' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Save Current Squad</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder="e.g. Dream Team v1"
                                        value={snapshotName}
                                        onChange={e => setSnapshotName(e.target.value)}
                                        style={{ flex: 1, padding: '8px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
                                    />
                                    <button onClick={handleSave} style={actionBtnStyle}>Save</button>
                                </div>
                            </div>

                            {/* List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {savedSquads.length === 0 && <p style={{ color: '#666', textAlign: 'center' }}>No saved snapshots.</p>}
                                {savedSquads.map(snap => {
                                    // Calculate rating for listing
                                    const stats = calculateSquadStats(snap.squad);
                                    const rating = stats ? stats.rating : 0;
                                    return (
                                        <div key={snap.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#222', borderRadius: '8px', border: '1px solid #333' }}>
                                            <div>
                                                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{snap.name}</div>
                                                <div style={{ fontSize: '12px', color: '#888' }}>
                                                    {new Date(snap.timestamp).toLocaleDateString()} • {snap.formation} • OVR: {rating}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => onLoadSnapshot(snap)} style={{ ...actionBtnStyle, background: '#444' }}>Load</button>
                                                <button onClick={() => onDeleteSnapshot(snap.id)} style={{ ...actionBtnStyle, background: '#442222', color: '#ea9999' }}>Delete</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <div style={{ marginBottom: '40px' }}>
                                <h3 style={{ marginTop: 0 }}>Export Squad</h3>
                                <p style={{ color: '#888', fontSize: '14px' }}>Save your current squad as a JSON file to share with others.</p>

                                {!exportUrl ? (
                                    <button
                                        onClick={handlePrepareExport}
                                        style={{ ...actionBtnStyle, padding: '12px 24px', fontSize: '16px' }}
                                    >
                                        📤 Generate Export Data
                                    </button>
                                ) : (
                                    <div style={{ background: '#222', padding: '15px', borderRadius: '8px', border: '1px solid #444', textAlign: 'left' }}>
                                        <div style={{ color: '#00ff88', fontSize: '12px', marginBottom: '10px', fontWeight: 'bold' }}>JSON PREVIEW:</div>
                                        <pre style={{ margin: 0, fontSize: '10px', color: '#aaa', overflow: 'hidden', whiteSpace: 'pre-wrap' }}>
                                            {exportData?.jsonSnippet}
                                        </pre>

                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
                                            <a
                                                href={exportUrl}
                                                download={`fc26-squad-${Date.now()}.json`}
                                                style={{
                                                    ...actionBtnStyle,
                                                    background: '#00f2ff',
                                                    textDecoration: 'none',
                                                    padding: '15px 30px',
                                                    fontSize: '18px',
                                                    display: 'block',
                                                    width: '100%',
                                                    textAlign: 'center',
                                                    boxShadow: '0 0 20px rgba(0,242,255,0.2)'
                                                }}
                                                onClick={() => {
                                                    // Long delay to ensure download starts
                                                    setTimeout(() => {
                                                        setExportUrl(null);
                                                        setExportData(null);
                                                    }, 3000);
                                                }}
                                            >
                                                💾 SAVE JSON FILE
                                            </a>
                                            <button
                                                onClick={() => { setExportUrl(null); setExportData(null); }}
                                                style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ borderTop: '1px solid #333', paddingTop: '40px' }}>
                                <h3 style={{ marginTop: 0 }}>Import Squad</h3>
                                <p style={{ color: '#888', fontSize: '14px' }}>Load a squad from a JSON file.</p>
                                <label style={{ ...actionBtnStyle, display: 'inline-block', padding: '12px 24px', fontSize: '16px', background: '#333', cursor: 'pointer' }}>
                                    📂 Select File
                                    <input type="file" accept=".json" onChange={handleFileImport} style={{ display: 'none' }} />
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const tabStyle = {
    flex: 1,
    padding: '15px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s'
};

const actionBtnStyle = {
    padding: '8px 16px',
    background: 'var(--primary, #00ff88)',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
};

export default SquadManager;
