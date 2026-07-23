import React, { useState } from 'react';
import { Copy, Check, Clock, ShieldCheck } from 'lucide-react';

export function PixWidget({ amount = 29.90 }) {
  const [copied, setCopied] = useState(false);
  const pixPayload = `00020126580014br.gov.bcb.pix0136tx_cap_${Math.floor(Math.random() * 90000)}520400005303986540${amount.toFixed(2)}5802BR5912Capivara Pay6009SAO PAULO62070503***6304E8A2`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bezel-outer">
      <div className="bezel-inner widget-bezel-inner" style={{ position: 'relative' }}>

        <div className="widget-header">
          <div className="widget-brand">
            <span style={{ color: 'var(--accent-amber)' }}>Capivara<span style={{ color: '#ffffff' }}>Pay</span></span>
          </div>
          <div style={{ textAlign: 'right', minWidth: 0 }}>
            <div className="amount-label">Valor a pagar</div>
            <div className="amount-val">R$ {amount.toFixed(2).replace('.', ',')}</div>
          </div>
        </div>

        <div className="qr-container">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(pixPayload)}`}
            alt="QR Code Pix Capivara Pay"
          />
        </div>

        <div className="timer-bar">
          <Clock size={14} /> Expirando em <span className="timer-badge">14:59</span>
        </div>

        <div className="copia-cola-box">
          <input
            type="text"
            readOnly
            value={pixPayload}
            className="copia-cola-input"
          />
          <button className="btn-nested btn-nested-primary btn-copy-action" onClick={handleCopy}>
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
            <div className="btn-icon-circle" style={{ width: '22px', height: '22px', flexShrink: 0 }}>
              {copied ? <Check size={12} color="#000" /> : <Copy size={12} color="#000" />}
            </div>
          </button>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <ShieldCheck size={14} color="var(--accent-amber)" /> Processado via Capivara Pay
        </div>
      </div>
    </div>
  );
}
