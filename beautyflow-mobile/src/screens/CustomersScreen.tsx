import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Avatar } from '../components/Avatar';
import { EmptyState } from '../components/EmptyState';
import { ListCard } from '../components/ListCard';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { useCustomers } from '../features/customers';
import { CustomersStackParamList } from '../navigation/types';
import { colors, radius, typography } from '../theme';

type Props = NativeStackScreenProps<CustomersStackParamList, 'CustomersMain'>;

export function CustomersScreen({ navigation }: Props) {
  const { customers, isLoading, loadCustomers } = useCustomers();
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      void loadCustomers();
    }, [loadCustomers]),
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadCustomers(search);
    }, 150);

    return () => clearTimeout(timeout);
  }, [loadCustomers, search]);

  return (
    <Screen>
      <TopBar
        title="Clientes"
        rightContent={
          <Pressable style={styles.newButton} onPress={() => navigation.navigate('CustomerForm', {})}>
            <Text style={styles.newButtonText}>+ Nova</Text>
          </Pressable>
        }
      />
      <View style={styles.content}>
        <TextInput
          placeholder="Buscar por nome ou telefone"
          placeholderTextColor="#A7918D"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />

        <Text style={styles.sectionLabel}>{customers.length} clientes cadastradas</Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.roseDark} />
          </View>
        ) : customers.length === 0 ? (
          <EmptyState
            title="Nenhuma cliente por aqui"
            description="Cadastre sua primeira cliente para acompanhar retornos e historico."
          />
        ) : (
          <ScrollView contentContainerStyle={styles.listContent}>
            {customers.map((customer) => (
              <ListCard
                key={customer.id}
                title={customer.name}
                subtitle={customer.whatsapp}
                extraSubtitle={
                  customer.nextServiceName && customer.nextContactDate
                    ? `${customer.nextServiceName} - prox. contato ${formatShortDate(
                        customer.nextContactDate,
                      )}`
                    : undefined
                }
                left={
                  <Avatar
                    initials={customer.initials}
                    size={42}
                    source={customer.photoUrl ? { uri: customer.photoUrl } : undefined}
                  />
                }
                right={<Text style={styles.chevron}>{'>'}</Text>}
                onPress={() =>
                  navigation.navigate('CustomerDetail', {
                    customerId: customer.id,
                  })
                }
              />
            ))}
          </ScrollView>
        )}

        <Pressable style={styles.fab} onPress={() => navigation.navigate('CustomerForm', {})}>
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

function formatShortDate(date?: string) {
  if (!date) {
    return '--';
  }

  const parsedDate = new Date(date);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(parsedDate);
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
  searchInput: {
    marginBottom: 13,
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
  sectionLabel: {
    marginBottom: 8,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  listContent: {
    paddingBottom: 96,
  },
  chevron: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 16,
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
