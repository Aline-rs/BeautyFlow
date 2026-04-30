import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppChip } from '../components/AppChip';
import { EmptyState } from '../components/EmptyState';
import { ListCard } from '../components/ListCard';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { Appointment, useAppointments } from '../features/appointments';
import { AppointmentsStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

type Props = NativeStackScreenProps<AppointmentsStackParamList, 'AppointmentsMain'>;
type FilterTab = 'Todos' | 'Este mes' | 'Com retorno';

const filterTabs: FilterTab[] = ['Todos', 'Este mes', 'Com retorno'];

export function AppointmentsHistoryScreen({ navigation }: Props) {
  const { appointments, isLoading, loadAppointments } = useAppointments();
  const [search, setSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState<FilterTab>('Todos');

  useFocusEffect(
    useCallback(() => {
      void loadAppointments();
    }, [loadAppointments]),
  );

  const filteredAppointments = useMemo(() => {
    const today = new Date();

    return appointments.filter((appointment) => {
      const matchesSearch =
        !search ||
        appointment.customerName.toLowerCase().includes(search.toLowerCase()) ||
        appointment.serviceName.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) {
        return false;
      }

      if (selectedTab === 'Este mes') {
        const appointmentDate = new Date(`${appointment.appointmentDate}T00:00:00`);
        return (
          appointmentDate.getMonth() === today.getMonth() &&
          appointmentDate.getFullYear() === today.getFullYear()
        );
      }

      if (selectedTab === 'Com retorno') {
        return Boolean(appointment.scheduledForDate);
      }

      return true;
    });
  }, [appointments, search, selectedTab]);

  return (
    <Screen>
      <TopBar
        title="Atendimentos"
        rightContent={
          <Pressable style={styles.newButton} onPress={() => navigation.navigate('AppointmentForm', {})}>
            <Text style={styles.newButtonText}>+ Novo</Text>
          </Pressable>
        }
      />

      <View style={styles.content}>
        <View style={styles.tabs}>
          {filterTabs.map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tab, selectedTab === tab ? styles.activeTab : null]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.tabText, selectedTab === tab ? styles.activeTabText : null]}>{tab}</Text>
            </Pressable>
          ))}
        </View>

        <TextInput
          placeholder="Buscar por cliente ou servico"
          placeholderTextColor="#A7918D"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />

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
      </View>
    </Screen>
  );
}

function AppointmentHistoryCard({ appointment }: { appointment: Appointment }) {
  return (
    <ListCard
      title={appointment.customerName}
      subtitle={`${appointment.serviceName} - ${formatLongDate(appointment.appointmentDate)}`}
      extraSubtitle={
        appointment.messageStatus === 'Enviada'
          ? `${appointment.contextLabel} - Mensagem enviada`
          : `${appointment.contextLabel} - Mensagem agendada para ${formatLongDate(appointment.scheduledForDate)}`
      }
      left={<Text style={styles.cardIcon}>{appointmentIconForService(appointment.serviceName)}</Text>}
      right={
        <AppChip
          label={appointment.messageStatus}
          variant={chipVariantForStatus(appointment.messageStatus)}
        />
      }
    />
  );
}

function appointmentIconForService(serviceName: string) {
  const normalized = serviceName.toLowerCase();
  if (normalized.includes('mecha')) {
    return 'M';
  }

  if (normalized.includes('hidrat')) {
    return 'H';
  }

  if (normalized.includes('color')) {
    return 'C';
  }

  return 'A';
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
  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${date}T00:00:00`));
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.offWhite,
  },
  newButton: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.rose,
  },
  newButtonText: {
    color: '#FFFFFF',
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
  },
  tabs: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 12,
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
  searchInput: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    color: colors.textMain,
    fontFamily: typography.fontFamily.body,
    fontSize: 13,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 24,
  },
  cardIcon: {
    width: 32,
    height: 32,
    textAlign: 'center',
    textAlignVertical: 'center',
    overflow: 'hidden',
    borderRadius: 10,
    color: colors.roseDark,
    backgroundColor: colors.roseLight,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 14,
    paddingTop: 7,
  },
});
