# BeautyFlow

BeautyFlow é um sistema SaaS para salões de beleza, criado para ajudar profissionais a gerenciar clientes, serviços, atendimentos e lembretes de retorno de forma simples e organizada.

O objetivo do projeto é centralizar as informações das clientes, manter um histórico de atendimentos e facilitar o contato no momento certo, melhorando o relacionamento entre salão e cliente.

---

## 📱 Visão geral

O BeautyFlow possui:

- Backend em .NET
- Banco de dados PostgreSQL
- API documentada com Swagger
- Aplicativo mobile desenvolvido com Expo/React Native
- Autenticação com JWT
- Cadastro de salão e usuários
- Cadastro de clientes
- Upload de foto da cliente
- Cadastro de serviços
- Registro de atendimentos
- Geração de lembretes e mensagens agendadas

---

## 🧩 Estrutura do projeto

```text
BeautyFlow
├── beautyflow-api
│   └── src
│       ├── BeautyFlow.Api
│       ├── BeautyFlow.Application
│       ├── BeautyFlow.Domain
│       └── BeautyFlow.Infrastructure
│
├── beautyflow-mobile
│
├── beautyflow_codex_docs
├── docs
├── specs
├── design-reference
├── README.md
└── BeautyFlow.slnx
```

---

## 🛠️ Tecnologias utilizadas

### Backend

- .NET 8
- C#
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- Swagger / OpenAPI

### Mobile

- React Native
- Expo
- TypeScript
- npm

### Banco de dados

- PostgreSQL
- pgAdmin
- Migrations com Entity Framework Core

---

## 🧠 Principais entidades

O sistema trabalha com as seguintes entidades principais:

- `Salon`: representa o salão de beleza.
- `User`: representa o usuário vinculado a um salão.
- `Customer`: representa uma cliente do salão.
- `Service`: representa um serviço oferecido pelo salão.
- `Appointment`: representa um atendimento realizado.
- `ScheduledMessage`: representa uma mensagem/lembrete agendado.
- `MessageTemplate`: representa o modelo de mensagem usado pelo salão.
- `NotificationSettings`: representa as configurações de notificação do salão.

---

## ✅ Pré-requisitos

Antes de executar o projeto, instale:

- .NET SDK 8
- Node.js
- npm
- PostgreSQL
- pgAdmin
- Git

Também é recomendado instalar a ferramenta do Entity Framework:

```bash
dotnet tool install --global dotnet-ef
```

Caso já tenha instalado, atualize:

```bash
dotnet tool update --global dotnet-ef
```

---

## 🗄️ Configuração do banco de dados

O projeto utiliza PostgreSQL.

Durante a instalação local do PostgreSQL, recomenda-se usar:

```text
Usuário: postgres
Senha: postgres
Porta: 5432
```

Crie um banco local chamado:

```text
beautyflow_dev
```

Ou deixe que o Entity Framework crie automaticamente ao executar o comando de atualização do banco.

---

## ⚙️ Configuração do backend

Acesse o arquivo de configuração do backend:

```text
beautyflow-api/src/BeautyFlow.Api/appsettings.Development.json
```

Configure a connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=beautyflow_dev;Username=postgres;Password=postgres"
  },
  "Jwt": {
    "Issuer": "BeautyFlow",
    "Audience": "BeautyFlow.Mobile",
    "Key": "CHANGE_THIS_DEVELOPMENT_KEY_WITH_AT_LEAST_32_CHARS",
    "ExpiresInMinutes": 120
  },
  "AllowedHosts": "*"
}
```

> Importante: em produção, nunca utilize senha simples nem chave JWT de desenvolvimento.

---

## 🧱 Criando as tabelas no banco

Na raiz do projeto:

```bash
cd C:\Workspace\BeautyFlow
```

Execute a migration:

```bash
dotnet ef migrations add InitialCreate --project beautyflow-api/src/BeautyFlow.Infrastructure --startup-project beautyflow-api/src/BeautyFlow.Api
```

Depois aplique a migration no banco:

```bash
dotnet ef database update --project beautyflow-api/src/BeautyFlow.Infrastructure --startup-project beautyflow-api/src/BeautyFlow.Api
```

Após executar o comando, as tabelas serão criadas no PostgreSQL.

No pgAdmin, elas estarão em:

```text
beautyflow_dev
  > Schemas
    > public
      > Tables
```

Tabelas esperadas:

```text
__EFMigrationsHistory
salons
users
customers
services
appointments
scheduled_messages
message_templates
notification_settings
```

---

## ▶️ Executando o backend

Na raiz do projeto, execute:

```bash
dotnet run --project beautyflow-api/src/BeautyFlow.Api
```

A API será iniciada em uma URL semelhante a:

```text
https://localhost:7217
```

ou:

```text
http://localhost:5020
```

---

## 📘 Acessando o Swagger

Com a API em execução, acesse:

```text
https://localhost:7217/swagger
```

O Swagger permite testar os endpoints da API diretamente pelo navegador.

---

## 🔐 Autenticação

A API utiliza autenticação JWT.

Após realizar login, copie o token retornado e clique em **Authorize** no Swagger.

Informe no seguinte formato:

```text
Bearer SEU_TOKEN_AQUI
```

Endpoints protegidos só funcionarão com o token JWT válido.

---

## 📱 Executando o app mobile

Entre na pasta do projeto mobile:

```bash
cd C:\Workspace\BeautyFlow\beautyflow-mobile
```

Instale as dependências:

```bash
npm install
```

Inicie o app:

```bash
npm run start
```

Depois, use o Expo para abrir o aplicativo no celular ou no emulador.

---

## 🌐 Configuração da URL da API no mobile

Para o app mobile se comunicar com a API local, verifique a configuração da URL da API no projeto mobile.

Em ambiente local, evite usar apenas:

```text
localhost
```

Quando o app roda no celular, `localhost` aponta para o próprio celular, não para o computador.

Use o IP da sua máquina na rede local, por exemplo:

```text
http://192.168.0.10:5020
```

ou a URL configurada para sua API.

---

## 🧪 Testando o fluxo principal

Fluxo recomendado para validação:

1. Subir o PostgreSQL.
2. Rodar as migrations.
3. Iniciar a API.
4. Abrir o Swagger.
5. Criar um salão/usuário.
6. Realizar login.
7. Copiar o token JWT.
8. Autorizar no Swagger.
9. Cadastrar clientes.
10. Cadastrar serviços.
11. Registrar atendimentos.
12. Validar os dados no pgAdmin.
13. Abrir o app mobile.
14. Testar o fluxo pelo aplicativo.

---

## 🖼️ Upload de foto da cliente

O sistema permite fazer upload de foto para uma cliente.

O endpoint de upload utiliza:

```text
multipart/form-data
```

Formatos aceitos:

```text
.jpg
.jpeg
.png
.webp
```

As imagens são salvas em:

```text
wwwroot/uploads/customers
```

E o caminho da imagem é armazenado no cadastro da cliente.

---

## 🐘 Consultas úteis no PostgreSQL

Como as colunas foram criadas pelo Entity Framework com nomes em PascalCase, no PostgreSQL é necessário usar aspas duplas nos nomes das colunas.

Exemplo:

```sql
SELECT *
FROM salons s
WHERE s."Email" = 'pedro@email.com';
```

Buscar usuários:

```sql
SELECT *
FROM users u;
```

Buscar usuário por e-mail:

```sql
SELECT *
FROM users u
WHERE u."Email" = 'pedro@email.com';
```

Deletar usuário por e-mail:

```sql
DELETE FROM users
WHERE "Email" = 'pedro@email.com';
```

Consultar tabelas existentes:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Consultar colunas de uma tabela:

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'salons'
ORDER BY ordinal_position;
```

---

## 🧯 Problemas comuns

### Erro: `Could not read package.json`

Esse erro acontece quando o comando `npm run start` é executado fora da pasta do mobile.

Entre na pasta correta:

```bash
cd C:\Workspace\BeautyFlow\beautyflow-mobile
npm run start
```

---

### Erro: `Your startup project doesn't reference Microsoft.EntityFrameworkCore.Design`

Instale o pacote no projeto da API:

```bash
dotnet add beautyflow-api/src/BeautyFlow.Api package Microsoft.EntityFrameworkCore.Design --version 8.0.4
```

Se necessário, instale também no projeto Infrastructure:

```bash
dotnet add beautyflow-api/src/BeautyFlow.Infrastructure package Microsoft.EntityFrameworkCore.Design --version 8.0.4
```

---

### Erro de versão do Entity Framework

Mantenha os pacotes do Entity Framework na mesma versão.

Exemplo usado no projeto:

```text
8.0.4
```

---

### Swagger falhando ao carregar

Se o Swagger falhar em um endpoint de upload de arquivo, confirme se o endpoint está usando:

```csharp
[Consumes("multipart/form-data")]
```

E se o parâmetro está como:

```csharp
IFormFile photo
```

---

### Tabelas não aparecem no pgAdmin

Clique com o botão direito em:

```text
Tables
```

E selecione:

```text
Refresh
```

Também confirme se você está olhando o banco correto:

```text
beautyflow_dev
```

---

## 🚀 Possível deploy gratuito

Para uma versão inicial de validação, o projeto pode ser publicado usando:

- Supabase Free para PostgreSQL
- Render Free para hospedar a API
- Expo/EAS para gerar build do aplicativo mobile

Essa configuração é útil para MVP, testes, portfólio e validação com poucos usuários.

Para produção real, será necessário avaliar hospedagem paga, segurança, backups, logs e monitoramento.

---

## 📌 Status do projeto

O projeto está em fase de desenvolvimento/MVP.

Funcionalidades já estruturadas:

- Backend com arquitetura em camadas
- Banco PostgreSQL configurado
- Migrations funcionando
- Swagger funcionando
- Autenticação JWT
- Cadastro de salão
- Cadastro de usuário
- Cadastro de clientes
- Upload de foto da cliente
- Cadastro de serviços
- Registro de atendimentos
- App mobile com Expo

---

## 👩‍💻 Desenvolvido por

Projeto desenvolvido por Aline como estudo e construção de um SaaS para gestão de salões de beleza.
