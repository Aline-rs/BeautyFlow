# 09 — Design System UI — BeautyFlow

## 1. Conceito visual

O app deve transmitir:

- Cuidado
- Beleza
- Organização
- Confiança
- Praticidade

Estilo: clean, feminino, elegante, acolhedor e profissional.

## 2. Cores

```text
Primária — Rose elegante — #C77D8A
Secundária — Nude claro — #F7EDEB
Fundo — Off-white — #FFF9F7
Rose escuro — #9E5A65
Texto principal — #2F2424
Texto secundário — #7A6A68
Destaque — Dourado suave — #D6A85A
Dourado claro — #F5EDD8
Sucesso — #5FA777
Alerta — #E8B84D
Erro — #D96C6C
Borda — rgba(199, 125, 138, 0.18)
Borda forte — rgba(199, 125, 138, 0.32)
```

## 3. Tipografia

### Títulos

- Fonte: Playfair Display
- Peso: 600
- Uso: logo, título de tela, destaque visual

### Texto comum

- Fonte: DM Sans
- Peso: 400/500
- Uso: campos, labels, listas, botões

## 4. Componentes

### Botão primário

- Fundo rose.
- Texto branco.
- Border radius 13.
- Usar para ação principal.

### Botão secundário

- Fundo transparente.
- Borda rose.
- Texto rose.

### Botão ghost

- Fundo transparente.
- Borda suave.
- Texto secundário.

### Card

- Fundo branco.
- Borda suave.
- Border radius 15.
- Sombra leve.

### Chip

Status:

```text
Pendente — goldLight
Enviada — verde claro
Erro — vermelho claro
Inativo — cinza/nude
```

### Avatar

- Se tiver foto, exibir imagem circular.
- Se não tiver foto, exibir iniciais.

## 5. Telas obrigatórias

- Splash
- Login
- Criar Conta
- Home
- Clientes
- Nova Cliente
- Detalhe Cliente
- Serviços
- Novo Serviço
- Registrar Atendimento
- Histórico de Atendimentos
- Mensagens
- Detalhe da Mensagem
- Mensagens Padrão
- Meu Salão
- Notificações
- Mais

## 6. Tom de voz

Usar linguagem simples, humana e acolhedora.

Exemplos:

```text
Atendimento salvo. A mensagem de retorno já foi agendada.
Você tem 3 clientes para chamar hoje.
Vamos cadastrar sua primeira cliente?
```

Evitar linguagem muito técnica.

## 7. Estados vazios

Exemplo clientes:

```text
Nenhuma cliente cadastrada ainda.
Cadastre sua primeira cliente para começar a acompanhar os retornos.
```

Exemplo mensagens:

```text
Nenhuma mensagem pendente hoje.
Quando houver clientes para chamar, elas aparecerão aqui.
```
