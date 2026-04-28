# Feature Specification — BeautyFlow MVP

**Feature Branch**: `001-beautyflow-mvp`  
**Created**: 2026-04-28  
**Status**: Draft  
**Input**: MVP mobile para cabeleireiros registrarem atendimentos e enviarem mensagens de retorno pelo WhatsApp.

## User Scenarios & Testing

### Primary User Story

Como cabeleireira, quero cadastrar clientes, registrar atendimentos e receber uma mensagem de retorno gerada automaticamente, para chamar a cliente no momento certo pelo WhatsApp.

### Acceptance Scenarios

#### Scenario 1 — Cadastro e login

**Given** uma usuária sem conta  
**When** ela informa nome, salão, e-mail e senha  
**Then** o sistema cria o salão, cria a usuária e permite acesso ao app.

#### Scenario 2 — Cadastro de cliente com foto

**Given** uma usuária autenticada  
**When** ela cadastra uma cliente com nome, WhatsApp e foto  
**Then** a cliente aparece na lista com foto circular.

#### Scenario 3 — Cadastro de serviço

**Given** uma usuária autenticada  
**When** ela cadastra o serviço Mechas com retorno de 15 dias  
**Then** o serviço fica disponível para registrar atendimento.

#### Scenario 4 — Registro de atendimento

**Given** uma cliente Gabriela e serviço Mechas de 15 dias  
**When** a usuária registra atendimento em 01/04/2026  
**Then** o sistema cria mensagem pendente para 16/04/2026.

#### Scenario 5 — Envio via WhatsApp manual

**Given** uma mensagem pendente  
**When** a usuária toca em Abrir WhatsApp  
**Then** o app abre o WhatsApp com a mensagem preenchida.

#### Scenario 6 — Marcar mensagem como enviada

**Given** uma mensagem pendente  
**When** a usuária marca como enviada  
**Then** o status muda para Enviada e `sentAt` é preenchido.

## Requirements

### Functional Requirements

- **FR-001**: O sistema deve permitir criar conta de salão.
- **FR-002**: O sistema deve permitir login com e-mail e senha.
- **FR-003**: O sistema deve permitir cadastrar, editar, listar e detalhar clientes.
- **FR-004**: O sistema deve permitir inserir foto da cliente.
- **FR-005**: O sistema deve exibir iniciais quando cliente não tiver foto.
- **FR-006**: O sistema deve permitir cadastrar, editar, listar e ativar/desativar serviços.
- **FR-007**: Cada serviço deve ter prazo sugerido de retorno em dias.
- **FR-008**: O sistema deve permitir registrar atendimento com cliente, serviço, data e observações.
- **FR-009**: Ao registrar atendimento, o sistema deve criar mensagem agendada automaticamente.
- **FR-010**: A mensagem agendada deve ter status Pending.
- **FR-011**: O sistema deve listar mensagens por status e data.
- **FR-012**: O sistema deve permitir editar texto da mensagem antes do envio.
- **FR-013**: O sistema deve abrir WhatsApp com mensagem preenchida.
- **FR-014**: O sistema deve permitir marcar mensagem como enviada.
- **FR-015**: O sistema deve permitir cancelar mensagem.
- **FR-016**: O sistema deve permitir configurar mensagem padrão geral.
- **FR-017**: O sistema deve permitir editar dados do salão.
- **FR-018**: O sistema deve permitir configurar notificações locais.

### Non-Functional Requirements

- **NFR-001**: Dados devem ser isolados por SalonId.
- **NFR-002**: Senhas devem ser armazenadas com hash seguro.
- **NFR-003**: Rotas privadas devem exigir JWT.
- **NFR-004**: App deve funcionar bem em telas mobile pequenas.
- **NFR-005**: Listas devem usar componentes performáticos.
- **NFR-006**: API deve retornar erros padronizados.
- **NFR-007**: UI deve seguir design system BeautyFlow.
- **NFR-008**: O MVP não deve enviar mensagens automaticamente pela API oficial do WhatsApp.

## Key Entities

- Salon
- User
- Customer
- Service
- Appointment
- ScheduledMessage
- MessageTemplate
- NotificationSettings

## Out of Scope

- Pagamentos.
- Planos de assinatura.
- WhatsApp Cloud API.
- Agenda com horários.
- Multiusuário avançado.
- Relatórios financeiros.

## Success Criteria

- Usuária completa fluxo principal sem ajuda técnica.
- Atendimento gera mensagem correta.
- Mensagem abre no WhatsApp com texto correto.
- Dados de salões diferentes permanecem isolados.
- App preserva identidade visual do protótipo.
