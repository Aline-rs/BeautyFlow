import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { Avatar } from '../components/Avatar';
import { ListCard } from '../components/ListCard';
import { Screen } from '../components/Screen';
import { StatCard } from '../components/StatCard';
import { fetchAppointments } from '../features/appointments/appointmentsService';
import { Appointment, ScheduledMessage } from '../features/appointments/types';
import { fetchMessages } from '../features/appointments/messagesService';
import { useAuth } from '../features/auth';
import { fetchCustomers } from '../features/customers/customersService';
import { Customer } from '../features/customers/types';
import { HomeStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

type DashboardState = {
  customers: Customer[];
  appointments: Appointment[];
  pendingMessages: ScheduledMessage[];
};

export function HomeScreen({ navigation }: Props) {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardState>({
    customers: [],
    appointments: [],
    pendingMessages: [],
  });

  useFocusEffect(
    useCallback(() => {
      async function loadDashboard() {
        setIsLoading(true);

        try {
          const [customers, appointments, pendingMessages] = await Promise.all([
            fetchCustomers(),
            fetchAppointments(),
            fetchMessages('Pendentes'),
          ]);

          setDashboard({
            customers,
            appointments,
            pendingMessages,
          });
        } finally {
          setIsLoading(false);
        }
      }

      void loadDashboard();
    }, []),
  );

  const firstName = useMemo(() => {
    const name = session?.user.name?.trim();
    if (!name) {
      return 'profissional';
    }

    return name.split(' ')[0] ?? 'profissional';
  }, [session?.user.name]);

  const upcomingCustomers = useMemo(() => {
    const today = new Date();
    const nextWeek = addDays(today, 7);

    return dashboard.customers
      .filter((customer) => {
        if (!customer.nextContactDate) {
          return false;
        }

        const nextContactDate = parseIsoDate(customer.nextContactDate);
        return nextContactDate >= startOfDay(today) && nextContactDate <= endOfDay(nextWeek);
      })
      .sort((left, right) => {
        const leftDate = left.nextContactDate ?? '';
        const rightDate = right.nextContactDate ?? '';
        return leftDate.localeCompare(rightDate);
      });
  }, [dashboard.customers]);

  const weeklySummary = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);

    const weeklyAppointments = dashboard.appointments.filter((appointment) => {
      const appointmentDate = parseIsoDate(appointment.appointmentDate);
      return appointmentDate >= weekStart && appointmentDate <= weekEnd;
    });

    const weeklyCustomers = new Set(weeklyAppointments.map((appointment) => appointment.customerId));
    const weeklyFollowUps = dashboard.pendingMessages.filter((message) => {
      const scheduledDate = parseIsoDate(message.scheduledForDate);
      return scheduledDate >= weekStart && scheduledDate <= weekEnd;
    });

    return {
      appointments: weeklyAppointments.length,
      servedCustomers: weeklyCustomers.size,
      scheduledFollowUps: weeklyFollowUps.length,
    };
  }, [dashboard.appointments, dashboard.pendingMessages]);

  const nextDueCustomer = upcomingCustomers[0];
  const tabsNavigation = navigation.getParent();

  function openSalons() {
    (tabsNavigation as { navigate: (route: string, params?: unknown) => void } | undefined)?.navigate('MoreTab', {
      screen: 'Salons',
    });
  }

  function openCustomers() {
    (tabsNavigation as { navigate: (route: string, params?: unknown) => void } | undefined)?.navigate('CustomersTab', {
      screen: 'CustomersMain',
    });
  }

  function openCustomerDetail(customerId: string) {
    (tabsNavigation as { navigate: (route: string, params?: unknown) => void } | undefined)?.navigate('CustomersTab', {
      screen: 'CustomerDetail',
      params: {
        customerId,
      },
    });
  }

  function openMessages() {
    (tabsNavigation as { navigate: (route: string, params?: unknown) => void } | undefined)?.navigate('MessagesTab', {
      screen: 'MessagesMain',
    });
  }

  function openAppointmentForm() {
    (tabsNavigation as { navigate: (route: string, params?: unknown) => void } | undefined)?.navigate('AppointmentsTab', {
      screen: 'AppointmentForm',
    });
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroHeaderRow}>
            <View style={styles.heroTextBlock}>
              <Text style={styles.title}>Home</Text>
              <Text style={styles.subtitle}>Ola {firstName}, seja bem vindo de volta!</Text>
            </View>
            <View style={styles.heroAvatarWrap}>
              <Avatar
                initials={buildInitials(session?.user.name ?? 'BF')}
                size={52}
                source={session?.user.profilePhotoUrl ? { uri: session.user.profilePhotoUrl } : undefined}
              />
            </View>
          </View>

          <View style={styles.quickActions}>
            <View style={styles.quickActionButton}>
              <AppButton
                label="Registrar atendimento"
                onPress={openAppointmentForm}
              />
            </View>
            <View style={styles.quickActionButton}>
              <AppButton
                label="Abrir mensagens"
                variant="secondary"
                onPress={openMessages}
              />
            </View>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.roseDark} />
          </View>
        ) : (
          <>
            <AppCard style={styles.summaryCard}>
              <Text style={styles.sectionLabel}>Resumo da semana</Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{weeklySummary.appointments}</Text>
                  <Text style={styles.summaryLabel}>Atendimentos</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{weeklySummary.servedCustomers}</Text>
                  <Text style={styles.summaryLabel}>Clientes atendidas</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{weeklySummary.scheduledFollowUps}</Text>
                  <Text style={styles.summaryLabel}>Retornos programados</Text>
                </View>
              </View>
            </AppCard>

            <View style={styles.statsGrid}>
              <Pressable
                style={styles.statPressable}
                onPress={openSalons}
              >
                <StatCard value={String(session?.salons.length ?? 0)} label="Saloes cadastrados" />
              </Pressable>

              <Pressable
                style={styles.statPressable}
                onPress={openCustomers}
              >
                <StatCard value={String(dashboard.customers.length)} label="Clientes cadastradas" />
              </Pressable>

              <Pressable
                style={styles.statPressable}
                onPress={openMessages}
              >
                <StatCard value={String(dashboard.pendingMessages.length)} label="Mensagens para enviar" />
              </Pressable>

              <Pressable
                style={styles.statPressable}
                onPress={openCustomers}
              >
                <StatCard value={String(upcomingCustomers.length)} label="Clientes com retorno proximo" />
              </Pressable>
            </View>

            <AppCard style={styles.highlightCard}>
              <Text style={styles.sectionLabel}>Atividade em destaque</Text>
              {nextDueCustomer ? (
                <ListCard
                  title={nextDueCustomer.name}
                  subtitle={nextDueCustomer.whatsapp}
                  extraSubtitle={`${nextDueCustomer.contextLabel} - retorno em ${formatShortDate(nextDueCustomer.nextContactDate ?? '')}`}
                  left={
                    <Avatar
                      initials={nextDueCustomer.initials}
                      size={42}
                      source={nextDueCustomer.photoUrl ? { uri: nextDueCustomer.photoUrl } : undefined}
                    />
                  }
                  onPress={() => openCustomerDetail(nextDueCustomer.id)}
                  style={styles.highlightListCard}
                />
              ) : (
                <Text style={styles.emptyCopy}>
                  Nenhuma cliente com retorno proximo nesta semana. Aproveite para organizar os proximos atendimentos.
                </Text>
              )}
            </AppCard>
          </>
        )}
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

function parseIsoDate(date: string) {
  return new Date(`${date}T00:00:00`);
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

function addDays(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeek(date: Date) {
  const next = startOfDay(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  return next;
}

function endOfWeek(date: Date) {
  const next = startOfWeek(date);
  next.setDate(next.getDate() + 6);
  return endOfDay(next);
}

function formatShortDate(date: string) {
  if (!date) {
    return '--';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(parseIsoDate(date));
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: colors.offWhite,
  },
  hero: {
    marginBottom: 12,
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#FFF3F1',
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  heroTextBlock: {
    flex: 1,
  },
  heroAvatarWrap: {
    marginLeft: 'auto',
  },
  title: {
    fontFamily: typography.fontFamily.title,
    fontSize: 30,
    color: colors.roseDark,
  },
  subtitle: {
    marginTop: 6,
    fontFamily: typography.fontFamily.body,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  quickActions: {
    marginTop: 14,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quickActionButton: {
    flex: 1,
  },
  loadingContainer: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.sm,
    marginBottom: 12,
  },
  statPressable: {
    flexBasis: '48.5%',
    maxWidth: '48.5%',
  },
  sectionLabel: {
    marginBottom: 10,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  summaryCard: {
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 10,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontFamily: typography.fontFamily.title,
    fontSize: 26,
    color: colors.roseDark,
  },
  summaryLabel: {
    marginTop: 4,
    fontFamily: typography.fontFamily.body,
    fontSize: 11,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  highlightCard: {
    marginBottom: 12,
  },
  highlightListCard: {
    marginBottom: 0,
    padding: 0,
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  emptyCopy: {
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },
});
