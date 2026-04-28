import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { AppChip } from '../components/AppChip';
import { Avatar } from '../components/Avatar';
import { ListCard } from '../components/ListCard';
import { Screen } from '../components/Screen';
import { StatCard } from '../components/StatCard';
import { useAuth } from '../features/auth';
import { colors, spacing, typography } from '../theme';

export function HomePlaceholderScreen() {
  const { session, signOut } = useAuth();

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>
          Sessao ativa para {session?.user.salonName ?? 'BeautyFlow'}.
        </Text>

        <View style={styles.statsRow}>
          <StatCard value="3" label="Mensagens para enviar" />
          <StatCard value="2" label="Clientes com retorno proximo" />
        </View>

        <AppCard style={styles.section}>
          <Text style={styles.sectionLabel}>Componentes base</Text>
          <View style={styles.avatarRow}>
            <Avatar initials="GA" />
            <AppChip label="Pendente" />
            <AppChip label="Enviada" variant="sent" />
          </View>
        </AppCard>

        <ListCard
          title="Gabriela Alves"
          subtitle="Mechas · 16/04"
          extraSubtitle="Mensagem pronta para follow-up"
          left={<Avatar initials="GA" />}
          right={<AppChip label="Pendente" />}
        />

        <View style={styles.logoutButton}>
          <AppButton label="Sair da conta" variant="ghost" onPress={() => void signOut()} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.offWhite,
  },
  title: {
    fontFamily: typography.fontFamily.title,
    fontSize: 24,
    color: colors.roseDark,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 16,
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: 12,
  },
  section: {
    marginBottom: 12,
  },
  sectionLabel: {
    marginBottom: 8,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoutButton: {
    marginTop: 'auto',
  },
});
