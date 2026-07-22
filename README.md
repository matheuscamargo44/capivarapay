# Capivara Pay

Gateway de pagamentos Pix auto-hospedado (self-hosted) no modelo BYOK (Bring Your Own Keys).

O **Capivara Pay** é um middleware open-source que elimina as taxas de intermediação de 3% a 10% cobradas por plataformas tradicionais. Você instala o software na sua própria nuvem e conecta às chaves da sua conta bancária (Mercado Pago, Efí, Asaas), recebendo 100% das vendas diretamente na sua conta.

* **Taxa zero**: 100% do valor pago pelo cliente cai direto na sua conta bancária.
* **Risco zero de custódia**: O sistema não custodia valores nem armazena saldo.
* **Pronto para produção**: Idempotência nativa por `correlation_id` e webhooks assinados via HMAC SHA-256.

---

## Documentação

A referência completa das APIs, guias de instalação e configuração de variáveis de ambiente estão disponíveis diretamente no site oficial do projeto.

---

## Licença

Licenciado sob a licença [MIT](LICENSE).
