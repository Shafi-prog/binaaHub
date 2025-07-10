import React from 'react';

const Settings: React.FC = () => {
  // Placeholder for settings
  return (
    <div style={{ maxWidth: 480, margin: '32px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 24 }}>
      <h2>POS Settings</h2>
      <div style={{ marginBottom: 16 }}>
        <label>
          <span style={{ marginRight: 8 }}>Printer:</span>
          <select>
            <option>Default Printer</option>
            <option>Thermal Printer</option>
          </select>
        </label>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>
          <span style={{ marginRight: 8 }}>Currency:</span>
          <select>
            <option>SAR</option>
            <option>USD</option>
          </select>
        </label>
      </div>
      <button style={{ padding: '8px 16px', borderRadius: 4, background: '#222', color: '#fff', border: 'none' }}>Save Settings</button>
    </div>
  );
};

export default Settings;
