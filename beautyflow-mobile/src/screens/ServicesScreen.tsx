import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppChip } from '../components/AppChip';
import { EmptyState } from '../components/EmptyState';
import { ListCard } from '../components/ListCard';
import { Screen } from '../components/Screen';
import { TopBar } from '../components/TopBar';
import { useServices } from '../features/services';
import { MoreStackParamList } from '../navigation/types';
import { colors, radius, typography } from '../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'Services'>;

export function ServicesScreen({ navigation }: Props) {
  const { services, isLoading, loadServices, toggleServiceStatus } = useServices();

  useFocusEffect(
    useCallback(() => {
      void loadServices();
    }, [loadServices]),
  );

  async function handleToggleService(serviceId: string, nextIsActive: boolean) {
    try {
      await toggleServiceStatus(serviceId, nextIsActive);
    } catch {
      Alert.alert('Erro', 'Nao foi possivel atualizar o status do servico.');
    }
  }

  return (
    <Screen>
      <TopBar
        title="Servicos"
        onBack={() => navigation.goBack()}
        rightContent={
          <Pressable style={styles.newButton} onPress={() => navigation.navigate('ServiceForm', {})}>
            <Text style={styles.newButtonText}>+ Novo</Text>
          </Pressable>
        }
      />

      <View style={styles.content}>
        <Text style={styles.sectionLabel}>Servicos ativos</Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.roseDark} />
          </View>
        ) : services.length === 0 ? (
          <EmptyState
            title="Nenhum servico cadastrado"
            description="Cadastre seus servicos para agilizar o registro de atendimento."
          />
        ) : (
          <ScrollView contentContainerStyle={styles.listContent}>
            {services.map((service) => (
              <ListCard
                key={service.id}
                title={service.name}
                subtitle={`Retorno sugerido em ${service.suggestedReturnDays} dias`}
                left={<Text style={styles.serviceIcon}>{serviceIconForName(service.name)}</Text>}
                right={
                  <Pressable
                    style={styles.statusButton}
                    onPress={() => void handleToggleService(service.id, !service.isActive)}
                  >
                    <AppChip
                      label={service.isActive ? 'Ativo' : 'Inativo'}
                      variant={service.isActive ? 'sent' : 'inactive'}
                    />
                  </Pressable>
                }
                onPress={() =>
                  navigation.navigate('ServiceForm', {
                    serviceId: service.id,
                  })
                }
              />
            ))}
          </ScrollView>
        )}
      </View>
    </Screen>
  );
}

function serviceIconForName(name: string) {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes('mecha')) {
    return 'M';
  }

  if (normalizedName.includes('color')) {
    return 'C';
  }

  if (normalizedName.includes('corte')) {
    return 'T';
  }

  if (normalizedName.includes('hidrata')) {
    return 'H';
  }

  return 'S';
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
  sectionLabel: {
    marginBottom: 8,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  listContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceIcon: {
    width: 32,
    height: 32,
    textAlign: 'center',
    textAlignVertical: 'center',
    overflow: 'hidden',
    borderRadius: radius.md,
    color: colors.roseDark,
    backgroundColor: colors.roseLight,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 14,
    paddingTop: 7,
  },
  statusButton: {
    alignSelf: 'center',
  },
});
