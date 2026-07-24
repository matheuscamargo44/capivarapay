import React, { useState } from 'react';
import { ArrowUpRight, Check, X } from 'lucide-react';
import { apiClient } from '../services/apiClient';

export function PayoutModal({ totalBalance }) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState(totalBalance > 0 ? totalBalance : 50.00);
  const [pixKey, setPixKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await apiClient.requestPayout({
        amount: parseFloat(amount),
        pix_key: pixKey
      });
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="btn-nested btn-nested-primary" onClick={() => setIsOpen(true)}>
        <span>Solicitar saque</span>
        <div className="btn-icon-circle">
          <ArrowUpRight size={14} color="#000" />
        </div>
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="bezel-outer" style={{ width: '100%', maxWidth: '420px' }}>
            <div className="bezel-inner" style={{ padding: '1.75rem', position: 'relative' }}>
              <button 
                onClick={() => setIsOpen(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Saque instantâneo via Pix
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Transfira seu saldo disponível diretamente para sua conta bancária.
              </p>

              {success ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#10b981', fontWeight: 700 }}>
                  Saque processado com sucesso.
                </div>
              ) : (
                <form onSubmit={handlePayout}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Chave Pix de destino
                    </label>
                    <input 
                      type="text" 
                      value={pixKey} 
                      onChange={e => setPixKey(e.target.value)}
                      placeholder="CPF, CNPJ, Email ou Chave Aleatória"
                      required
                      style={{
                        width: '100%',
                        background: '#07080d',
                        border: '1px solid var(--border-hairline)',
                        color: '#fff',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-inner)',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      Valor a sacar (R$)
                    </label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={amount} 
                      onChange={e => setAmount(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        background: '#07080d',
                        border: '1px solid var(--border-hairline)',
                        color: 'var(--accent-amber)',
                        fontWeight: 800,
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-inner)',
                        fontSize: '1.1rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn-nested btn-nested-primary" 
                    disabled={loading}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <span>{loading ? 'Processando...' : 'Confirmar saque'}</span>
                    <div className="btn-icon-circle">
                      <Check size={14} color="#000" />
                    </div>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
