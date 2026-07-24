// Rate Limiting Middleware Leve (Prevenção de Abusos e DDoS)

const requestsMap = new Map();
const WINDOW_MS = 60 * 1000; // Janela de 1 minuto
const MAX_REQUESTS = 60; // Máximo de 60 requisições por minuto por IP

export function rateLimiter(req, res, next) {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();

  if (!requestsMap.has(clientIp)) {
    requestsMap.set(clientIp, []);
  }

  const timestamps = requestsMap.get(clientIp).filter(time => now - time < WINDOW_MS);
  
  if (timestamps.length >= MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Limite de requisições excedido. Por favor, aguarde alguns segundos antes de tentar novamente.',
        retry_after_seconds: Math.ceil((WINDOW_MS - (now - timestamps[0])) / 1000)
      }
    });
  }

  timestamps.push(now);
  requestsMap.set(clientIp, timestamps);
  next();
}
