import React, { useState } from 'react';

export default function SpeedBump() {
  const [accepted, setAccepted] = useState(false);

  if (accepted) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: '#fff', padding: '32px', borderRadius: '12px',
        maxWidth: '500px', width: '90%', textAlign: 'center',
        fontFamily: '"Inter", sans-serif'
      }}>
        <h2 style={{ color: '#e11d48', marginTop: 0 }}>⚠️ Developer Preview</h2>
        <p style={{ color: '#334155', lineHeight: '1.6' }}>
          <strong>OpenCard AU is a strictly open-source technical demonstration.</strong><br/><br/>
          It uses unauthenticated public CDR APIs provided "As Is". 
          It is <strong>not</strong> a financial service, is <strong>not</strong> affiliated with the DSB, ACCC, the Treasury, or any Government entity, and provides <strong>no financial advice</strong>.
        </p>
        <button 
          onClick={() => setAccepted(true)}
          style={{
            marginTop: '20px', padding: '12px 24px', backgroundColor: '#2563eb',
            color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer',
            fontWeight: 'bold', fontSize: '1rem'
          }}>
          I Understand, Proceed to Demo
        </button>
      </div>
    </div>
  );
}
