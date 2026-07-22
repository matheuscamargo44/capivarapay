export function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  const publicPaths = ['/api/v1/health'];
  if (publicPaths.some(path => req.path.startsWith(path)) || req.method === 'GET') {
    return next();
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Cabecalho Authorization no formato Bearer cap_live_... e obrigatorio.'
      }
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token || !token.startsWith('cap_')) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'API Key invalida ou credencial nao reconhecida.'
      }
    });
  }

  req.apiKey = token;
  next();
}
