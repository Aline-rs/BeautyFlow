import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
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

  return (
    <Screen>
      <TopBar
        title="Detalhes"
        onBack={() => navigation.goBack()}
        rightLabel="Editar"
        onRightPress={() =>
          navigation.navigate('CustomerForm', {
            customerId: customer.id,
          })
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <Avatar
            initials={customer.initials}
            size={76}
            source={customer.photoUrl ? { uri: customer.photoUrl } : undefined}
          />
          <Text style={styles.customerName}>{customer.name}</Text>
          <Text style={styles.metaText}>{`${customer.whatsapp} - ${customer.contactPreference}`}</Text>
        </View>

        <AppCard style={styles.sectionCard}>
          <View style={styles.summaryBlock}>
            <Text style={styles.metaText}>Ultimo atendimento</Text>
            <Text style={styles.summaryTitle}>{customer.lastAppointmentLabel ?? 'Sem historico'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.metaText}>Proximo contato</Text>
              <Text style={styles.highlightTitle}>
                {customer.nextContactDate
                  ? formatLongDate(customer.nextContactDate)
                  : 'A definir'}
              </Text>
            </View>
            <AppChip label="Pendente" />
          </View>
        </AppCard>

        <AppCard style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Observacoes</Text>
          <Text style={styles.metaParagraph}>
            {customer.notes ?? 'Nenhuma observacao registrada para esta cliente.'}
          </Text>
        </AppCard>

        <Text style={styles.sectionLabel}>Historico</Text>
        {customer.history.map((item) => (
          <ListCard
            key={item.id}
            title={item.serviceName}
            subtitle={`${formatLongDate(item.appointmentDate)} - ${
              item.nextContactDate
                ? `mensagem para ${formatShortDate(item.nextContactDate)}`
                : 'sem retorno agendado'
            }`}
            right={
              <AppChip
                label={item.messageStatus}
                variant={item.messageStatus === 'Enviada' ? 'sent' : 'pending'}
              />
            }
          />
        ))}

        <AppButton
          label="Registrar atendimento"
          onPress={() =>
            navigation
              .getParent()
              ?.getParent()
              ?.navigate('Main', {
                screen: 'AppointmentsTab',
                params: {
                  screen: 'AppointmentForm',
                  params: {
                    customerId: customer.id,
                  },
                },
              })
          }
        />
        <AppButton
          label="Abrir WhatsApp"
          variant="secondary"
          onPress={() => void openWhatsApp(customer)}
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
    marginBottom: 15,
  },
  customerName: {
    marginTop: 8,
    fontFamily: typography.fontFamily.title,
    fontSize: 20,
    color: colors.roseDark,
  },
  metaText: {
    marginTop: 4,
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
    color: colors.textSecondary,
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
  metaParagraph: {
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },
});
