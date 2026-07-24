# Referência Técnica da API Capivara Pay

Documentação oficial para desenvolvedores e integração de pagamentos Pix.

---

## 1. Autenticação

A API utiliza tokens no padrão **Bearer Token**. Todas as requisições privadas devem enviar o cabeçalho HTTP:

```http
Authorization: Bearer cap_live_SUA_CHAVE_SECRETA
```

### Ambientes e Chaves de API
* **Chaves de Produção (`cap_live_...`)**: Utilizadas para transações Pix reais e liquidação em conta.
* **Chaves de Teste (`cap_test_...`)**: Utilizadas para simulações no ambiente de homologação.

---

## 2. Padrões de Resposta e Códigos HTTP

Todas as respostas seguem o formato padrão JSON:

```json
{
  "success": true,
  "data": { ... }
}
```

### Códigos de Status HTTP

| Código | Descrição |
| :--- | :--- |
| `200 OK` | Requisição processada com sucesso. |
| `201 Created` | Recurso (cobrança, chave ou saque) criado com sucesso. |
| `400 Bad Request` | Parâmetros de entrada inválidos ou fora dos limites esperados. |
| `401 Unauthorized` | Cabeçalho `Authorization` ausente ou malformatado. |
| `403 Forbidden` | Chave de API não reconhecida ou sem permissão. |
| `429 Too Many Requests` | Limite de taxa excedido (máximo de 60 requisições por minuto). |
| `500 Internal Error` | Erro interno do servidor. |

---

## 3. Endpoints Principais

### 3.1. Criar Cobrança Pix (`POST /api/v1/charges`)

Gera um QR Code Pix dinâmico e o código copia e cola para pagamento.

**Requisição:**
```json
{
  "amount": 29.90,
  "description": "Assinatura Capivara Pro",
  "correlation_id": "ped_98124"
}
```

**Resposta (`201 Created`):**
```json
{
  "success": true,
  "data": {
    "id": "tx_cap_8f912a",
    "correlation_id": "ped_98124",
    "amount": 29.90,
    "description": "Assinatura Capivara Pro",
    "status": "PENDING",
    "pix_copy_paste": "00020126580014br.gov.bcb.pix0136tx_cap_8f912a...",
    "created_at": "2026-07-23T23:42:00.000Z",
    "expires_at": "2026-07-23T23:57:00.000Z"
  }
}
```

---

### 3.2. Listar Cobranças (`GET /api/v1/charges`)

Retorna o histórico das cobranças geradas.

---

### 3.3. Solicitar Saque (`POST /api/v1/payouts`)

Realiza uma transferência Pix de saída para a chave informada.

**Requisição:**
```json
{
  "amount": 150.00,
  "pix_key": "12345678900",
  "pix_key_type": "CPF"
}
```

---

## 4. Webhooks e Segurança HMAC

O Capivara Pay notifica seu servidor em tempo real sobre mudanças de status (ex: `pix.payment.succeeded`).

### Cabeçalho de Assinatura (`X-Capivara-Signature`)
Todo evento enviado para o seu webhook possui o cabeçalho:

```http
X-Capivara-Signature: t=1784859720,v1=9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c
```

### Validação da Assinatura no Servidor (Node.js)
```javascript
import crypto from 'crypto';

function verifyWebhook(payload, signatureHeader, secret) {
  const parts = signatureHeader.split(',');
  const timestamp = parts.find(p => p.startsWith('t='))?.split('=')[1];
  const signatureHex = parts.find(p => p.startsWith('v1='))?.split('=')[1];

  const rawPayload = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const expectedHmac = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${rawPayload}`)
    .digest('hex');

  return expectedHmac === signatureHex;
}
```
