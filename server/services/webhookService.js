import crypto from 'crypto';

class WebhookService {
  generateHmacSignature(payload, secret = process.env.WEBHOOK_SECRET || 'whsec_capivara_default') {
    const rawString = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(rawString);
    return `sha256=${hmac.digest('hex')}`;
  }

  async dispatchEvent(targetUrl, eventType, data) {
    const payload = {
      event: eventType,
      created_at: new Date().toISOString(),
      data: data
    };

    const signature = this.generateHmacSignature(payload);

    if (!targetUrl) {
      return { success: false, delivered: false, message: 'URL de webhook nao informada' };
    }

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Capivara-Signature': signature,
          'User-Agent': 'CapivaraPay-Webhook/1.0.0'
        },
        body: JSON.stringify(payload)
      });

      return {
        success: response.ok,
        delivered: true,
        statusCode: response.status,
        signature,
        payload
      };
    } catch (error) {
      console.error(`[Webhook Error] ${error.message}`);
      return {
        success: false,
        delivered: false,
        error: error.message,
        signature,
        payload
      };
    }
  }
}

export const webhookService = new WebhookService();
