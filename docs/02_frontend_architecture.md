# 02 — Arquitetura Frontend Mobile

## 1. Objetivo

Construir o aplicativo mobile BeautyFlow com React Native, Expo e TypeScript, transformando o protótipo HTML/CSS/JS em um app real, componentizado, navegável, testável e preparado para consumir API.

## 2. Stack

- React Native
- Expo
- TypeScript
- React Navigation
- Axios
- React Hook Form
- Zod
- Expo Image Picker
- Expo SecureStore ou AsyncStorage
- Expo Linking
- Lucide React Native, opcional

## 3. Estrutura de pastas

```text
beautyflow-mobile/
  src/
    app/
      AppNavigator.tsx
      AuthNavigator.tsx
      MainTabs.tsx
      RootStack.tsx
    components/
      AppButton.tsx
      AppCard.tsx
      AppChip.tsx
      AppInput.tsx
      AppSelect.tsx
      Avatar.tsx
      EmptyState.tsx
      FormField.tsx
      PhotoPicker.tsx
      Screen.tsx
      TopBar.tsx
    features/
      auth/
        screens/
        services/
        schemas/
      customers/
        screens/
        services/
        schemas/
        components/
      services/
        screens/
        services/
        schemas/
      appointments/
        screens/
        services/
        schemas/
      messages/
        screens/
        services/
        schemas/
      settings/
        screens/
        services/
        schemas/
    theme/
      colors.ts
      typography.ts
      spacing.ts
      shadows.ts
      index.ts
    services/
      api.ts
      tokenStorage.ts
      whatsapp.ts
    types/
      api.ts
      domain.ts
    utils/
      date.ts
      phone.ts
      template.ts
```

## 4. Navegação

### Auth Stack

```text
Splash
Login
SignUp
```

### Main Tabs

```text
Home
Customers
Appointments
Messages
More
```

### Root Stack sobre tabs

```text
CustomerForm
CustomerDetail
ServiceForm
Services
AppointmentForm
MessageDetail
MessageTemplate
SalonProfile
Notifications
```

## 5. Design system

### Cores

```ts
export const colors = {
  rose: '#C77D8A',
  roseLight: '#F7EDEB',
  roseDark: '#9E5A65',
  nude: '#F7EDEB',
  offWhite: '#FFF9F7',
  gold: '#D6A85A',
  goldLight: '#F5EDD8',
  textMain: '#2F2424',
  textSecondary: '#7A6A68',
  success: '#5FA777',
  error: '#D96C6C',
  warning: '#E8B84D',
  border: 'rgba(199, 125, 138, 0.18)',
  borderStrong: 'rgba(199, 125, 138, 0.32)',
  white: '#FFFFFF',
};
```

### Tipografia

- Títulos: Playfair Display, quando disponível.
- Texto e botões: DM Sans, quando disponível.
- Fallback: fonte padrão do sistema.

### Componentes base

- `Screen`
- `TopBar`
- `AppButton`
- `AppInput`
- `AppSelect`
- `AppCard`
- `AppChip`
- `Avatar`
- `PhotoPicker`
- `EmptyState`

## 6. Gerenciamento de estado

Para o MVP, usar:

- `useState` e `useEffect` para estado local.
- Context API para autenticação.
- Services com Axios para chamadas HTTP.

Não usar Redux no MVP.

## 7. Formulários

Usar React Hook Form + Zod.

### Exemplo de validação Cliente

```ts
const customerSchema = z.object({
  name: z.string().min(2, 'Informe o nome da cliente.'),
  phone: z.string().min(10, 'Informe um WhatsApp válido.'),
  birthDate: z.string().optional(),
  contactPreference: z.enum(['WhatsApp', 'Phone', 'Sms']),
  notes: z.string().optional(),
  photoUri: z.string().optional(),
});
```

## 8. Upload de foto da cliente

No MVP, o mobile deve permitir escolher foto via `expo-image-picker`.

Fluxo:

1. Usuária toca em “Inserir foto”.
2. App solicita permissão.
3. Usuária escolhe imagem.
4. App exibe preview.
5. Ao salvar cliente, enviar imagem para backend via multipart/form-data ou salvar URI temporária se backend ainda não estiver pronto.

## 9. WhatsApp

Usar `Linking.openURL` para abrir WhatsApp.

Formato:

```text
https://wa.me/55{telefone}?text={mensagemUrlEncoded}
```

Não enviar automaticamente no MVP.

## 10. Tratamento de erros

- Mostrar mensagens amigáveis.
- Não exibir stack trace.
- Erros de validação próximos aos campos.
- Erros de API em toast ou alerta.

## 11. Performance

- Usar FlatList para listas.
- Evitar renderizações desnecessárias.
- Comprimir foto antes de upload quando possível.
- Paginar mensagens e clientes no backend quando crescer.

## 12. Acessibilidade

- Botões com texto claro.
- Inputs com labels.
- Contraste adequado.
- Áreas de toque mínimas.
- Não depender apenas de cor para status.
