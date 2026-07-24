export function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Endpoints públicos que dispensam autenticação
  const publicPaths = ['/api/v1/health'];
  if (publicPaths.some(path => req.path.startsWith(path)) || (req.method === 'GET' && req.path === '/api/v1/charges')) {
    return next();
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Cabeçalho Authorization no formato Bearer cap_live_... é obrigatório.'
      }
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token || !token.startsWith('cap_')) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Chave de API inválida ou credencial não reconhecida.'
      }
    });
  }

  req.apiKey = token;
  req.isTestMode = token.startsWith('cap_test_');
  next();
}
