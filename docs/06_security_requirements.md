# 06 — Requisitos de Segurança

## 1. Objetivo

Garantir que o BeautyFlow trate autenticação, dados pessoais de clientes, fotos e dados do salão de forma segura desde o MVP.

## 2. Dados sensíveis

O sistema armazena:

- Nome de clientes.
- Telefone/WhatsApp.
- Foto da cliente.
- Observações sobre preferências e alergias.
- Dados do salão.
- E-mail e senha da usuária.

Esses dados devem ser protegidos.

## 3. Autenticação

- Usar JWT Bearer.
- Senhas devem ser armazenadas somente com hash seguro.
- Nunca salvar senha em texto puro.
- Nunca retornar `passwordHash` na API.
- Token deve conter `userId` e `salonId`.
- Rotas privadas devem exigir autenticação.

## 4. Autorização

Regra principal:

```text
Usuário só pode acessar dados do próprio SalonId.
```

Aplicar em todos os módulos:

- Customers
- Services
- Appointments
- ScheduledMessages
- Templates
- Settings

## 5. Validação de entrada

Validar no backend:

- Strings obrigatórias.
- Tamanho máximo.
- Formato de e-mail.
- Formato de telefone.
- UUID válido.
- Datas válidas.
- `suggestedReturnDays > 0`.

## 6. Upload de foto

- Permitir apenas imagens.
- Validar extensão e content-type.
- Limitar tamanho máximo, sugestão: 5 MB.
- Gerar nome de arquivo seguro.
- Não usar nome original diretamente no caminho.
- Armazenar somente URL/caminho no banco.

## 7. Proteção contra exposição de dados

- DTOs não devem incluir dados internos.
- Logs não devem registrar token, senha ou conteúdo sensível completo.
- Mensagens de erro não devem expor stack trace.

## 8. CORS

- Em desenvolvimento, permitir origem local do app.
- Em produção, restringir origens conhecidas.

## 9. Rate limiting

Recomendado para:

- Login.
- Register.
- Upload de foto.

## 10. HTTPS

- API deve rodar com HTTPS em produção.
- Tokens não devem trafegar em HTTP.

## 11. Armazenamento no mobile

- Preferir SecureStore para token.
- Não salvar senha no app.
- Limpar token no logout.

## 12. LGPD

Para evolução:

- Permitir exclusão de cliente.
- Permitir exportar dados.
- Criar política de privacidade.
- Permitir remover foto.

## 13. Checklist de segurança para PR

- [ ] Rota privada exige autenticação.
- [ ] Consulta filtra por SalonId.
- [ ] Não retorna entidade sensível.
- [ ] Não salva senha em texto puro.
- [ ] Upload valida tipo e tamanho.
- [ ] Erros são amigáveis.
- [ ] Não há secrets no repositório.
