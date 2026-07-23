import React from 'react';
import { PackageOpen, AlertCircle, RefreshCw } from 'lucide-react';

export function TableSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem 0' }}>
      {[1, 2, 3].map(i => (
        <div 
          key={i} 
          style={{
            height: '45px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 'var(--radius-sm)',
            animation: 'pulse 1.5s infinite ease-in-out'
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

export function EmptyState({ onAction }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '3rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid var(--border-highlight)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
        color: 'var(--primary-amber)'
      }}>
        <PackageOpen size={28} />
      </div>
      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Nenhuma transação Pix encontrada</h4>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: '360px' }}>
        Você ainda não gerou cobranças Pix hoje. Crie sua primeira transação via API.
      </p>
      {onAction && (
        <button className="btn-nested btn-nested-primary" onClick={onAction} style={{ minHeight: '40px' }}>
          <span>Atualizar lista</span>
        </button>
      )}
    </div>
  );
}

export function ErrorState({ onRetry }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '2.5rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <AlertCircle size={36} style={{ color: '#ef4444', marginBottom: '0.75rem' }} />
      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Não foi possível carregar os dados</h4>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
        Ocorreu uma falha temporária ao conectar com a API da Capivara Pay.
      </p>
      {onRetry && (
        <button className="btn-nested btn-nested-outline" onClick={onRetry} style={{ minHeight: '40px' }}>
          <RefreshCw size={14} /> <span>Tentar novamente</span>
        </button>
      )}
    </div>
  );
}
