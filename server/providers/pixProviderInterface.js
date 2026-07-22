export class PixProviderInterface {
  async createCharge({ amount, description, correlation_id, customer }) {
    throw new Error('Metodo createCharge() deve ser implementado pelo Provider.');
  }

  async getCharge(id) {
    throw new Error('Metodo getCharge() deve ser implementado pelo Provider.');
  }

  async markAsPaid(id) {
    throw new Error('Metodo markAsPaid() nao suportado por este Provider.');
  }
}
