export function errorHandler(err, req, res, next) {
  console.error('[Capivara Pay API Error]:', err.stack || err);

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'Ocorreu um erro interno ao processar a requisicao.';

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: message,
      ...(process.env.NODE_ENV === 'development' && { details: err.stack })
    }
  });
}
