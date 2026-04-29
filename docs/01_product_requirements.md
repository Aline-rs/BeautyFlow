# 01 — Product Requirements Document — BeautyFlow MVP

## 1. Visão geral

BeautyFlow é um aplicativo mobile para profissionais de beleza organizarem suas próprias clientes, atendimentos e mensagens de retorno, mesmo quando trabalham em mais de um salão. O produto ajuda a profissional a aumentar recorrência e fidelização, lembrando a cliente de retornar no momento adequado para retoques, hidratações, cortes e outros serviços.

## 2. Problema

Cabeleireiros geralmente dependem de memória, agenda manual ou conversas soltas no WhatsApp para lembrar de chamar clientes. Isso causa perda de retornos, dificuldade de acompanhamento e baixa previsibilidade de agenda.

## 3. Solução proposta

O app permite registrar um atendimento e, com base no serviço realizado, calcular automaticamente uma data de retorno. Na data correta, a mensagem aparece como pendente. A cabeleireira toca em “Abrir WhatsApp” e envia uma mensagem personalizada para a cliente.

## 4. Público-alvo

- Cabeleireiros autônomos.
- Pequenos salões como contexto operacional de trabalho.
- Profissionais de beleza que atendem por agenda própria.
- Profissionais que trabalham em mais de um salão e querem centralizar sua carteira.

## 5. Escopo do MVP

### Incluído

- Cadastro de conta.
- Login.
- Perfil da profissional.
- Cadastro e vínculo com um ou mais salões.
- Cadastro de clientes.
- Upload de foto da cliente.
- Cadastro de serviços por salão.
- Configuração de prazo de retorno por serviço.
- Configuração de mensagem padrão por serviço.
- Registro de atendimento.
- Geração automática de mensagem agendada.
- Listagem de mensagens por status.
- Detalhe e edição da mensagem antes do envio.
- Abertura do WhatsApp com texto preenchido.
- Marcação manual de mensagem como enviada.
- Histórico de atendimentos.
- Configuração simples de notificações locais.

### Fora do MVP

- Pagamento e assinatura.
- WhatsApp Cloud API real.
- Campanhas em massa.
- Multiusuário com permissões avançadas.
- Agenda com horários disponíveis.
- Relatórios financeiros.
- Integração com calendário externo.
- Envio automático sem ação da usuária.

## 6. Personas

### Persona principal

**Bella, cabeleireira autônoma**

- Usa celular durante o dia.
- Quer algo rápido, bonito e simples.
- Não quer preencher formulários longos.
- Usa WhatsApp como principal canal com clientes.
- Pode atender em mais de um salão ao longo da semana.
- Quer manter a carteira de clientes centralizada no próprio nome.

## 7. Jornada principal

```text
Criar conta
↓
Vincular salão
↓
Cadastrar cliente
↓
Registrar atendimento
↓
Sistema calcula data de retorno
↓
Sistema cria mensagem pendente
↓
Usuária abre WhatsApp com mensagem pronta
↓
Usuária marca como enviada
```

## 8. Funcionalidades por módulo

### Autenticação

- Criar conta.
- Entrar.
- Sair.
- Manter sessão.
- Gerenciar vínculo com salões.

### Clientes

- Listar clientes.
- Buscar por nome ou telefone.
- Cadastrar cliente.
- Editar cliente.
- Adicionar foto.
- Ver detalhes.
- Ver histórico de atendimentos.
- Abrir WhatsApp.
- Visualizar carteira consolidada da profissional, independentemente do salão.

### Serviços

- Listar serviços do salão selecionado.
- Criar serviço.
- Editar serviço.
- Ativar/desativar serviço.
- Definir prazo de retorno.
- Definir mensagem padrão.

### Atendimentos

- Registrar atendimento.
- Selecionar cliente.
- Selecionar salão.
- Selecionar serviço.
- Definir data.
- Adicionar observação.
- Gerar mensagem agendada automaticamente.
- Listar histórico.

### Mensagens

- Listar mensagens.
- Filtrar por Hoje, Pendentes, Enviadas e Erro.
- Ver detalhe.
- Editar texto antes do envio.
- Abrir WhatsApp com mensagem pronta.
- Marcar como enviada.
- Cancelar mensagem.

### Configurações

- Editar dados da profissional.
- Editar dados do salão selecionado.
- Editar mensagem padrão geral.
- Configurar notificações locais.

## 9. Regras de negócio

### RN001 — Geração de mensagem

Ao salvar um atendimento, o sistema deve criar uma mensagem agendada com status `Pending`.

### RN002 — Data de envio

A data de envio deve ser:

```text
AppointmentDate + Service.SuggestedReturnDays
```

### RN003 — Mensagem personalizada

A mensagem deve substituir variáveis:

```text
{nome}
{servico}
{dias}
{salao}
{data_atendimento}
```

### RN004 — Status de mensagem

Status permitidos:

```text
Pending
Sent
Canceled
Error
```

### RN005 — Dono da cliente

A cliente pertence à profissional. O salão não é dono da carteira de clientes.

### RN006 — Contexto de salão

Serviços pertencem ao salão. Atendimentos e mensagens registram em qual salão aconteceram.

### RN007 — Vínculo profissional-salão

A profissional só pode registrar atendimentos em salões aos quais está vinculada.

### RN008 — Foto da cliente

A foto da cliente é opcional. Se não houver foto, exibir iniciais.

### RN009 — WhatsApp no MVP

O MVP deve abrir o WhatsApp com mensagem pronta. Não deve enviar automaticamente.

## 10. Critérios de aceite gerais

- Usuária consegue criar conta e entrar.
- Usuária consegue cadastrar cliente com ou sem foto.
- Usuária consegue cadastrar serviço com prazo de retorno.
- Usuária consegue registrar atendimento.
- Atendimento gera mensagem automaticamente.
- Mensagem aparece como pendente.
- Usuária consegue abrir WhatsApp com texto preenchido.
- Usuária consegue marcar mensagem como enviada.
- A profissional mantém a mesma carteira de clientes mesmo atuando em mais de um salão.
