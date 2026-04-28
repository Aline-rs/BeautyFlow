# 07 — Estratégia de Qualidade

## 1. Objetivo

Definir padrões de qualidade para frontend e backend, garantindo que o MVP seja confiável, testável e fácil de evoluir com apoio do Codex.

## 2. Qualidade de código

### Frontend

- TypeScript obrigatório.
- Componentes pequenos e reutilizáveis.
- Evitar duplicação de estilos.
- Separar telas, componentes, services e schemas.
- Evitar lógica de API diretamente nas telas.
- Nome de componentes em PascalCase.
- Nome de funções em camelCase.

### Backend

- Controllers finos.
- Services/use cases com regras de negócio.
- DTOs para entrada e saída.
- Validação explícita.
- Repositórios ou DbContext encapsulado por services.
- Não retornar entidades diretamente.

## 3. Testes frontend

Prioridade no MVP:

- Testar helpers de template de mensagem.
- Testar cálculo de data de retorno.
- Testar formatação de telefone/WhatsApp.
- Testar componentes críticos, opcional.

### Casos mínimos

```text
calculateReturnDate(2026-04-01, 15) => 2026-04-16
replaceTemplate({nome}, Gabriela) => mensagem correta
formatWhatsAppUrl(phone, message) => URL válida
```

## 4. Testes backend

### Unitários

- Geração de mensagem.
- Substituição de variáveis.
- Cálculo da data de envio.
- Validações.

### Integração

- Register/Login.
- Criar cliente.
- Criar serviço.
- Criar atendimento e mensagem.
- Listar mensagens filtradas por status.
- Garantir isolamento por SalonId.

## 5. Critérios de aceite por PR

- [ ] Build passa.
- [ ] Lint passa.
- [ ] Testes existentes passam.
- [ ] Não quebra fluxo principal.
- [ ] Não adiciona funcionalidade fora do escopo.
- [ ] UI segue design system.
- [ ] Backend valida dados.
- [ ] Dados filtram por SalonId.

## 6. Definition of Done por tela frontend

- Tela renderiza sem erro.
- Layout respeita design system.
- Inputs possuem labels.
- Botões executam ação esperada.
- Estados de loading e erro existem quando há API.
- Formulário valida dados obrigatórios.
- Navegação funciona.

## 7. Definition of Done por endpoint backend

- Endpoint documentado no Swagger.
- Possui DTO de request.
- Possui DTO de response.
- Valida request.
- Exige autenticação quando privado.
- Filtra por SalonId.
- Retorna erro padronizado.
- Possui teste mínimo.

## 8. Bugs conhecidos a evitar

- Mensagem gerada com data errada por timezone.
- Dados de outro salão aparecendo em listagens.
- Foto muito grande causando lentidão.
- WhatsApp link com texto sem encode.
- Serviço inativo aparecendo no registro de atendimento.
- Mensagem marcada como enviada sem `sentAt`.

## 9. Datas e timezone

- Para datas de atendimento e envio, usar tipo date sem hora quando possível.
- Evitar conversão indevida por timezone no frontend.
- Exibir datas em `pt-BR`.

## 10. Padrão de commits sugerido

```text
feat: adiciona cadastro de clientes
fix: corrige cálculo de data de retorno
test: adiciona testes de geração de mensagem
docs: atualiza contrato da API
refactor: extrai componente AppCard
```
