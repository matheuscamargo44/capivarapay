import { PixProviderInterface } from './pixProviderInterface.js';

export class MockProvider extends PixProviderInterface {
  constructor() {
    super();
    this.charges = new Map();
  }

  async createCharge({ amount, description, correlation_id, customer, expires_in_seconds = 3600 }) {
    if (correlation_id) {
      for (const charge of this.charges.values()) {
        if (charge.correlation_id === correlation_id) {
          return charge;
        }
      }
    }

    const txid = `tx_cap_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expires_in_seconds * 1000);

    const newCharge = {
      id: txid,
      correlation_id: correlation_id || `corr_${Date.now()}`,
      amount: parseFloat(amount),
      description: description || 'Cobranca Pix Capivara Pay',
      status: 'PENDING',
      customer: customer || { email: 'cliente@exemplo.com', name: 'Cliente Capivara' },
      pix_copy_paste: `00020126580014br.gov.bcb.pix0136${txid}520400005303986540${parseFloat(amount).toFixed(2)}5802BR5912Capivara Pay6009SAO PAULO62070503***6304E8A2`,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString()
    };

    this.charges.set(txid, newCharge);
    return newCharge;
  }

  async getCharge(id) {
    return this.charges.get(id) || null;
  }

  async listCharges() {
    return Array.from(this.charges.values()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async markAsPaid(id) {
    const charge = this.charges.get(id);
    if (!charge) return null;

    if (charge.status === 'PAID') {
      return { charge, isAlreadyPaid: true };
    }

    charge.status = 'PAID';
    charge.paid_at = new Date().toISOString();
    this.charges.set(id, charge);
    return { charge, isAlreadyPaid: false };
  }
}
