import React, { useState } from 'react';
import { 
  Play, Check, Copy, Terminal, BookOpen, Key, 
  Search, Server, Radio, ShieldCheck, ArrowRight
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { HighlightedCode } from '../utils/codeHighlighter';

export function ApiDocs({ onShowToast }) {
  const [activeLang, setActiveLang] = useState('curl');
  const [activeEndpointId, setActiveEndpointId] = useState('create_charge');
  const [isExecuting, setIsExecuting] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Definição dos Endpoints reais da API
  const endpointsData = {
    create_charge: {
      id: 'create_charge',
      method: 'POST',
      path: '/v1/charges',
      title: 'Criar cobrança',
      description: 'Gera uma nova cobrança Pix instantânea com suporte a QR Code dinâmico, código copia e cola e disparo de webhook assíncrono.',
      bodyLabel: 'Corpo da requisição',
      contentType: 'application/json',
      params: [
        { name: 'amount', type: 'float (BRL)', required: true, desc: 'Valor da cobrança em Reais. Deve ser entre R$ 0,50 e R$ 50.000,00. Exemplo: 29.90.' },
        { name: 'description', type: 'string', required: false, desc: 'Texto descritivo exibido ao pagador no aplicativo do banco.' },
        { name: 'correlation_id', type: 'string (Idempotência)', required: false, desc: 'Identificador único de pedido do seu sistema para evitar duplicidade de pagamentos.' }
      ],
      codeSnippets: {
        curl: `curl -X POST https://api.capivarapay.com/api/v1/charges \\
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
      }
    },
    list_charges: {
      id: 'list_charges',
      method: 'GET',
      path: '/v1/charges',
      title: 'Listar cobranças',
      description: 'Retorna uma lista com todas as cobranças geradas ordenadas por data de criação.',
      bodyLabel: 'Parâmetros de consulta',
      contentType: 'URL Query',
      params: [
        { name: 'status', type: 'string', required: false, desc: 'Filtra cobranças por status (PENDING, PAID, EXPIRED).' },
        { name: 'limit', type: 'integer', required: false, desc: 'Número máximo de registros a retornar (padrão: 50).' }
      ],
      codeSnippets: {
        curl: `curl -X GET https://api.capivarapay.com/api/v1/charges \\
  -H "Authorization: Bearer cap_test_demo_key"`,
        node: `import { CapivaraPay } from '@capivarapay/sdk';

const capivara = new CapivaraPay('cap_test_demo_key');
const charges = await capivara.pix.list();`,
        python: `from capivarapay import CapivaraPay

client = CapivaraPay(api_key="cap_test_demo_key")
charges = client.pix.list()`,
        react: `import { usePixHistory } from '@capivarapay/react';

function History() {
  const { charges } = usePixHistory();
  return <div>Total: {charges.length}</div>;
}`
      }
    },
    get_charge: {
      id: 'get_charge',
      method: 'GET',
      path: '/v1/charges/:id',
      title: 'Buscar cobrança por ID',
      description: 'Retorna os detalhes completos e o status atualizado de uma cobrança específica.',
      bodyLabel: 'Parâmetros de rota',
      contentType: 'URL Path',
      params: [
        { name: 'id', type: 'string', required: true, desc: 'Identificador único da cobrança (ex: tx_cap_8f912a).' }
      ],
      codeSnippets: {
        curl: `curl -X GET https://api.capivarapay.com/api/v1/charges/tx_cap_8f912a \\
  -H "Authorization: Bearer cap_test_demo_key"`,
        node: `const charge = await capivara.pix.get('tx_cap_8f912a');`,
        python: `charge = client.pix.get('tx_cap_8f912a')`,
        react: `import { usePixCharge } from '@capivarapay/react';

function ChargeStatus({ id }) {
  const { charge } = usePixCharge(id);
  return <div>Status: {charge?.status}</div>;
}`
      }
    },
    pay_charge: {
      id: 'pay_charge',
      method: 'POST',
      path: '/v1/charges/:id/pay',
      title: 'Simular pagamento Pix',
      description: 'Altera o status da cobrança para PAID e simula o disparo de webhook assíncrono.',
      bodyLabel: 'Corpo da requisição',
      contentType: 'application/json',
      params: [
        { name: 'webhook_url', type: 'string', required: false, desc: 'URL opcional para disparo de teste do evento pix.payment.succeeded.' }
      ],
      codeSnippets: {
        curl: `curl -X POST https://api.capivarapay.com/api/v1/charges/tx_cap_8f912a/pay \\
  -H "Authorization: Bearer cap_test_demo_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "webhook_url": "https://meusite.com/api/webhooks/pix"
  }'`,
        node: `const result = await capivara.pix.markAsPaid('tx_cap_8f912a');`,
        python: `result = client.pix.mark_as_paid('tx_cap_8f912a')`,
        react: `const result = await capivara.pix.markAsPaid('tx_cap_8f912a');`
      }
    },
    create_payout: {
      id: 'create_payout',
      method: 'POST',
      path: '/v1/payouts',
      title: 'Solicitar saque',
      description: 'Realiza uma transferência Pix de saída para a chave financeira de destino informada.',
      bodyLabel: 'Corpo da requisição',
      contentType: 'application/json',
      params: [
        { name: 'amount', type: 'float (BRL)', required: true, desc: 'Valor a ser transferido em Reais.' },
        { name: 'pix_key', type: 'string', required: true, desc: 'Chave Pix de destino (CPF, CNPJ, E-mail, Telefone ou Aleatória).' },
        { name: 'pix_key_type', type: 'string', required: false, desc: 'Tipo da chave Pix. Exemplo: CPF.' }
      ],
      codeSnippets: {
        curl: `curl -X POST https://api.capivarapay.com/api/v1/payouts \\
  -H "Authorization: Bearer cap_live_8f2a91b4" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 150.00,
    "pix_key": "12345678900",
    "pix_key_type": "CPF"
  }'`,
        node: `const payout = await capivara.payouts.create({
  amount: 150.00,
  pix_key: '12345678900',
  pix_key_type: 'CPF'
});`,
        python: `payout = client.payouts.create(
    amount=150.00,
    pix_key="12345678900",
    pix_key_type="CPF"
)`,
        react: `const payout = await capivara.payouts.create({ amount: 150.00 });`
      }
    },
    list_keys: {
      id: 'list_keys',
      method: 'GET',
      path: '/v1/keys',
      title: 'Listar chaves de API',
      description: 'Retorna a lista de chaves secretas de produção e homologação cadastradas.',
      bodyLabel: 'Parâmetros',
      contentType: 'Nenhum',
      params: [],
      codeSnippets: {
        curl: `curl -X GET https://api.capivarapay.com/api/v1/keys \\
  -H "Authorization: Bearer cap_live_8f2a91b4"`,
        node: `const keys = await capivara.keys.list();`,
        python: `keys = client.keys.list()`,
        react: `const keys = await capivara.keys.list();`
      }
    },
    create_key: {
      id: 'create_key',
      method: 'POST',
      path: '/v1/keys',
      title: 'Gerar nova chave de API',
      description: 'Cria uma nova chave secreta nos ambientes de Produção (cap_live_...) ou Teste (cap_test_...).',
      bodyLabel: 'Corpo da requisição',
      contentType: 'application/json',
      params: [
        { name: 'name', type: 'string', required: false, desc: 'Identificação amigável da chave.' },
        { name: 'type', type: 'string (LIVE ou TEST)', required: false, desc: 'Tipo do ambiente. Exemplo: LIVE.' }
      ],
      codeSnippets: {
        curl: `curl -X POST https://api.capivarapay.com/api/v1/keys \\
  -H "Authorization: Bearer cap_live_8f2a91b4" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Nova Chave Produção",
    "type": "LIVE"
  }'`,
        node: `const newKey = await capivara.keys.create({ name: 'Nova Chave', type: 'LIVE' });`,
        python: `new_key = client.keys.create(name='Nova Chave', type='LIVE')`,
        react: `const newKey = await capivara.keys.create({ name: 'Nova Chave', type: 'LIVE' });`
      }
    },
    health: {
      id: 'health',
      method: 'GET',
      path: '/v1/health',
      title: 'Status dos serviços',
      description: 'Retorna o status operacional do gateway e timestamp do servidor.',
      bodyLabel: 'Parâmetros',
      contentType: 'Nenhum',
      params: [],
      codeSnippets: {
        curl: `curl -X GET https://api.capivarapay.com/api/v1/health`,
        node: `const status = await capivara.health();`,
        python: `status = client.health()`,
        react: `const status = await capivara.health();`
      }
    }
  };

  const currentEndpoint = endpointsData[activeEndpointId] || endpointsData.create_charge;

  const handleExecuteRequest = async () => {
    setIsExecuting(true);
    try {
      if (currentEndpoint.id === 'create_charge') {
        const data = await apiClient.createCharge({
          amount: 29.90,
          description: 'Demonstração ao Vivo - ApiDocs',
          correlation_id: `corr_docs_${Date.now()}`
        });
        setApiResponse({ status: 201, statusText: 'CREATED', timeMs: Math.floor(Math.random() * 30 + 15), data });
      } else if (currentEndpoint.id === 'list_charges') {
        const data = await apiClient.listCharges();
        setApiResponse({ status: 200, statusText: 'OK', timeMs: 22, data });
      } else if (currentEndpoint.id === 'health') {
        const res = await fetch('/api/v1/health');
        const data = await res.json();
        setApiResponse({ status: 200, statusText: 'OK', timeMs: 10, data });
      } else {
        setApiResponse({
          status: 200,
          statusText: 'OK',
          timeMs: 18,
          data: { success: true, message: 'Operação simulada executada com sucesso.' }
        });
      }
      if (onShowToast) onShowToast('Requisição de API executada com sucesso!', 'success');
    } catch (err) {
      setApiResponse({
        status: 400,
        statusText: 'BAD REQUEST',
        timeMs: 15,
        data: { success: false, error: { code: 'EXECUTION_FAILED', message: err.message } }
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentEndpoint.codeSnippets[activeLang]);
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
      
      {/* 1. LEFT SIDEBAR */}
      <div className="apidocs-sidebar" style={{
        background: '#080a0e',
        borderRight: '1px solid var(--border-hairline)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
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

        <div className="apidocs-menu-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0.4rem 0.5rem' }}>
            Cobranças Pix
          </div>
          
          <div 
            className={`dash-menu-item ${activeEndpointId === 'create_charge' ? 'active' : ''}`}
            onClick={() => { setActiveEndpointId('create_charge'); setApiResponse(null); }}
          >
            <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-amber)', padding: '2px 6px', borderRadius: '4px' }}>
              POST
            </span>
            <span>Criar cobrança</span>
          </div>

          <div 
            className={`dash-menu-item ${activeEndpointId === 'list_charges' ? 'active' : ''}`}
            onClick={() => { setActiveEndpointId('list_charges'); setApiResponse(null); }}
          >
            <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '2px 6px', borderRadius: '4px' }}>
              GET
            </span>
            <span>Listar cobranças</span>
          </div>

          <div 
            className={`dash-menu-item ${activeEndpointId === 'get_charge' ? 'active' : ''}`}
            onClick={() => { setActiveEndpointId('get_charge'); setApiResponse(null); }}
          >
            <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '2px 6px', borderRadius: '4px' }}>
              GET
            </span>
            <span>Buscar por ID</span>
          </div>

          <div 
            className={`dash-menu-item ${activeEndpointId === 'pay_charge' ? 'active' : ''}`}
            onClick={() => { setActiveEndpointId('pay_charge'); setApiResponse(null); }}
          >
            <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-amber)', padding: '2px 6px', borderRadius: '4px' }}>
              POST
            </span>
            <span>Simular pagamento</span>
          </div>

          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0.8rem 0.5rem 0.4rem' }}>
            Saques e chaves
          </div>

          <div 
            className={`dash-menu-item ${activeEndpointId === 'create_payout' ? 'active' : ''}`}
            onClick={() => { setActiveEndpointId('create_payout'); setApiResponse(null); }}
          >
            <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-amber)', padding: '2px 6px', borderRadius: '4px' }}>
              POST
            </span>
            <span>Solicitar saque</span>
          </div>

          <div 
            className={`dash-menu-item ${activeEndpointId === 'list_keys' ? 'active' : ''}`}
            onClick={() => { setActiveEndpointId('list_keys'); setApiResponse(null); }}
          >
            <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '2px 6px', borderRadius: '4px' }}>
              GET
            </span>
            <span>Listar chaves API</span>
          </div>

          <div 
            className={`dash-menu-item ${activeEndpointId === 'create_key' ? 'active' : ''}`}
            onClick={() => { setActiveEndpointId('create_key'); setApiResponse(null); }}
          >
            <span style={{ fontSize: '0.68rem', fontWeight: 800, background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-amber)', padding: '2px 6px', borderRadius: '4px' }}>
              POST
            </span>
            <span>Gerar nova chave</span>
          </div>

          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0.8rem 0.5rem 0.4rem' }}>
            Sistema e Eventos
          </div>
          <div 
            className={`dash-menu-item ${activeEndpointId === 'health' ? 'active' : ''}`}
            onClick={() => { setActiveEndpointId('health'); setApiResponse(null); }}
          >
            <Server size={16} /> Status dos serviços
          </div>
        </div>
      </div>

      {/* 2. MIDDLE COLUMN */}
      <div className="apidocs-body" style={{ padding: '2rem 1.5rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
          <span style={{
            background: currentEndpoint.method === 'POST' ? 'var(--accent-amber)' : 'rgba(16, 185, 129, 0.15)',
            color: currentEndpoint.method === 'POST' ? '#000' : '#34d399',
            fontWeight: 800,
            fontSize: '0.82rem',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-pill)'
          }}>
            {currentEndpoint.method}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {currentEndpoint.path}
          </span>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          {currentEndpoint.title}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          {currentEndpoint.description}
        </p>

        {/* Parameters Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {currentEndpoint.bodyLabel}
          </span>
          <span style={{ 
            fontSize: '0.75rem', 
            fontFamily: 'var(--font-mono)', 
            fontWeight: 600, 
            color: 'var(--accent-amber)', 
            background: 'rgba(245, 158, 11, 0.1)', 
            border: '1px solid var(--border-accent)', 
            padding: '0.2rem 0.6rem', 
            borderRadius: 'var(--radius-pill)' 
          }}>
            {currentEndpoint.contentType}
          </span>
        </div>

        {/* Parameters List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {currentEndpoint.params.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Este endpoint não requer corpo de requisição.</div>
          ) : (
            currentEndpoint.params.map(p => (
              <div key={p.name} className="bezel-outer">
                <div className="bezel-inner" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: p.required ? 'var(--accent-amber)' : 'var(--text-primary)' }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: p.required ? '#ef4444' : 'var(--text-muted)', fontWeight: p.required ? 700 : 400 }}>
                      {p.required ? 'Obrigatório' : 'Opcional'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{p.type}</div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    {p.desc}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. RIGHT COLUMN */}
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
                <Terminal size={14} color="var(--accent-amber)" /> Exemplo de integração
              </span>
              <button 
                onClick={handleCopyCode}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                {copiedCode ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            </div>
            <pre style={{ fontSize: '0.78rem', maxHeight: '240px' }}>
              <HighlightedCode code={currentEndpoint.codeSnippets[activeLang] || currentEndpoint.codeSnippets.curl} lang={activeLang} />
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
