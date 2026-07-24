import express from 'express';
import cors from 'cors';
import { pixService } from './services/pixService.js';
import { webhookService } from './services/webhookService.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rate Limiting Global contra ataques de força bruta e spam
app.use('/api/v1', rateLimiter);

// Autenticação Bearer Token
app.use('/api/v1', authMiddleware);

// In-Memory API Keys Store
const apiKeysStore = new Map([
  ['cap_live_8f2a91b4', { id: 'key_1', name: 'Produção Principal', token: 'cap_live_8f2a91b4', type: 'LIVE', created_at: new Date().toISOString() }],
  ['cap_test_demo_key', { id: 'key_2', name: 'Ambiente de Testes', token: 'cap_test_demo_key', type: 'TEST', created_at: new Date().toISOString() }]
]);

// Healthcheck
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ONLINE',
      gateway: 'Capivara Pay Pix Gateway',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }
  });
});

// Endpoint para Gestão de API Keys
app.get('/api/v1/keys', (req, res) => {
  const keys = Array.from(apiKeysStore.values()).map(key => ({
    id: key.id,
    name: key.name,
    masked_key: `${key.token.substring(0, 9)}...${key.token.slice(-4)}`,
    full_key: key.token,
    type: key.type,
    created_at: key.created_at
  }));

  res.json({
    success: true,
    data: keys
  });
});

app.post('/api/v1/keys', (req, res) => {
  const { name, type } = req.body;
  const isLive = type === 'LIVE';
  const prefix = isLive ? 'cap_live_' : 'cap_test_';
  const randomHash = Math.random().toString(36).substring(2, 10);
  const newToken = `${prefix}${randomHash}`;

  const newKey = {
    id: `key_${Date.now()}`,
    name: name || (isLive ? 'Chave de Produção' : 'Chave de Testes'),
    token: newToken,
    type: isLive ? 'LIVE' : 'TEST',
    created_at: new Date().toISOString()
  };

  apiKeysStore.set(newToken, newKey);

  res.status(201).json({
    success: true,
    data: {
      id: newKey.id,
      name: newKey.name,
      masked_key: `${newKey.token.substring(0, 9)}...${newKey.token.slice(-4)}`,
      full_key: newKey.token,
      type: newKey.type,
      created_at: newKey.created_at
    }
  });
});

// Endpoint para Criar Cobrança Pix
app.post('/api/v1/charges', async (req, res, next) => {
  try {
    const { amount, description, correlation_id, customer } = req.body;

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_AMOUNT',
          message: 'O campo amount deve ser um número positivo maior que zero.'
        }
      });
    }

    const charge = await pixService.createCharge({ amount, description, correlation_id, customer });

    res.status(201).json({
      success: true,
      data: charge
    });
  } catch (err) {
    next(err);
  }
});

// Endpoint para Listar Cobranças
app.get('/api/v1/charges', async (req, res, next) => {
  try {
    const charges = await pixService.listCharges();
    res.json({
      success: true,
      data: charges,
      total: charges.length
    });
  } catch (err) {
    next(err);
  }
});

// Endpoint para Buscar Cobrança por ID
app.get('/api/v1/charges/:id', async (req, res, next) => {
  try {
    const charge = await pixService.getCharge(req.params.id);
    if (!charge) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CHARGE_NOT_FOUND',
          message: `Cobrança com ID ${req.params.id} não encontrada.`
        }
      });
    }

    res.json({
      success: true,
      data: charge
    });
  } catch (err) {
    next(err);
  }
});

// Endpoint para Marcar Pagamento Pix (Simulação / Webhook)
app.post('/api/v1/charges/:id/pay', async (req, res, next) => {
  try {
    const result = await pixService.markAsPaid(req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CHARGE_NOT_FOUND',
          message: `Cobrança ${req.params.id} não encontrada.`
        }
      });
    }

    const { charge, isAlreadyPaid } = result;

    let webhookResult = null;
    if (!isAlreadyPaid && req.body.webhook_url) {
      webhookResult = await webhookService.dispatchEvent(req.body.webhook_url, 'pix.payment.succeeded', charge);
    }

    res.json({
      success: true,
      data: {
        charge,
        already_paid: isAlreadyPaid,
        webhook: webhookResult
      }
    });
  } catch (err) {
    next(err);
  }
});

// Endpoint para Saques (Payouts)
app.post('/api/v1/payouts', (req, res, next) => {
  try {
    const { amount, pix_key, pix_key_type } = req.body;

    if (!amount || !pix_key) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Os campos amount e pix_key são obrigatórios.'
        }
      });
    }

    const payout = {
      id: `po_cap_${Math.random().toString(36).substring(2, 9)}`,
      amount: parseFloat(amount),
      pix_key,
      pix_key_type: pix_key_type || 'CPF',
      status: 'PROCESSING',
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: payout
    });
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Capivara Pay API rodando na porta ${PORT}`);
});
