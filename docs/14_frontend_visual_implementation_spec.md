# Frontend Visual Implementation Spec — BeautyFlow

## Finalidade

Este documento orienta a IA/Codex a transformar o protótipo HTML do BeautyFlow em um aplicativo React Native com Expo, mantendo fidelidade visual e funcional ao arquivo:

`design-reference/beautyflow_mvp_mobile_prototype.html`

## Resposta direta

A documentação funcional e arquitetural ajuda o Codex a entender o produto, mas o protótipo HTML deve ser tratado como a referência visual principal. Para chegar perto do resultado anexado, cada tela React Native deve ser implementada comparando layout, cores, tipografia e fluxo com o protótipo.

## Princípios de implementação

1. Primeiro criar tokens de design.
2. Depois criar componentes base.
3. Depois montar as telas com dados mockados.
4. Só depois integrar com API.
5. Não iniciar integração antes do layout estar aprovado.

## Conversão HTML/CSS para React Native

### `.card`

No React Native, virar `AppCard`.

Características:
- background branco
- borderRadius 15
- padding 13
- borderColor rgba(199,125,138,0.18)
- sombra leve
- elevation 2 no Android

### `.button-primary`

Virar `AppButton variant="primary"`.

Características:
- background rose `#C77D8A`
- texto branco
- borderRadius 13
- padding vertical 13
- fonte DM Sans semi-bold 14
- sombra suave

### `.button-secondary`

Virar `AppButton variant="secondary"`.

Características:
- fundo transparente
- borda rose
- texto rose
- borderRadius 13

### `.input`, `.select`, `.textarea`

Virar componentes próprios:
- `AppInput`
- `AppSelect`
- `AppTextarea`

Características:
- fundo branco
- borda `borderStrong`
- borderRadius 11
- padding 12/13
- fonte DM Sans 13

### `.chip.pending`, `.chip.sent`, `.chip.error`, `.chip.inactive`

Virar `AppChip`.

Status:
- pending: fundo `#F5EDD8`, texto `#8A6020`
- sent: fundo `#E5F5EC`, texto `#2E7A52`
- error: fundo `#FBEAEA`, texto `#963D3D`
- inactive: fundo `#EEE7E5`, texto `#7A6A68`

### `.avatar` e `.photo-avatar`

Virar `Avatar`.

Suportar:
- iniciais da cliente
- foto via URI
- tamanhos 38, 42, 50, 68, 76

### `.photo-upload-card`

Virar `PhotoPicker`.

Requisitos:
- usar `expo-image-picker`
- permitir escolher imagem da galeria
- preview circular 78x78
- permitir cliente sem foto
- salvar URI local no estado enquanto não houver backend

## Telas e fidelidade visual

### Splash

Deve reproduzir:
- gradiente claro rose/off-white
- logo com flor
- nome BeautyFlow
- frase "Cuide das suas clientes no momento certo."
- botões Entrar e Criar conta

### Login

Deve reproduzir:
- centro visual
- ícone/brand no topo
- título "Bem-vinda de volta"
- campos e-mail e senha
- link "Esqueci minha senha"
- botão Entrar
- link Criar conta

### Criar Conta

Deve reproduzir:
- topbar com voltar
- formulário com nome da responsável, nome do salão, telefone, e-mail, senha, confirmar senha
- botão Criar conta
- botão Já tenho uma conta

### Home

Deve reproduzir:
- header em rose claro
- saudação do salão
- botão de notificação
- cards de métricas
- botão Registrar atendimento
- lista de mensagens pendentes
- bottom nav

### Clientes

Deve reproduzir:
- topbar com botão Nova
- busca
- cards de clientes
- avatar/foto
- botão flutuante "+"
- bottom nav

### Nova Cliente

Deve reproduzir:
- upload de foto
- campos nome, WhatsApp, nascimento, preferência de contato, observações
- botões salvar e cancelar

### Detalhes da Cliente

Deve reproduzir:
- foto/avatar central
- telefone e preferência de contato
- cards de último atendimento e próximo contato
- observações
- histórico
- ações registrar atendimento e abrir WhatsApp

### Serviços

Deve reproduzir:
- lista de serviços
- status ativo/inativo
- retorno em dias
- botão Novo

### Novo Serviço

Deve reproduzir:
- nome do serviço
- prazo de retorno
- status
- mensagem padrão do serviço
- variáveis disponíveis

### Registrar Atendimento

Deve reproduzir:
- seleção de cliente
- seleção de serviço
- data do atendimento
- card de data calculada
- observações
- prévia da mensagem
- salvar atendimento

### Histórico de Atendimentos

Deve reproduzir:
- filtros/tabs
- busca
- cards de atendimentos
- status da mensagem relacionada

### Mensagens

Deve reproduzir:
- tabs Hoje, Pendentes, Enviadas, Erro
- cards de mensagens
- botões Abrir WhatsApp e Marcar enviada
- status chips
- bottom nav

### Detalhe da Mensagem

Deve reproduzir:
- cliente
- serviço
- data de envio
- textarea editável
- ações Abrir WhatsApp, Marcar enviada, Cancelar mensagem

### Mensagens Padrão

Deve reproduzir:
- card explicativo
- textarea com template
- variáveis disponíveis
- prévia
- botões salvar/restaurar

### Meu Salão

Deve reproduzir:
- avatar SB
- dados do salão
- formulário de edição

### Notificações

Deve reproduzir:
- card explicativo
- switch de ativar notificações
- horário preferido
- condição de aviso

### Mais

Deve reproduzir:
- header com salão
- menu: Meu salão, Serviços, Mensagens padrão, Notificações
- card BeautyFlow Pro
- botão Sair

## Critérios de aceite visuais

- O app deve parecer visualmente derivado do protótipo HTML.
- A paleta deve ser idêntica.
- Os cards devem ter cantos arredondados e sombra leve.
- O bottom nav deve usar as mesmas 5 áreas.
- O formulário de cliente deve incluir foto.
- A Home deve manter os 3 indicadores.
- Mensagens devem ter status chips.
- A navegação deve permitir percorrer todo o fluxo do MVP.
