import React, { useState } from 'react';
import {
  PieChart, Receipt, Key, Radio, Settings, Check, Clock, RefreshCw
} from 'lucide-react';
import { PayoutModal } from './PayoutModal';
import { TableSkeleton, EmptyState, ErrorState } from './FeedbackStates';

export function DeveloperDashboard({ transactions, totalVolume, totalCount, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const handleRefresh = async () => {
    setLoading(true);
    setHasError(false);
    try {
      if (onRefresh) await onRefresh();
    } catch (e) {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = (transactions || []).filter(t => {
    if (filter === 'PAID') return t.status === 'PAID';
    if (filter === 'PENDING') return t.status === 'PENDING';
    return true;
  });

  return (
    <div style={{
      background: 'var(--bg-oled)',
      borderRadius: 'var(--radius-outer)',
      border: '1px solid var(--border-hairline)',
      padding: '1.75rem',
      overflow: 'hidden'
    }}>
      <div className="dashboard-grid" style={{ marginTop: 0, paddingTop: 0 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div className="dash-menu-item active">
            <PieChart size={18} /> Visao geral
          </div>
          <div className="dash-menu-item">
            <Receipt size={18} /> Vendas Pix
          </div>
          <div className="dash-menu-item">
            <Key size={18} /> Chaves de API
          </div>
          <div className="dash-menu-item">
            <Radio size={18} /> Webhooks
          </div>
          <div className="dash-menu-item">
            <Settings size={18} /> Configuracoes
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Resumo financeiro</h2>
            <PayoutModal totalBalance={totalVolume} />
          </div>

          <div className="dash-stats-grid">
            <div className="bezel-outer">
              <div className="bezel-inner" style={{ padding: '1.25rem 1.4rem' }}>
                <div className="stat-title">Volume hoje</div>
                <div className="stat-val" style={{ color: 'var(--accent-amber)' }}>
                  R$ {totalVolume.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>

            <div className="bezel-outer">
              <div className="bezel-inner" style={{ padding: '1.25rem 1.4rem' }}>
                <div className="stat-title">Vendas aprovadas</div>
                <div className="stat-val">{totalCount}</div>
              </div>
            </div>

            <div className="bezel-outer">
              <div className="bezel-inner" style={{ padding: '1.25rem 1.4rem' }}>
                <div className="stat-title">Taxa de conversao</div>
                <div className="stat-val" style={{ color: 'var(--accent-amber)' }}>98.4%</div>
              </div>
            </div>
          </div>

          <div className="bezel-outer">
            <div className="bezel-inner" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                  Ultimas transacoes Pix
                </h3>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-hairline)' }}>
                    {['ALL', 'PAID', 'PENDING'].map(f => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                          border: 'none',
                          background: filter === f ? 'var(--accent-amber)' : 'transparent',
                          color: filter === f ? '#000' : 'var(--text-secondary)',
                          fontWeight: 700,
                          padding: '0.2rem 0.65rem',
                          fontSize: '0.78rem',
                          borderRadius: 'var(--radius-pill)',
                          cursor: 'pointer'
                        }}
                      >
                        {f === 'ALL' ? 'Todas' : f === 'PAID' ? 'Pagas' : 'Pendentes'}
                      </button>
                    ))}
                  </div>

                  <button className="btn-nested btn-nested-outline" onClick={handleRefresh} disabled={loading} style={{ padding: '0.35rem 0.65rem' }}>
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  </button>
                </div>
              </div>

              {loading ? (
                <TableSkeleton />
              ) : hasError ? (
                <ErrorState onRetry={handleRefresh} />
              ) : filteredTransactions.length === 0 ? (
                <EmptyState onAction={handleRefresh} />
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>TXID</th>
                      <th>Cliente</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th>Data/Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map(tx => (
                      <tr key={tx.id}>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{tx.id}</td>
                        <td>{tx.customer?.email || tx.email}</td>
                        <td><strong>R$ {tx.amount.toFixed(2).replace('.', ',')}</strong></td>
                        <td>
                          {tx.status === 'PAID' ? (
                            <span className="status-badge paid"><Check size={12} /> Pago</span>
                          ) : (
                            <span className="status-badge pending"><Clock size={12} /> Pendente</span>
                          )}
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>{tx.time || tx.created_at || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
