import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { AppChip } from '../components/AppChip';
import { Avatar } from '../components/Avatar';
import { EmptyState } from '../components/EmptyState';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { MessageFilter, ScheduledMessage, useMessages } from '../features/appointments';
import { MessagesStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

type Props = NativeStackScreenProps<MessagesStackParamList, 'MessagesMain'>;

const filters: MessageFilter[] = ['Hoje', 'Pendentes', 'Enviadas', 'Erro'];

export function MessagesScreen({ navigation }: Props) {
  const { messages, isLoading, loadMessages, markAsSent, getWhatsappLink } = useMessages();
  const [selectedFilter, setSelectedFilter] = useState<MessageFilter>('Hoje');

  useFocusEffect(
    useCallback(() => {
      void loadMessages(selectedFilter);
    }, [loadMessages, selectedFilter]),
  );

  const sortedMessages = useMemo(
    () =>
      [...messages].sort((left, right) =>
        left.scheduledForDate > right.scheduledForDate ? 1 : -1,
      ),
    [messages],
  );

  async function openWhatsapp(messageId: string) {
    try {
      const url = await getWhatsappLink(messageId);
      await Linking.openURL(url);
    } catch {
      Alert.alert('Erro', 'Nao foi possivel abrir o WhatsApp.');
    }
  }

  async function handleMarkAsSent(messageId: string) {
    try {
      await markAsSent(messageId);
      await loadMessages(selectedFilter);
    } catch {
      Alert.alert('Erro', 'Nao foi possivel marcar a mensagem como enviada.');
    }
  }

  return (
    <Screen>
      <TopBar title="Mensagens" />
      <View style={styles.content}>
        <View style={styles.tabs}>
          {filters.map((filter) => (
            <Pressable
              key={filter}
              style={[styles.tab, selectedFilter === filter ? styles.activeTab : null]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[styles.tabText, selectedFilter === filter ? styles.activeTabText : null]}>
                {filter}
              </Text>
            </Pressable>
          ))}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.roseDark} />
          </View>
        ) : sortedMessages.length === 0 ? (
          <EmptyState
            title="Nenhuma mensagem nessa lista"
            description="As mensagens agendadas e seus status vao aparecer aqui."
          />
        ) : (
          <ScrollView contentContainerStyle={styles.listContent}>
            {sortedMessages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                onOpen={() =>
                  navigation.navigate('MessageDetail', {
                    messageId: message.id,
                  })
                }
                onOpenWhatsapp={() => void openWhatsapp(message.id)}
                onMarkAsSent={() => void handleMarkAsSent(message.id)}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </Screen>
  );
}

function MessageCard({
  message,
  onOpen,
  onOpenWhatsapp,
  onMarkAsSent,
}: {
  message: ScheduledMessage;
  onOpen: () => void;
  onOpenWhatsapp: () => void;
  onMarkAsSent: () => void;
}) {
  return (
    <Pressable onPress={onOpen}>
      <AppCard style={styles.messageCard}>
        <View style={styles.messageHeader}>
          <Avatar initials={buildInitials(message.customerName)} size={42} />
          <View style={styles.messageMain}>
            <View style={styles.messageTitleRow}>
              <Text style={styles.messageTitle}>{message.customerName}</Text>
              <AppChip label={message.status} variant={chipVariantForStatus(message.status)} />
            </View>
            <Text style={styles.messageSubtitle}>
              {message.serviceName} - Enviar em: {formatLongDate(message.scheduledForDate)}
            </Text>
            <Text style={styles.messageContext}>{message.contextLabel}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.previewText} numberOfLines={3}>
          {message.messageText}
        </Text>

        <View style={styles.actionsRow}>
          <View style={styles.actionButton}>
            <AppButton label="Abrir WhatsApp" onPress={onOpenWhatsapp} />
          </View>
          {message.status === 'Pendente' ? (
            <View style={styles.actionButton}>
              <AppButton label="Marcar enviada" variant="secondary" onPress={onMarkAsSent} />
            </View>
          ) : null}
        </View>
      </AppCard>
    </Pressable>
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
    flex: 1,
    padding: 16,
    backgroundColor: colors.offWhite,
  },
  tabs: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  tab: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
  },
  activeTab: {
    backgroundColor: colors.rose,
    borderColor: colors.rose,
  },
  tabText: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 24,
  },
  messageCard: {
    marginBottom: 9,
  },
  messageHeader: {
    flexDirection: 'row',
    gap: 10,
  },
  messageMain: {
    flex: 1,
  },
  messageTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    alignItems: 'center',
  },
  messageTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 13,
    color: colors.textMain,
  },
  messageSubtitle: {
    marginTop: 2,
    fontFamily: typography.fontFamily.body,
    fontSize: 10,
    color: colors.textSecondary,
  },
  messageContext: {
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: colors.roseLight,
    color: colors.roseDark,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 11,
  },
  previewText: {
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  actionsRow: {
    marginTop: 10,
    gap: 8,
  },
  actionButton: {
    marginBottom: -4,
  },
});
