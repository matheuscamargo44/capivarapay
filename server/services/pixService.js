import { MockProvider } from '../providers/mockProvider.js';
import { MercadoPagoProvider } from '../providers/mercadoPagoProvider.js';

class PixService {
  constructor() {
    this.providerType = process.env.PIX_PROVIDER || 'mock';
    this.initProvider();
  }

  initProvider() {
    if (this.providerType === 'mercadopago') {
      this.activeProvider = new MercadoPagoProvider();
    } else {
      this.activeProvider = new MockProvider();
    }
  }

  async createCharge(params) {
    return await this.activeProvider.createCharge(params);
  }

  async getCharge(id) {
    return await this.activeProvider.getCharge(id);
  }

  async listCharges() {
    if (typeof this.activeProvider.listCharges === 'function') {
      return await this.activeProvider.listCharges();
    }
    return [];
  }

  async markAsPaid(id) {
    if (typeof this.activeProvider.markAsPaid === 'function') {
      return await this.activeProvider.markAsPaid(id);
    }
    const charge = await this.getCharge(id);
    if (charge) {
      charge.status = 'PAID';
      return { charge, isAlreadyPaid: false };
    }
    return null;
  }
}

export const pixService = new PixService();
