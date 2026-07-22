import { PixProviderInterface } from './pixProviderInterface.js';

export class MercadoPagoProvider extends PixProviderInterface {
  constructor(accessToken) {
    super();
    this.accessToken = accessToken || process.env.MERCADOPAGO_ACCESS_TOKEN;
  }

  async createCharge({ amount, description, correlation_id, customer }) {
    if (!this.accessToken) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN e obrigatorio para utilizar este provedor.');
    }

    const payload = {
      transaction_amount: parseFloat(amount),
      description: description || 'Cobranca Pix Capivara Pay',
      payment_method_id: 'pix',
      payer: {
        email: customer?.email || 'cliente@exemplo.com',
        first_name: customer?.name ? customer.name.split(' ')[0] : 'Cliente',
        last_name: customer?.name ? customer.name.split(' ').slice(1).join(' ') || 'Capivara' : 'Capivara'
      }
    };

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
        'X-Idempotency-Key': correlation_id || `corr_${Date.now()}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao comunicar com a API do Mercado Pago');
    }

    return {
      id: `mp_${data.id}`,
      correlation_id: correlation_id || `corr_${Date.now()}`,
      amount: data.transaction_amount,
      description: data.description,
      status: data.status === 'approved' ? 'PAID' : 'PENDING',
      pix_copy_paste: data.point_of_interaction?.transaction_data?.qr_code || '',
      qr_code_image: data.point_of_interaction?.transaction_data?.qr_code_base64 || '',
      created_at: data.date_created,
      raw_provider_response: data
    };
  }

  async getCharge(id) {
    if (!this.accessToken) return null;

    const mpId = id.replace('mp_', '');
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${mpId}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) return null;
    const data = await response.json();

    return {
      id: `mp_${data.id}`,
      amount: data.transaction_amount,
      status: data.status === 'approved' ? 'PAID' : 'PENDING',
      paid_at: data.date_approved || null
    };
  }
}
