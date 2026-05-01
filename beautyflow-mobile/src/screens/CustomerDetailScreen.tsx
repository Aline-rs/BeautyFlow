import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { AppChip } from '../components/AppChip';
import { Avatar } from '../components/Avatar';
import { ListCard } from '../components/ListCard';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { useCustomers } from '../features/customers';
import { Customer } from '../features/customers/types';
import { CustomersStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

type Props = NativeStackScreenProps<CustomersStackParamList, 'CustomerDetail'>;

export function CustomerDetailScreen({ navigation, route }: Props) {
  const { customerId } = route.params;
  const { getCustomerById } = useCustomers();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const sortedHistory = useMemo(
    () =>
      [...(customer?.history ?? [])].sort((left, right) => {
        const appointmentDateComparison = right.appointmentDate.localeCompare(left.appointmentDate);
        if (appointmentDateComparison !== 0) {
          return appointmentDateComparison;
        }

        return (right.nextContactDate ?? '').localeCompare(left.nextContactDate ?? '');
      }),
    [customer?.history],
  );

  useFocusEffect(
    useCallback(() => {
      async function loadCustomer() {
        const nextCustomer = await getCustomerById(customerId);
        setCustomer(nextCustomer);
      }

      void loadCustomer();
    }, [customerId, getCustomerById]),
  );

  if (!customer) {
    return (
      <Screen>
        <TopBar title="Detalhes" onBack={() => navigation.goBack()} />
        <View style={styles.loadingState}>
          <Text style={styles.metaText}>Carregando cliente...</Text>
        </View>
      </Screen>
    );
  }

  const currentCustomer = customer;

  function openAppointmentForm(appointmentId?: string) {
    const mode = appointmentId ? 'edit' : 'create';

    navigation
      .getParent()
      ?.getParent()
      ?.navigate('Main', {
        screen: 'AppointmentsTab',
        params: {
          screen: 'AppointmentForm',
          params: {
            mode,
            customerId: currentCustomer.id,
            appointmentId,
          },
        },
      });
  }

  return (
    <Screen>
      <TopBar
        title="Detalhes"
        onBack={() => navigation.goBack()}
        rightLabel="Editar"
        onRightPress={() =>
          navigation.navigate('CustomerForm', {
            customerId: currentCustomer.id,
          })
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <Avatar
            initials={currentCustomer.initials}
            size={76}
            source={currentCustomer.photoUrl ? { uri: currentCustomer.photoUrl } : undefined}
          />
          <Text style={styles.customerName}>{currentCustomer.name}</Text>
          <Text style={styles.metaText}>{`${currentCustomer.whatsapp} - ${currentCustomer.contactPreference}`}</Text>
          <Text style={styles.contextBadge}>{currentCustomer.contextLabel}</Text>
        </View>

        <AppCard style={styles.sectionCard}>
          <View style={styles.summaryBlock}>
            <Text style={styles.metaText}>Ultimo atendimento</Text>
            <Text style={styles.summaryTitle}>{currentCustomer.lastAppointmentLabel ?? 'Sem historico'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.metaText}>Proximo contato</Text>
              <Text style={styles.highlightTitle}>
                {currentCustomer.nextContactDate
                  ? formatLongDate(currentCustomer.nextContactDate)
                  : 'A definir'}
              </Text>
            </View>
            <AppChip label="Pendente" />
          </View>
        </AppCard>

        <AppCard style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Observacoes</Text>
          <Text style={styles.metaParagraph}>
            {currentCustomer.notes ?? 'Nenhuma observacao registrada para esta cliente.'}
          </Text>
        </AppCard>

        <View style={styles.historyHeader}>
          <Text style={[styles.sectionLabel, styles.historyLabel]}>Historico</Text>
          <Pressable style={styles.historyAction} onPress={() => openAppointmentForm()}>
            <Text style={styles.historyActionText}>+ Atendimento</Text>
          </Pressable>
        </View>
        {sortedHistory.length === 0 ? (
          <AppCard style={styles.sectionCard}>
            <Text style={styles.metaParagraph}>
              Esta cliente ainda nao tem atendimentos registrados.
            </Text>
            <Pressable style={styles.emptyHistoryAction} onPress={() => openAppointmentForm()}>
              <Text style={styles.emptyHistoryActionText}>Registrar primeiro atendimento</Text>
            </Pressable>
          </AppCard>
        ) : (
          sortedHistory.map((item) => (
            <ListCard
              key={item.id}
              title={item.serviceName}
              subtitle={`${formatLongDate(item.appointmentDate)} - ${
                item.nextContactDate
                  ? `mensagem para ${formatShortDate(item.nextContactDate)}`
                  : 'sem retorno agendado'
              } - ${item.contextLabel}`}
              right={
                <AppChip
                  label={item.messageStatus}
                  variant={item.messageStatus === 'Enviada' ? 'sent' : 'pending'}
                />
              }
              onPress={() => openAppointmentForm(item.id)}
            />
          ))
        )}
        <AppButton
          label="Abrir WhatsApp"
          variant="secondary"
          onPress={() => void openWhatsApp(currentCustomer)}
        />
      </ScrollView>
    </Screen>
  );
}

async function openWhatsApp(customer: Customer) {
  const digits = customer.whatsapp.replace(/\D/g, '');
  const message = encodeURIComponent(
    `Oi, ${customer.name}! Tudo bem? Vamos agendar seu proximo atendimento?`,
  );

  await Linking.openURL(`https://wa.me/55${digits}?text=${message}`);
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(date));
}

function formatLongDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 18,
  },
  customerName: {
    marginTop: 10,
    fontFamily: typography.fontFamily.title,
    fontSize: 22,
    color: colors.roseDark,
  },
  metaText: {
    marginTop: 4,
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
    color: colors.textSecondary,
  },
  contextBadge: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: colors.roseLight,
    color: colors.roseDark,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
  },
  sectionCard: {
    marginBottom: 12,
  },
  summaryBlock: {
    gap: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 13,
    color: colors.textMain,
  },
  highlightTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 13,
    color: colors.roseDark,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 11,
  },
  sectionLabel: {
    marginBottom: 8,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyLabel: {
    marginBottom: 0,
  },
  historyAction: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
  },
  historyActionText: {
    color: colors.roseDark,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
  },
  metaParagraph: {
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  emptyHistoryAction: {
    alignSelf: 'flex-start',
    marginTop: 12,
    borderRadius: 999,
    backgroundColor: colors.roseLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emptyHistoryActionText: {
    color: colors.roseDark,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
  },
});
