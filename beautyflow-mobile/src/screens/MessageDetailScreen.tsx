import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { AppChip } from '../components/AppChip';
import { Avatar } from '../components/Avatar';
import { AppTextarea } from '../components/AppTextarea';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { ScheduledMessage, useMessages } from '../features/appointments';
import { MessagesStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

type Props = NativeStackScreenProps<MessagesStackParamList, 'MessageDetail'>;

export function MessageDetailScreen({ navigation, route }: Props) {
  const { messageId } = route.params;
  const { getMessageById, saveMessageText, markAsSent, cancelScheduledMessage, getWhatsappLink } =
    useMessages();
  const [message, setMessage] = useState<ScheduledMessage | null>(null);
  const [draftText, setDraftText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function loadMessage() {
        const nextMessage = await getMessageById(messageId);
        setMessage(nextMessage);
        setDraftText(nextMessage?.messageText ?? '');
      }

      void loadMessage();
    }, [getMessageById, messageId]),
  );

  async function handleSave() {
    if (!message) {
      return;
    }

    setIsSaving(true);
    try {
      const updatedMessage = await saveMessageText(message.id, draftText);
      setMessage(updatedMessage);
    } catch {
      Alert.alert('Erro', 'Nao foi possivel salvar a mensagem.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleOpenWhatsapp() {
    if (!message) {
      return;
    }

    try {
      const url = await getWhatsappLink(message.id);
      await Linking.openURL(url);
    } catch {
      Alert.alert('Erro', 'Nao foi possivel abrir o WhatsApp.');
    }
  }

  async function handleMarkAsSent() {
    if (!message) {
      return;
    }

    try {
      const updatedMessage = await markAsSent(message.id);
      setMessage(updatedMessage);
    } catch {
      Alert.alert('Erro', 'Nao foi possivel marcar a mensagem como enviada.');
    }
  }

  async function handleCancel() {
    if (!message) {
      return;
    }

    try {
      const updatedMessage = await cancelScheduledMessage(message.id);
      setMessage(updatedMessage);
    } catch {
      Alert.alert('Erro', 'Nao foi possivel cancelar a mensagem.');
    }
  }

  if (!message) {
    return (
      <Screen>
        <TopBar title="Detalhe da mensagem" onBack={() => navigation.goBack()} />
        <View style={styles.loadingState}>
          <Text style={styles.metaText}>Carregando mensagem...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title="Detalhe da mensagem" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <AppCard style={styles.headerCard}>
          <View style={styles.customerRow}>
            <Avatar initials={buildInitials(message.customerName)} size={50} />
            <View style={styles.customerMain}>
              <Text style={styles.customerName}>{message.customerName}</Text>
              <Text style={styles.metaText}>{message.customerWhatsapp}</Text>
            </View>
            <AppChip label={message.status} variant={chipVariantForStatus(message.status)} />
          </View>
        </AppCard>

        <AppCard style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.metaLabel}>Servico</Text>
              <Text style={styles.summaryValue}>{message.serviceName}</Text>
            </View>
            <View style={styles.summaryRight}>
              <Text style={styles.metaLabel}>Enviar em</Text>
              <Text style={styles.highlightValue}>{formatLongDate(message.scheduledForDate)}</Text>
            </View>
          </View>
        </AppCard>

        <AppTextarea
          label="Mensagem"
          value={draftText}
          onChangeText={setDraftText}
          style={styles.messageField}
        />

        <AppButton label="Salvar texto" onPress={() => void handleSave()} loading={isSaving} />
        <AppButton label="Abrir WhatsApp" onPress={() => void handleOpenWhatsapp()} />
        <AppButton label="Marcar como enviada" variant="secondary" onPress={() => void handleMarkAsSent()} />
        <AppButton label="Cancelar mensagem" variant="ghost" onPress={() => void handleCancel()} />
      </ScrollView>
    </Screen>
  );
}

function buildInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function chipVariantForStatus(status: ScheduledMessage['status']) {
  if (status === 'Enviada') {
    return 'sent' as const;
  }

  if (status === 'Erro') {
    return 'error' as const;
  }

  if (status === 'Cancelada') {
    return 'inactive' as const;
  }

  return 'pending' as const;
}

function formatLongDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${date}T00:00:00`));
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: colors.offWhite,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCard: {
    marginBottom: 10,
  },
  customerRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  customerMain: {
    flex: 1,
  },
  customerName: {
    fontFamily: typography.fontFamily.title,
    fontSize: 18,
    color: colors.roseDark,
  },
  metaText: {
    marginTop: 4,
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
    color: colors.textSecondary,
  },
  summaryCard: {
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  metaLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: 10,
    color: colors.textSecondary,
  },
  summaryValue: {
    marginTop: 2,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 13,
    color: colors.textMain,
  },
  highlightValue: {
    marginTop: 2,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 13,
    color: colors.roseDark,
  },
  messageField: {
    minHeight: 128,
  },
});
