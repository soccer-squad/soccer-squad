
import React from 'react';
import { FORMATIONS } from '../data/formations';

const FormationSelector = ({ currentFormation, onChange }) => {
    return (
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 50, position: 'relative' }}>
            <label htmlFor="formation" style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>FORMATION</label>
            <select
                id="formation"
                value={currentFormation}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    outline: 'none',
                    fontFamily: 'var(--font-display)' // Use display font for dropdown
                }}
            >
                {Object.keys(FORMATIONS).map(key => (
                    <option key={key} value={key}>{FORMATIONS[key].name}</option>
                ))}
            </select>
        </div>
    );
};

export default FormationSelector;
