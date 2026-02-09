import React, { useState } from 'react';
import { useSquad } from './hooks/useSquad';

import Pitch from './components/Pitch';
import PlayerSearch from './components/PlayerSearch';
import FormationSelector from './components/FormationSelector';
import SquadStats from './components/SquadStats';
import SquadManager from './components/SquadManager';
import PlayerEditor from './components/PlayerEditor';
import { calculateSquadStats, calculateChemistry } from './utils/squadUtils';
import domToImage from 'dom-to-image';
import './index.css';

function App() {
  const {
    squad, formation, setFormation, addPlayer, removePlayer, resetSquad,
    updatePlayerStats, savedSquads, saveSnapshot, loadSnapshot, deleteSnapshot, importSquad
  } = useSquad();

  const [selectedPosition, setSelectedPosition] = useState(null);
  const [editingPosition, setEditingPosition] = useState(null); // For PlayerEditor
  const [showSquadManager, setShowSquadManager] = useState(false); // For SquadManager
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [fileSize, setFileSize] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const squadStats = calculateSquadStats(squad);
  const chemistry = calculateChemistry(squad, formation);




  const handlePositionClick = (posId) => {
    setSelectedPosition(posId);
  };

  const handlePlayerSelect = (player) => {
    if (selectedPosition) {
      addPlayer(selectedPosition, player);
      setSelectedPosition(null);
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleDownload = async () => {
    const pitch = document.getElementById('export-area');
    if (!pitch) return;

    setIsGenerating(true);
    setDownloadUrl(null);
    setStatusMessage('Rendering High-Res (Letter)...');

    // Letter size (8.5 x 11) proportions
    // Target width for capture is 850px, height 1100px (100 DPI base)
    // Then we scale by 'scale' for high quality
    const targetWidth = 850;
    const targetHeight = 1100;
    const scale = 2; // 2x resolution (1700 x 2200)

    // Force styles during capture
    const options = {
      quality: 0.95,
      width: targetWidth * scale,
      height: targetHeight * scale,
      bgcolor: '#0f0f0f', // Dark background matching app
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${targetWidth}px`,
        height: `${targetHeight}px`,
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0',
        left: '0',
        top: '0'
      },
      cacheBust: true,
    };

    try {
      // Small delay just to be safe
      await new Promise(resolve => setTimeout(resolve, 500));

      const dataUrl = await domToImage.toPng(pitch, options);

      if (!dataUrl || dataUrl.length < 1000) {
        throw new Error("Invalid image generated.");
      }

      setStatusMessage('Saving file...');
      const blob = dataURItoBlob(dataUrl);

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setFileSize(Math.round(blob.size / 1024));
      setStatusMessage('');

    } catch (err) {
      console.error("Export failed:", err);
      setStatusMessage("Error: " + err.message);
      alert("Export failed: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-container" style={{ paddingBottom: '50px' }}>
      <header style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 1000 }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', textShadow: '0 0 20px rgba(0,255,136,0.3)', margin: 0 }}>
          FC 26 <span style={{ color: 'var(--text)' }}>Squad Builder</span>
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '1rem', alignItems: 'center' }}>

          <FormationSelector currentFormation={formation} onChange={setFormation} />
          <button
            onClick={() => setShowSquadManager(true)}
            style={{
              color: '#fff',
              border: '1px solid #fff',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              background: 'transparent'
            }}
          >
            MANAGE / SAVES
          </button>
          <button
            onClick={resetSquad}
            style={{
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              background: 'transparent'
            }}
          >
            RESET SQUAD
          </button>
          <button
            onClick={handleDownload}
            className="download-btn"
            disabled={isGenerating}
            style={{
              background: isGenerating ? '#666' : '#00f2ff',
              color: '#000',
              fontWeight: 'bold',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: isGenerating ? 'wait' : 'pointer',
              fontFamily: 'Oswald, sans-serif',
              fontSize: '14px',
              minWidth: '120px'
            }}
          >
            {isGenerating ? statusMessage || 'PROCESSING...' : 'GENERATE PNG'}
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <div id="export-area" style={{
          width: '850px', // Letter Width
          minHeight: '1100px', // Letter Height
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          background: 'transparent' // Capture uses its own bgcolor
        }}>
          {/* Squad Statistics Panel */}
          {squadStats && (
            <SquadStats stats={squadStats} chemistry={chemistry} />
          )}

          <Pitch
            formationStr={formation}
            squad={squad}
            onPositionClick={handlePositionClick}
            onRemovePlayer={removePlayer}
            onEditPlayer={(posId) => setEditingPosition(posId)}
          />
        </div>
      </main>

      {/* Manual Download Modal */}
      {downloadUrl && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 3000,
          backdropFilter: 'blur(5px)'
        }}>
          <div className="modal-content" style={{
            background: 'var(--surface)',
            padding: '30px',
            borderRadius: '12px',
            border: '2px solid var(--primary)',
            textAlign: 'center',
            boxShadow: '0 0 50px rgba(0,255,136,0.3)',
            maxWidth: '400px'
          }}>
            <h3 style={{ color: '#fff', marginTop: 0 }}>High-Res Image ({fileSize}KB)</h3>

            {/* Preview Image */}
            <div style={{
              margin: '15px 0',
              background: '#222',
              padding: '5px',
              borderRadius: '4px',
              minHeight: '150px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img src={downloadUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', display: 'block' }} />
            </div>

            <a
              href={downloadUrl}
              download={`fc26-squad-${Date.now()}.png`}
              className="save-btn"
              style={{
                display: 'block',
                width: '100%',
                padding: '15px',
                background: 'var(--primary)',
                color: '#000',
                fontWeight: 'bold',
                textDecoration: 'none',
                borderRadius: '8px',
                marginBottom: '15px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
              onClick={() => setTimeout(() => {
                setDownloadUrl(null);
                URL.revokeObjectURL(downloadUrl);
              }, 500)}
            >
              SAVE FILE
            </a>

            <button
              onClick={() => {
                setDownloadUrl(null);
                URL.revokeObjectURL(downloadUrl);
              }}
              style={{
                background: 'transparent',
                border: '1px solid #555',
                color: '#aaa',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {selectedPosition && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(5px)'
        }}
          onClick={() => setSelectedPosition(null)}
        >
          <div className="modal-content" style={{
            background: 'var(--surface)',
            width: '90%', maxWidth: '500px',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            animation: 'slideUp 0.3s ease'
          }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '15px' }}>Select Player for {selectedPosition.toUpperCase()}</h3>
            <PlayerSearch onSelectPlayer={handlePlayerSelect} />
            <button
              onClick={() => setSelectedPosition(null)}
              style={{
                marginTop: '15px',
                width: '100%',
                padding: '10px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showSquadManager && (
        <SquadManager
          squad={squad}
          formation={formation}
          savedSquads={savedSquads}
          onSaveSnapshot={saveSnapshot}
          onLoadSnapshot={(snap) => { loadSnapshot(snap); setShowSquadManager(false); }}
          onDeleteSnapshot={deleteSnapshot}
          onImport={(data) => { importSquad(data); setShowSquadManager(false); }}
          onClose={() => setShowSquadManager(false)}
        />
      )}

      {editingPosition && squad[editingPosition] && (
        <PlayerEditor
          player={squad[editingPosition]}
          onSave={(updatedPlayer) => {
            updatePlayerStats(editingPosition, updatedPlayer);
            setEditingPosition(null);
          }}
          onCancel={() => setEditingPosition(null)}
        />
      )}

      {/* Styles for simple animation */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default App;
