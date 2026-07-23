import React from 'react';
import { Zap, ShieldCheck, Cpu } from 'lucide-react';

export function BentoFeatures({ onSelectDocs }) {
  return (
    <section className="bento-section">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Engenharia de pagamentos <span>de alta performance</span>
        </h2>
      </div>

      <div className="bento-grid-3">
        <div className="bezel-outer">
          <div className="bezel-inner">
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid var(--border-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              color: 'var(--accent-amber)'
            }}>
              <Zap size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Confirmação em menos de 800ms</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Webhooks assíncronos de alta disponibilidade com resiliência de entrega e retry automático.
            </p>
          </div>
        </div>

        <div className="bezel-outer">
          <div className="bezel-inner">
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid var(--border-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              color: 'var(--accent-amber)'
            }}>
              <ShieldCheck size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Segurança HMAC SHA-256</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Assinatura criptográfica X-Capivara-Signature em cada evento para proteção anti-spoofing.
            </p>
          </div>
        </div>

        <div className="bezel-outer">
          <div className="bezel-inner">
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid var(--border-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              color: 'var(--accent-amber)'
            }}>
              <Cpu size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Idempotência nativa</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Garantia de transação única por correlation_id evitando duplicação em falhas de rede.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
