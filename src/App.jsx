import React, { useState } from 'react';
import { useSquad } from './hooks/useSquad';

import Pitch from './components/Pitch';
import PlayerSearch from './components/PlayerSearch';
import FormationSelector from './components/FormationSelector';
import SquadStats from './components/SquadStats';
import SquadManager from './components/SquadManager';
import PlayerEditor from './components/PlayerEditor';
import PlayerDetailsModal from './components/PlayerDetailsModal';
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
  const [viewingPosition, setViewingPosition] = useState(null); // For PlayerDetailsModal
  const [showSquadManager, setShowSquadManager] = useState(false); // For SquadManager
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [fileSize, setFileSize] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [printMode, setPrintMode] = useState(true); // Default to print-friendly 
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const squadStats = calculateSquadStats(squad);
  const chemistry = calculateChemistry(squad, formation);




  const handlePositionClick = (posId) => {
    if (squad[posId]) {
      setViewingPosition(posId);
    } else {
      setSelectedPosition(posId);
    }
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
      bgcolor: printMode ? '#ffffff' : '#0f0f0f',
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
              fontSize: '12px',
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
            onClick={() => {
              setDownloadUrl(null);
              setIsExportModalOpen(true);
            }}
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
            printMode={isGenerating && printMode}
          />
        </div>
      </main>

      {/* Export Configuration & Download Modal */}
      {isExportModalOpen && (
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
            maxWidth: '450px',
            width: '90%'
          }}>
            {!downloadUrl && !isGenerating ? (
              <>
                <h3 style={{ color: '#fff', marginTop: 0 }}>Export Squad Image</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                  Generate a high-resolution PNG of your squad (Letter size).
                </p>

                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  textAlign: 'left'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#fff',
                    fontSize: '16px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}>
                    <input
                      type="checkbox"
                      checked={printMode}
                      onChange={(e) => setPrintMode(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    Print Friendly Mode
                  </label>
                  <p style={{ fontSize: '12px', color: '#888', marginTop: '8px', marginLeft: '28px' }}>
                    Removes dark backgrounds and uses black text. Better for printing!
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setIsExportModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: 'transparent',
                      border: '1px solid #555',
                      color: '#aaa',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDownload}
                    style={{
                      flex: 2,
                      padding: '12px',
                      background: 'var(--primary)',
                      color: '#000',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    GENERATE PNG
                  </button>
                </div>
              </>
            ) : isGenerating ? (
              <div style={{ padding: '40px 0' }}>
                <div className="spinner" style={{
                  border: '4px solid rgba(255,255,255,0.1)',
                  borderTop: '4px solid var(--primary)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  margin: '0 auto 20px',
                  animation: 'spin 1s linear infinite'
                }} />
                <h3 style={{ color: '#fff', margin: 0 }}>{statusMessage || 'Processing...'}</h3>
              </div>
            ) : (
              <>
                <h3 style={{ color: '#fff', marginTop: 0 }}>Ready to Save! ({fileSize}KB)</h3>

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
                  onClick={() => {
                    setTimeout(() => {
                      setDownloadUrl(null);
                      setIsExportModalOpen(false);
                      URL.revokeObjectURL(downloadUrl);
                    }, 500);
                  }}
                >
                  SAVE IMAGE
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
                  Back to Settings
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Styles for simple animation */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
