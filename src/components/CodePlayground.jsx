import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { HighlightedCode } from '../utils/codeHighlighter';

export function CodePlayground() {
  const [copied, setCopied] = useState(false);

  const rawCode = `import { CapivaraPay } from '@capivarapay/sdk';

const capivara = new CapivaraPay('cap_test_demo_key');

const charge = await capivara.pix.create({
  amount: 29.90,
  description: 'Assinatura Capivara Pro',
  correlation_id: 'ped_98124'
});

console.log(charge.pix_copy_paste);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-shell">
      <div className="code-core">
        <div className="code-header">
          <div className="dot-group">
            <div className="dot-item" style={{ background: '#ef4444' }} />
            <div className="dot-item" style={{ background: '#f59e0b' }} />
            <div className="dot-item" style={{ background: '#10b981' }} />
          </div>
          <span>checkout.js</span>
          <button 
            onClick={handleCopy}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem'
            }}
          >
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
        <pre><HighlightedCode code={rawCode} lang="javascript" /></pre>
      </div>
    </div>
  );
}
