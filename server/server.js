import express from 'express';
import cors from 'cors';
import { pixService } from './services/pixService.js';
import { webhookService } from './services/webhookService.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/v1', authMiddleware);

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

app.post('/api/v1/charges', async (req, res, next) => {
  try {
    const { amount, description, correlation_id, customer } = req.body;

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_AMOUNT',
          message: 'O campo amount deve ser um numero positivo maior que zero.'
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

app.get('/api/v1/charges/:id', async (req, res, next) => {
  try {
    const charge = await pixService.getCharge(req.params.id);
    if (!charge) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CHARGE_NOT_FOUND',
          message: `Cobranca com ID ${req.params.id} nao encontrada.`
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

app.post('/api/v1/charges/:id/pay', async (req, res, next) => {
  try {
    const result = await pixService.markAsPaid(req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CHARGE_NOT_FOUND',
          message: `Cobranca ${req.params.id} nao encontrada.`
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

app.post('/api/v1/payouts', (req, res, next) => {
  try {
    const { amount, pix_key, pix_key_type } = req.body;

    if (!amount || !pix_key) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Os campos amount e pix_key sao obrigatorios.'
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
