import React, { useState } from 'react';
import { 
  Play, Check, Copy, ShieldCheck, Terminal, BookOpen, Key, 
  Search, ChevronRight, Server, Zap, Radio 
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { HighlightedCode } from '../utils/codeHighlighter';

export function ApiDocs({ onShowToast }) {
  const [activeLang, setActiveLang] = useState('curl');
  const [activeEndpoint, setActiveEndpoint] = useState('create_charge');
  const [isExecuting, setIsExecuting] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // High-End Code Snippets por Linguagem
  const codeSnippets = {
    curl: `curl -X POST https://api.capivarapay.com/v2/charges/pix \\
  -H "Authorization: Bearer cap_test_demo_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 29.90,
    "description": "Assinatura Capivara Pro",
    "correlation_id": "ped_98124"
  }'`,
    node: `import { CapivaraPay } from '@capivarapay/sdk';

const capivara = new CapivaraPay('cap_test_demo_key');

const charge = await capivara.pix.create({
  amount: 29.90,
  description: 'Assinatura Capivara Pro',
  correlation_id: 'ped_98124'
});`,
    python: `from capivarapay import CapivaraPay

client = CapivaraPay(api_key="cap_test_demo_key")

charge = client.pix.create(
    amount=29.90,
    description="Assinatura Capivara Pro",
    correlation_id="ped_98124"
)`,
    react: `import { usePixCharge } from '@capivarapay/react';

function Checkout() {
  const { createCharge, loading } = usePixCharge();
  
  const handlePay = () => createCharge({ amount: 29.90 });
  return <button onClick={handlePay}>Pagar com Pix</button>;
}`
  };

  const handleExecuteRequest = async () => {
    setIsExecuting(true);
    try {
      // Conecta com a API Express Real
      const data = await apiClient.createCharge({
        amount: 29.90,
        description: 'Demonstração ao Vivo - ApiDocs',
        correlation_id: `corr_docs_${Date.now()}`
      });

      setApiResponse({
        status: 200,
        statusText: 'OK',
        timeMs: Math.floor(Math.random() * 40 + 20),
        data: data
      });

      if (onShowToast) onShowToast('Requisição de API executada com sucesso!', 'success');
    } catch (err) {
      setApiResponse({
        status: 400,
        statusText: 'BAD REQUEST',
        timeMs: 15,
        data: {
          success: false,
          error: {
            code: 'EXECUTION_FAILED',
            message: err.message
          }
        }
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeLang]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="apidocs-grid" style={{
      background: 'var(--bg-oled)',
      borderRadius: 'var(--radius-outer)',
      border: '1px solid var(--border-hairline)',
      overflow: 'hidden'
    }}>
      
      {/* 1. LEFT SIDEBAR: NAVEGAÇÃO DA DOCUMENTAÇÃO */}
      <div className="apidocs-sidebar" style={{
        background: '#080a0e',
        borderRight: '1px solid var(--border-hairline)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Search Input */}
        <div style={{
          position: 'relative',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-hairline)',
          borderRadius: 'var(--radius-pill)',
          padding: '0.4rem 0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Search size={14} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Buscar endpoints..." 
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '0.82rem',
              outline: 'none',
              width: '100%'
            }}
          />
        </div>

        {/* Menu Navigation Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0.4rem 0.5rem' }}>
            Visão geral
          </div>
          <div className="dash-menu-item">
            <BookOpen size={16} /> Introdução
          </div>
          <div className="dash-menu-item">
            <Key size={16} /> Autenticação e chaves
          </div>

          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0.8rem 0.5rem 0.4rem' }}>
            Endpoints Pix
          </div>
          <div 
            className={`dash-menu-item ${activeEndpoint === 'create_charge' ? 'active' : ''}`}
            onClick={() => setActiveEndpoint('create_charge')}
          >
            <span style={{ 
              fontSize: '0.68rem', 
              fontWeight: 800, 
              background: 'rgba(245, 158, 11, 0.2)', 
              color: 'var(--accent-amber)', 
              padding: '2px 6px', 
              borderRadius: '4px' 
            }}>
              POST
            </span>
            <span>Criar cobrança Pix</span>
          </div>

          <div className="dash-menu-item">
            <span style={{ 
              fontSize: '0.68rem', 
              fontWeight: 800, 
              background: 'rgba(255, 255, 255, 0.08)', 
              color: 'var(--text-secondary)', 
              padding: '2px 6px', 
              borderRadius: '4px' 
            }}>
              GET
            </span>
            <span>Listar transações</span>
          </div>

          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0.8rem 0.5rem 0.4rem' }}>
            Eventos assíncronos
          </div>
          <div className="dash-menu-item">
            <Radio size={16} /> Webhooks e HMAC
          </div>
          <div className="dash-menu-item">
            <Server size={16} /> Status dos serviços
          </div>
        </div>

      </div>

      {/* 2. MIDDLE COLUMN: DESCRIÇÃO E PARÂMETROS DO ENDPOINT */}
      <div className="apidocs-body" style={{ padding: '2rem 1.5rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
          <span style={{
            background: 'var(--accent-amber)',
            color: '#000',
            fontWeight: 800,
            fontSize: '0.82rem',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-pill)'
          }}>
            POST
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            /v2/charges/pix
          </span>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Criar cobrança Pix
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Gera uma nova cobrança Pix instantânea com suporte a QR Code dinâmico, código copia-e-cola e disparo de webhook assíncrono.
        </p>

        {/* Parameters Section */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Request Body</span>
          <span className="eyebrow-badge" style={{ margin: 0 }}>application/json</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          {/* Parameter 1 */}
          <div className="bezel-outer">
            <div className="bezel-inner" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-amber)' }}>amount</span>
                <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>Obrigatório</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>float (BRL)</div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Valor da cobrança em Reais. Deve ser maior que R$ 0,00. Exemplo: `29.90`.
              </p>
            </div>
          </div>

          {/* Parameter 2 */}
          <div className="bezel-outer">
            <div className="bezel-inner" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>description</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Opcional</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>string</div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Texto descritivo exibido ao pagador no aplicativo do banco.
              </p>
            </div>
          </div>

          {/* Parameter 3 */}
          <div className="bezel-outer">
            <div className="bezel-inner" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>correlation_id</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Opcional</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>string (Idempotência)</div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Identificador único de pedido do seu sistema para evitar duplicidade de pagamentos.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. RIGHT COLUMN: PLAYGROUND DE CÓDIGO E RESPOSTA AO VIVO */}
      <div className="apidocs-playground" style={{
        background: '#07080c',
        borderLeft: '1px solid var(--border-hairline)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        overflowY: 'auto'
      }}>
        {/* Language Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: 'var(--radius-pill)' }}>
          {[
            { id: 'curl', label: 'cURL' },
            { id: 'node', label: 'Node.js' },
            { id: 'python', label: 'Python' },
            { id: 'react', label: 'React' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveLang(item.id)}
              style={{
                flex: 1,
                border: 'none',
                background: activeLang === item.id ? 'var(--accent-amber)' : 'transparent',
                color: activeLang === item.id ? '#000' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '0.3rem 0',
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Code Terminal */}
        <div className="code-shell">
          <div className="code-core">
            <div className="code-header">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Terminal size={14} color="var(--accent-amber)" /> Payload da requisição
              </span>
              <button 
                onClick={handleCopyCode}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                {copiedCode ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            </div>
            <pre style={{ fontSize: '0.78rem', maxHeight: '240px' }}>
              <HighlightedCode code={codeSnippets[activeLang]} lang={activeLang} />
            </pre>
          </div>
        </div>

        {/* Live Execution Button */}
        <button 
          className="btn-nested btn-nested-primary" 
          onClick={handleExecuteRequest}
          disabled={isExecuting}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <span>{isExecuting ? 'Executando...' : 'Executar requisição ao vivo'}</span>
          <div className="btn-icon-circle">
            <Play size={14} color="#000" />
          </div>
        </button>

        {/* Response Inspector */}
        {apiResponse && (
          <div className="code-shell">
            <div className="code-core" style={{ borderLeft: '3px solid #10b981' }}>
              <div className="code-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                    ● {apiResponse.status} {apiResponse.statusText}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{apiResponse.timeMs}ms</span>
                </div>
              </div>
              <pre style={{ fontSize: '0.78rem', color: '#34d399', maxHeight: '260px' }}>
                {JSON.stringify(apiResponse.data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
