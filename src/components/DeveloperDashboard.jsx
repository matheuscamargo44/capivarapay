import React, { useState, useMemo, useCallback } from 'react';
import {
  PieChart, Receipt, Key, Radio, Settings, Check, Clock, RefreshCw, Copy, Plus, Eye, EyeOff
} from 'lucide-react';
import { PayoutModal } from './PayoutModal';
import { TableSkeleton, EmptyState, ErrorState } from './FeedbackStates';

export function DeveloperDashboard({ transactions, totalVolume, totalCount, onRefresh }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [copiedKeyId, setCopiedKeyId] = useState(null);
  const [visibleKeyId, setVisibleKeyId] = useState(null);

  const [apiKeys, setApiKeys] = useState([
    { id: 'key_1', name: 'Produção Principal', token: 'cap_live_8f2a91b4c9e18d0f', type: 'LIVE', created_at: '2026-07-23' },
    { id: 'key_2', name: 'Ambiente de Testes', token: 'cap_test_demo_key_77a9b1c', type: 'TEST', created_at: '2026-07-23' }
  ]);

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      if (onRefresh) await onRefresh();
    } catch (e) {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, [onRefresh]);

  const handleCopyKey = useCallback((keyObj) => {
    navigator.clipboard.writeText(keyObj.token);
    setCopiedKeyId(keyObj.id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  }, []);

  const handleCreateKey = useCallback(() => {
    const isLive = Math.random() > 0.5;
    const prefix = isLive ? 'cap_live_' : 'cap_test_';
    const randomHash = Math.random().toString(36).substring(2, 12);
    const newToken = `${prefix}${randomHash}`;

    const newKey = {
      id: `key_${Date.now()}`,
      name: isLive ? 'Chave de Produção' : 'Chave de Testes',
      token: newToken,
      type: isLive ? 'LIVE' : 'TEST',
      created_at: new Date().toISOString().split('T')[0]
    };

    setApiKeys(prev => [newKey, ...prev]);
  }, []);

  // Memoização das transações filtradas para evitar re-renderizações desnecessárias
  const filteredTransactions = useMemo(() => {
    return (transactions || []).filter(t => {
      if (filter === 'PAID') return t.status === 'PAID';
      if (filter === 'PENDING') return t.status === 'PENDING';
      return true;
    });
  }, [transactions, filter]);

  return (
    <div className="dashboard-outer" style={{
      background: 'var(--bg-oled)',
      borderRadius: 'var(--radius-outer)',
      border: '1px solid var(--border-hairline)',
      padding: '1.75rem',
      overflow: 'hidden'
    }}>
      <div className="dashboard-grid" style={{ marginTop: 0, paddingTop: 0 }}>

        {/* Sidebar Menu - ARIA Tablist */}
        <div className="dash-menu-container" role="tablist" aria-label="Navegação do Dashboard">
          <button 
            role="tab"
            aria-selected={activeTab === 'overview'}
            aria-controls="panel-overview"
            id="tab-overview"
            tabIndex={activeTab === 'overview' ? 0 : -1}
            className={`dash-menu-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
            style={{ border: 'none', background: 'transparent', textAlign: 'left', width: '100%', cursor: 'pointer' }}
          >
            <PieChart size={18} aria-hidden="true" /> Visão geral
          </button>
          
          <button 
            role="tab"
            aria-selected={activeTab === 'sales'}
            aria-controls="panel-sales"
            id="tab-sales"
            tabIndex={activeTab === 'sales' ? 0 : -1}
            className={`dash-menu-item ${activeTab === 'sales' ? 'active' : ''}`}
            onClick={() => setActiveTab('sales')}
            style={{ border: 'none', background: 'transparent', textAlign: 'left', width: '100%', cursor: 'pointer' }}
          >
            <Receipt size={18} aria-hidden="true" /> Vendas Pix
          </button>
          
          <button 
            role="tab"
            aria-selected={activeTab === 'keys'}
            aria-controls="panel-keys"
            id="tab-keys"
            tabIndex={activeTab === 'keys' ? 0 : -1}
            className={`dash-menu-item ${activeTab === 'keys' ? 'active' : ''}`}
            onClick={() => setActiveTab('keys')}
            style={{ border: 'none', background: 'transparent', textAlign: 'left', width: '100%', cursor: 'pointer' }}
          >
            <Key size={18} aria-hidden="true" /> Chaves de API
          </button>
          
          <button 
            role="tab"
            aria-selected={activeTab === 'webhooks'}
            aria-controls="panel-webhooks"
            id="tab-webhooks"
            tabIndex={activeTab === 'webhooks' ? 0 : -1}
            className={`dash-menu-item ${activeTab === 'webhooks' ? 'active' : ''}`}
            onClick={() => setActiveTab('webhooks')}
            style={{ border: 'none', background: 'transparent', textAlign: 'left', width: '100%', cursor: 'pointer' }}
          >
            <Radio size={18} aria-hidden="true" /> Webhooks
          </button>
          
          <button 
            role="tab"
            aria-selected={activeTab === 'settings'}
            aria-controls="panel-settings"
            id="tab-settings"
            tabIndex={activeTab === 'settings' ? 0 : -1}
            className={`dash-menu-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            style={{ border: 'none', background: 'transparent', textAlign: 'left', width: '100%', cursor: 'pointer' }}
          >
            <Settings size={18} aria-hidden="true" /> Configurações
          </button>
        </div>

        {/* Main Dashboard Content Panels */}
        <div key={activeTab} className="view-transition-fade">

          {/* TAB 1: VISÃO GERAL / SALES */}
          {(activeTab === 'overview' || activeTab === 'sales') && (
            <div id="panel-overview" role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
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
                    <div className="stat-title">Taxa de conversão</div>
                    <div className="stat-val" style={{ color: 'var(--accent-amber)' }}>98.4%</div>
                  </div>
                </div>
              </div>

              <div className="bezel-outer">
                <div className="bezel-inner" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                      Últimas transações Pix
                    </h3>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-hairline)' }} role="group" aria-label="Filtro de transações">
                        {['ALL', 'PAID', 'PENDING'].map(f => (
                          <button
                            key={f}
                            onClick={() => setFilter(f)}
                            aria-pressed={filter === f}
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

                      <button 
                        className="btn-nested btn-nested-outline" 
                        onClick={handleRefresh} 
                        disabled={loading} 
                        aria-label="Atualizar lista de transações"
                        style={{ padding: '0.35rem 0.65rem' }}
                      >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
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
                    <div className="table-responsive-wrapper">
                      <table className="data-table" aria-label="Tabela de transações Pix">
                        <thead>
                          <tr>
                            <th scope="col">TXID</th>
                            <th scope="col">Cliente</th>
                            <th scope="col">Valor</th>
                            <th scope="col">Status</th>
                            <th scope="col">Data/Hora</th>
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
                                  <span className="status-badge paid"><Check size={12} aria-hidden="true" /> Pago</span>
                                ) : (
                                  <span className="status-badge pending"><Clock size={12} aria-hidden="true" /> Pendente</span>
                                )}
                              </td>
                              <td style={{ color: 'var(--text-muted)' }}>{tx.time || tx.created_at || ''}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHAVES DE API */}
          {activeTab === 'keys' && (
            <div id="panel-keys" role="tabpanel" aria-labelledby="tab-keys">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Chaves de API e Tokens</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Gerencie suas credenciais para integração com o SDK e API do Capivara Pay.</p>
                </div>
                <button className="btn-nested btn-nested-primary" onClick={handleCreateKey} aria-label="Gerar nova chave de API">
                  <span>Gerar nova chave</span>
                  <div className="btn-icon-circle" aria-hidden="true"><Plus size={14} color="#000" /></div>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {apiKeys.map(key => (
                  <div key={key.id} className="bezel-outer">
                    <div className="bezel-inner" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{key.name}</span>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: key.type === 'LIVE' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                            color: key.type === 'LIVE' ? 'var(--accent-amber)' : 'var(--text-secondary)'
                          }}>
                            {key.type}
                          </span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }} aria-live="polite">
                          {visibleKeyId === key.id ? key.token : `${key.token.substring(0, 9)}...${key.token.slice(-4)}`}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          className="btn-nested btn-nested-outline"
                          onClick={() => setVisibleKeyId(visibleKeyId === key.id ? null : key.id)}
                          aria-label={visibleKeyId === key.id ? "Ocultar valor completo da chave" : "Mostrar valor completo da chave"}
                          style={{ padding: '0.4rem 0.65rem' }}
                        >
                          {visibleKeyId === key.id ? <EyeOff size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}
                        </button>
                        <button
                          className="btn-nested btn-nested-primary"
                          onClick={() => handleCopyKey(key)}
                          aria-label={`Copiar chave ${key.name}`}
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                        >
                          <span>{copiedKeyId === key.id ? 'Copiada' : 'Copiar'}</span>
                          <div className="btn-icon-circle" style={{ width: '20px', height: '20px' }} aria-hidden="true">
                            {copiedKeyId === key.id ? <Check size={12} color="#000" /> : <Copy size={12} color="#000" />}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WEBHOOKS */}
          {activeTab === 'webhooks' && (
            <div id="panel-webhooks" role="tabpanel" aria-labelledby="tab-webhooks" className="bezel-outer">
              <div className="bezel-inner" style={{ padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Configuração de Webhooks</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                  Receba notificações assíncronas em tempo real com validação de assinatura HMAC SHA-256 no cabeçalho <code>X-Capivara-Signature</code>.
                </p>

                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="webhook-endpoint-input" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    URL do seu servidor (Endpoint de recebimento)
                  </label>
                  <input
                    id="webhook-endpoint-input"
                    type="url"
                    defaultValue="https://meusite.com/api/webhooks/pix"
                    aria-describedby="webhook-hint"
                    style={{
                      width: '100%',
                      background: '#07080d',
                      border: '1px solid var(--border-hairline)',
                      color: '#fff',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-inner)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  <div id="webhook-hint" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Endereço HTTPS público preparado para receber requisições POST em JSON.
                  </div>
                </div>

                <button className="btn-nested btn-nested-primary" style={{ padding: '0.5rem 1.25rem' }}>
                  Salvar Webhook
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: CONFIGURAÇÕES */}
          {activeTab === 'settings' && (
            <div id="panel-settings" role="tabpanel" aria-labelledby="tab-settings" className="bezel-outer">
              <div className="bezel-inner" style={{ padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Configurações do Gateway</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                  Gerencie o comportamento de saques automáticos, limites Pix e credenciais do PSP parceiro.
                </p>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Integração BYOK (Bring Your Own Keys) configurada via variáveis de ambiente no servidor AWS EC2.
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
