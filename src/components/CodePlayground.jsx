import React, { useState } from 'react';
import { Copy, Check, Code, Zap } from 'lucide-react';
import { HighlightedCode } from '../utils/codeHighlighter';

export function CodePlayground() {
  const [activeTab, setActiveTab] = useState('script');
  const [copied, setCopied] = useState(false);

  const snippets = {
    script: `<!-- Integração em 1 linha HTML (Sem código backend) -->
<script 
  src="https://d18c33zvi7gwez.cloudfront.net/checkout.js" 
  data-key="cap_test_demo_key" 
  data-amount="29.90"
  data-description="Assinatura Capivara Pro"
></script>`,
    react: `// Componente React Drop-in Pronto
import { CapivaraCheckout } from '@capivarapay/react';

export function ComponentePagamento() {
  return (
    <CapivaraCheckout 
      apiKey="cap_test_demo_key"
      amount={29.90}
      description="Assinatura Capivara Pro"
      onSuccess={(charge) => alert('Pix recebido!')}
    />
  );
}`,
    node: `// Node.js / Express SDK
import { CapivaraPay } from '@capivarapay/sdk';

const capivara = new CapivaraPay('cap_test_demo_key');

const charge = await capivara.pix.create({
  amount: 29.90,
  description: 'Assinatura Capivara Pro',
  correlation_id: 'ped_98124'
});`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-shell">
      <div className="code-core">
        {/* Header com Seletor de Linguagens para Integração Rápida */}
        <div className="code-header" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
          <div className="dot-group" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <div className="dot-item" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
            <div className="dot-item" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <div className="dot-item" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
          </div>

          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '2px', borderRadius: 'var(--radius-pill)' }}>
            <button
              onClick={() => setActiveTab('script')}
              style={{
                border: 'none',
                background: activeTab === 'script' ? 'var(--accent-amber)' : 'transparent',
                color: activeTab === 'script' ? '#000' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer'
              }}
            >
              1 Linha HTML
            </button>
            <button
              onClick={() => setActiveTab('react')}
              style={{
                border: 'none',
                background: activeTab === 'react' ? 'var(--accent-amber)' : 'transparent',
                color: activeTab === 'react' ? '#000' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer'
              }}
            >
              React Drop-in
            </button>
            <button
              onClick={() => setActiveTab('node')}
              style={{
                border: 'none',
                background: activeTab === 'node' ? 'var(--accent-amber)' : 'transparent',
                color: activeTab === 'node' ? '#000' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer'
              }}
            >
              Node.js
            </button>
          </div>

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

        <pre><HighlightedCode code={snippets[activeTab]} lang="javascript" /></pre>
      </div>
    </div>
  );
}
