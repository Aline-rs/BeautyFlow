# AGENTS.md — BeautyFlow

## Objetivo do projeto

Construir o aplicativo mobile BeautyFlow com alta fidelidade visual ao protótipo HTML localizado em:

`design-reference/beautyflow_mvp_mobile_prototype.html`

O app deve ser implementado em React Native com Expo e TypeScript.

## Fonte de verdade visual

O protótipo HTML é a referência visual obrigatória para:
- Cores
- Tipografia
- Espaçamentos
- Bordas
- Cards
- Botões
- Chips de status
- Hierarquia visual
- Fluxo das telas
- Textos-base exibidos no MVP

Ao implementar qualquer tela, primeiro leia o HTML de referência e reproduza o visual em componentes React Native reutilizáveis.

## Regra de fidelidade visual

Não crie uma identidade visual nova.
Não substitua a paleta.
Não troque o tom do produto.
Não use componentes genéricos que descaracterizem o design.

O app deve parecer uma versão mobile nativa do protótipo.

## Stack obrigatória

- Expo
- React Native
- TypeScript
- React Navigation
- Expo Image Picker
- AsyncStorage ou SecureStore para token local
- Axios para consumo da API
- Componentes próprios para o design system

## Design tokens obrigatórios

Use estes tokens no frontend:

```ts
rose: '#C77D8A'
roseLight: '#F7EDEB'
roseDark: '#9E5A65'
nude: '#F7EDEB'
offWhite: '#FFF9F7'
gold: '#D6A85A'
goldLight: '#F5EDD8'
textMain: '#2F2424'
textSecondary: '#7A6A68'
success: '#5FA777'
error: '#D96C6C'
warning: '#E8B84D'
border: 'rgba(199, 125, 138, 0.18)'
borderStrong: 'rgba(199, 125, 138, 0.32)'
```

## Tipografia obrigatória

- Títulos: Playfair Display, fallback serif
- Corpo: DM Sans, fallback sans-serif
- Caso a fonte ainda não esteja configurada, implementar com expo-font antes de finalizar as telas.

## Componentes obrigatórios

Criar componentes reutilizáveis:

- Screen
- TopBar
- AppButton
- AppInput
- AppTextarea
- AppSelect
- AppCard
- AppChip
- Avatar
- PhotoPicker
- BottomTabs
- StatCard
- ListCard
- EmptyState

## Telas obrigatórias do MVP

- Splash
- Login
- Criar Conta
- Home
- Clientes
- Nova Cliente / Editar Cliente
- Detalhes da Cliente
- Serviços
- Novo Serviço / Editar Serviço
- Registrar Atendimento
- Histórico de Atendimentos
- Mensagens
- Detalhe da Mensagem
- Mensagens Padrão
- Meu Salão
- Notificações
- Mais

## Navegação obrigatória

Bottom tabs:
- Início
- Clientes
- Atendimentos
- Mensagens
- Mais

Fluxos internos:
- Mais > Meu salão
- Mais > Serviços
- Mais > Mensagens padrão
- Mais > Notificações
- Clientes > Nova Cliente
- Clientes > Detalhes da Cliente
- Detalhes da Cliente > Registrar Atendimento
- Mensagens > Detalhe da Mensagem
- Home > Registrar Atendimento
- Home > Mensagens

## Qualidade esperada

Antes de concluir qualquer tarefa:
- Rodar TypeScript check
- Rodar lint
- Verificar navegação
- Comparar visualmente com o protótipo HTML
- Garantir que não houve regressão nos componentes compartilhados
- Não deixar código morto
- Não deixar console.log desnecessário
