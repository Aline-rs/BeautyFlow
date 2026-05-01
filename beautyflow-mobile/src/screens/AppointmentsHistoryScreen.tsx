import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppChip } from '../components/AppChip';
import { Avatar } from '../components/Avatar';
import { EmptyState } from '../components/EmptyState';
import { ListCard } from '../components/ListCard';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { useAuth } from '../features/auth';
import { Appointment, useAppointments } from '../features/appointments';
import { AppointmentsStackParamList } from '../navigation/types';
import { colors, radius, typography } from '../theme';

type Props = NativeStackScreenProps<AppointmentsStackParamList, 'AppointmentsMain'>;
type TimeFilter = 'Todos' | 'Este mes' | 'Mes passado';

const timeFilters: TimeFilter[] = ['Todos', 'Este mes', 'Mes passado'];

export function AppointmentsHistoryScreen({ navigation }: Props) {
  const { session } = useAuth();
  const { appointments, isLoading, loadAppointments } = useAppointments();
  const [search, setSearch] = useState('');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<TimeFilter>('Todos');
  const [selectedSalonId, setSelectedSalonId] = useState<string | 'all'>('all');

  useFocusEffect(
    useCallback(() => {
      void loadAppointments();
    }, [loadAppointments]),
  );

  const filteredAppointments = useMemo(() => {
    const today = new Date();

    return appointments.filter((appointment) => {
      const normalizedSearch = search.trim().toLowerCase();
      const serviceSearchableText = appointment.serviceNames.join(' ').toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        appointment.customerName.toLowerCase().includes(normalizedSearch) ||
        serviceSearchableText.includes(normalizedSearch);

      if (!matchesSearch) {
        return false;
      }

      if (selectedSalonId !== 'all' && appointment.contextSalonId !== selectedSalonId) {
        return false;
      }

      const appointmentDate = new Date(`${appointment.appointmentDate}T00:00:00`);
      if (selectedTimeFilter === 'Este mes') {
        return (
          appointmentDate.getMonth() === today.getMonth() &&
          appointmentDate.getFullYear() === today.getFullYear()
        );
      }

      if (selectedTimeFilter === 'Mes passado') {
        const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        return (
          appointmentDate.getMonth() === previousMonthDate.getMonth() &&
          appointmentDate.getFullYear() === previousMonthDate.getFullYear()
        );
      }

      return true;
    });
  }, [appointments, search, selectedSalonId, selectedTimeFilter]);

  return (
    <Screen>
      <TopBar title="Atendimentos" />

      <View style={styles.content}>
        <TextInput
          placeholder="Buscar por cliente ou servico"
          placeholderTextColor="#A7918D"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.filtersGroup}>
          <View style={styles.filtersRow}>
            {timeFilters.map((filter) => (
              <Pressable
                key={filter}
                style={[styles.filterChip, selectedTimeFilter === filter ? styles.filterChipActive : null]}
                onPress={() => setSelectedTimeFilter(filter)}
              >
                <Text style={[styles.filterChipText, selectedTimeFilter === filter ? styles.filterChipTextActive : null]}>
                  {filter}
                </Text>
              </Pressable>
            ))}
          </View>

          {session?.salons.length ? (
            <View style={styles.filtersRow}>
              {session.salons.map((salon) => (
                <Pressable
                  key={salon.id}
                  style={[styles.filterChip, selectedSalonId === salon.id ? styles.filterChipActive : null]}
                  onPress={() => setSelectedSalonId((current) => (current === salon.id ? 'all' : salon.id))}
                >
                  <Text style={[styles.filterChipText, selectedSalonId === salon.id ? styles.filterChipTextActive : null]}>
                    {salon.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.roseDark} />
          </View>
        ) : filteredAppointments.length === 0 ? (
          <EmptyState
            title="Nenhum atendimento encontrado"
            description="Registre um novo atendimento para comecar seu historico."
          />
        ) : (
          <ScrollView contentContainerStyle={styles.listContent}>
            {filteredAppointments.map((appointment) => (
              <AppointmentHistoryCard key={appointment.id} appointment={appointment} />
            ))}
          </ScrollView>
        )}

        <Pressable style={styles.fab} onPress={() => navigation.navigate('AppointmentForm', {})}>
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

function AppointmentHistoryCard({ appointment }: { appointment: Appointment }) {
  const servicesLabel =
    appointment.serviceNames.length > 0
      ? appointment.serviceNames.join(' + ')
      : appointment.serviceName;

  return (
    <ListCard
      title={appointment.customerName}
      subtitle={`${servicesLabel} - ${formatLongDate(appointment.appointmentDate)}`}
      extraSubtitle={
        appointment.messageStatus === 'Enviada'
          ? `${appointment.contextLabel} - Mensagem enviada`
          : `${appointment.contextLabel} - Mensagem agendada para ${formatLongDate(appointment.scheduledForDate)}`
      }
      left={
        <Avatar
          initials={appointment.customerInitials}
          size={42}
          source={appointment.customerPhotoUrl ? { uri: appointment.customerPhotoUrl } : undefined}
        />
      }
      right={
        <AppChip
          label={appointment.messageStatus}
          variant={chipVariantForStatus(appointment.messageStatus)}
        />
      }
    />
  );
}

function chipVariantForStatus(status: Appointment['messageStatus']) {
  if (status === 'Enviada') {
    return 'sent' as const;
  }

  if (status === 'Erro') {
    return 'error' as const;
  }

  return 'pending' as const;
}

function formatLongDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${date}T12:00:00`));
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.offWhite,
  },
  searchInput: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    paddingHorizontal: 13,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    color: colors.textMain,
    fontFamily: typography.fontFamily.body,
    fontSize: 13,
  },
  filtersGroup: {
    marginBottom: 12,
    gap: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  filterChipActive: {
    backgroundColor: colors.rose,
    borderColor: colors.rose,
  },
  filterChipText: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 96,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.rose,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.roseDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 5,
  },
  fabText: {
    color: '#FFFFFF',
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 26,
  },
});
