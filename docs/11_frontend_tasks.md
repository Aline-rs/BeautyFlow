# 11 — Tasks Detalhadas Frontend

## Epic FE-01 — Fundação do App Mobile

### FE-001 — Criar projeto Expo TypeScript

**Objetivo:** Criar base do app mobile.

**Atividades:**

- Criar projeto `beautyflow-mobile` com Expo e TypeScript.
- Configurar scripts `start`, `android`, `ios`, `web`.
- Validar execução local.

**Aceite:**

- App abre no Expo.
- TypeScript compila.

### FE-002 — Configurar estrutura de pastas

Criar estrutura:

```text
src/app
src/components
src/features
src/theme
src/services
src/types
src/utils
```

**Aceite:** estrutura criada sem arquivos soltos desnecessários.

### FE-003 — Criar theme

Criar arquivos:

- `colors.ts`
- `typography.ts`
- `spacing.ts`
- `shadows.ts`
- `index.ts`

**Aceite:** cores iguais ao design system.

### FE-004 — Instalar e configurar fontes

- Instalar `expo-font`.
- Adicionar Playfair Display e DM Sans, se disponíveis localmente ou via assets.
- Criar fallback seguro.

**Aceite:** app não quebra se fonte não carregar.

## Epic FE-02 — Componentes Base

### FE-005 — Criar Screen

Componente com SafeAreaView, fundo padrão e padding opcional.

### FE-006 — Criar AppButton

Variações:

- primary
- secondary
- ghost

### FE-007 — Criar AppInput

Com label, erro e placeholder.

### FE-008 — Criar AppSelect

Para seleção de cliente, serviço e status.

### FE-009 — Criar AppCard

Com sombra leve e borda padrão.

### FE-010 — Criar AppChip

Status:

- pending
- sent
- error
- inactive

### FE-011 — Criar Avatar

- Exibir foto quando existir.
- Exibir iniciais quando não existir.

### FE-012 — Criar PhotoPicker

- Usar Expo Image Picker.
- Solicitar permissão.
- Exibir preview.
- Retornar URI da foto.

## Epic FE-03 — Navegação

### FE-013 — Configurar AuthNavigator

Telas:

- Splash
- Login
- SignUp

### FE-014 — Configurar MainTabs

Tabs:

- Home
- Clientes
- Atendimentos
- Mensagens
- Mais

### FE-015 — Configurar RootStack

Telas fora das tabs:

- CustomerForm
- CustomerDetail
- Services
- ServiceForm
- AppointmentForm
- MessageDetail
- MessageTemplate
- SalonProfile
- Notifications

## Epic FE-04 — Autenticação

### FE-016 — Criar LoginScreen

- Campos e-mail e senha.
- Validação com Zod.
- Botão Entrar.
- Link Criar conta.

### FE-017 — Criar SignUpScreen

- Nome responsável.
- Nome salão.
- Telefone salão.
- E-mail.
- Senha.
- Confirmar senha.

### FE-018 — Criar AuthContext

- Guardar user/token.
- Login.
- Logout.
- Persistência segura.

### FE-019 — Integrar Auth API

- Chamar `/auth/login`.
- Chamar `/auth/register`.
- Salvar token.

## Epic FE-05 — Home

### FE-020 — Criar HomeScreen estática

Baseada no protótipo.

### FE-021 — Integrar cards da Home

- Mensagens pendentes.
- Clientes retorno próximo.
- Atendimentos do mês.

### FE-022 — Listar mensagens pendentes na Home

Mostrar até 3 mensagens.

## Epic FE-06 — Clientes

### FE-023 — Criar CustomersScreen

- Lista.
- Busca.
- Estado vazio.
- Botão nova cliente.

### FE-024 — Criar CustomerFormScreen

- Foto.
- Nome.
- WhatsApp.
- Data nascimento.
- Preferência contato.
- Observações.

### FE-025 — Implementar upload/preview de foto

- Integrar PhotoPicker.
- Preview circular.
- Enviar para API se cliente já existir.

### FE-026 — Criar CustomerDetailScreen

- Dados da cliente.
- Foto.
- Último atendimento.
- Próximo contato.
- Histórico.
- Botão WhatsApp.

### FE-027 — Integrar API de clientes

- Listar.
- Criar.
- Editar.
- Buscar detalhe.

## Epic FE-07 — Serviços

### FE-028 — Criar ServicesScreen

- Lista serviços.
- Status ativo/inativo.
- Botão novo serviço.

### FE-029 — Criar ServiceFormScreen

- Nome.
- Prazo retorno.
- Status.
- Mensagem padrão.
- Variáveis disponíveis.

### FE-030 — Integrar API de serviços

- Listar.
- Criar.
- Editar.
- Ativar/desativar.

## Epic FE-08 — Atendimentos

### FE-031 — Criar AppointmentFormScreen

- Selecionar cliente.
- Selecionar serviço.
- Data atendimento.
- Observações.
- Prévia da data de retorno.
- Prévia da mensagem.

### FE-032 — Implementar cálculo local de retorno

- Data + prazo do serviço.
- Evitar bug de timezone.

### FE-033 — Integrar criação de atendimento

- POST `/appointments`.
- Exibir sucesso.
- Navegar para Home ou Mensagens.

### FE-034 — Criar AppointmentsHistoryScreen

- Lista.
- Filtros básicos.
- Busca.

## Epic FE-09 — Mensagens

### FE-035 — Criar MessagesScreen

- Filtros: Hoje, Pendentes, Enviadas, Erro.
- Lista mensagens.
- Botões WhatsApp e marcar enviada.

### FE-036 — Criar MessageDetailScreen

- Dados cliente.
- Serviço.
- Data envio.
- Texto editável.
- Botões.

### FE-037 — Implementar abrir WhatsApp

- Gerar URL com encode.
- Usar Linking.

### FE-038 — Integrar API de mensagens

- Listar.
- Detalhar.
- Editar texto.
- Marcar enviada.
- Cancelar.

## Epic FE-10 — Configurações

### FE-039 — Criar MoreScreen

- Meu salão.
- Serviços.
- Mensagens padrão.
- Notificações.
- Sair.

### FE-040 — Criar SalonProfileScreen

- Editar dados do salão.

### FE-041 — Criar MessageTemplateScreen

- Editar template geral.
- Preview.
- Variáveis.

### FE-042 — Criar NotificationsScreen

- Ativar/desativar.
- Horário preferido.
- Modo de aviso.

## Epic FE-11 — Qualidade

### FE-043 — Criar testes utilitários

- Date calculation.
- Template replacement.
- WhatsApp URL.

### FE-044 — Revisar acessibilidade

- Labels.
- Touch targets.
- Contraste.

### FE-045 — Remover mocks de telas integradas

Quando API estiver pronta, remover dados fake dos fluxos integrados.
