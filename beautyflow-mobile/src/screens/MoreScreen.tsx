import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppCard } from '../components/AppCard';
import { Avatar } from '../components/Avatar';
import { Screen } from '../components/Screen';
import { useAuth } from '../features/auth';
import { MoreStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'MoreMain'>;

type MenuRoute = 'ProfessionalProfile' | 'Salons' | 'Services' | 'MessageTemplates' | 'Notifications';

const professionalMenuItems: {
  label: string;
  icon: string;
  route: MenuRoute;
}[] = [
  { icon: 'P', label: 'Meu perfil', route: 'ProfessionalProfile' },
  { icon: 'S', label: 'Saloes e clientes', route: 'Salons' },
  { icon: 'C', label: 'Servicos', route: 'Services' },
  { icon: 'M', label: 'Mensagens padrao', route: 'MessageTemplates' },
  { icon: 'N', label: 'Notificacoes', route: 'Notifications' },
];

export function MoreScreen({ navigation }: Props) {
  const { session, signOut } = useAuth();
  const hasSalon = (session?.salons.length ?? 0) > 0;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Avatar
            initials={buildInitials(session?.user.name ?? 'BF')}
            size={64}
            source={session?.user.profilePhotoUrl ? { uri: session.user.profilePhotoUrl } : undefined}
          />
          <Text style={styles.heroEyebrow}>Profissional BeautyFlow</Text>
          <Text style={styles.heroTitle}>{session?.user.name ?? 'BeautyFlow'}</Text>
          <Text style={styles.heroSubtitle}>{session?.user.email ?? 'sessao@beautyflow.app'}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionLabel}>Conta profissional</Text>

          <AppCard style={styles.menuCard}>
            {professionalMenuItems.map((item, index) => (
              <Pressable
                key={item.route}
                style={[styles.menuRow, index === professionalMenuItems.length - 1 ? styles.lastRow : null]}
                onPress={() => navigation.navigate(item.route)}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuArrow}>{'>'}</Text>
              </Pressable>
            ))}
          </AppCard>

          <Text style={styles.sectionLabel}>Organizacao por salao</Text>
          <AppCard style={styles.contextCard}>
            <Text style={styles.contextTitle}>
              {hasSalon ? `${session?.salons.length ?? 0} saloes cadastrados` : 'Nenhum salao cadastrado'}
            </Text>
            <Text style={styles.contextCopy}>
              No MVP, o salao serve para classificar suas clientes. Abra a lista de saloes para criar novos cadastros e ver quais clientes pertencem a cada um.
            </Text>
            <Pressable style={styles.contextAction} onPress={() => navigation.navigate('Salons')}>
              <Text style={styles.contextActionIcon}>S</Text>
              <Text style={styles.contextActionLabel}>Abrir saloes e clientes</Text>
            </Pressable>
          </AppCard>

          <Pressable style={styles.signOutButton} onPress={() => void signOut()}>
            <Text style={styles.signOutText}>Sair da conta</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
    backgroundColor: colors.offWhite,
  },
  hero: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 18,
    alignItems: 'center',
    backgroundColor: '#FFF5F3',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  heroEyebrow: {
    marginTop: 10,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  heroTitle: {
    marginTop: 4,
    fontFamily: typography.fontFamily.title,
    fontSize: 22,
    color: colors.roseDark,
  },
  heroSubtitle: {
    marginTop: 4,
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
  content: {
    padding: 16,
  },
  sectionLabel: {
    marginBottom: 8,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  menuCard: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    overflow: 'hidden',
    marginBottom: 12,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 13,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    width: 18,
    color: colors.textMain,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 13,
  },
  menuLabel: {
    flex: 1,
    color: colors.textMain,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 13,
  },
  menuArrow: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: 14,
  },
  contextCard: {
    marginBottom: 12,
  },
  contextTitle: {
    fontFamily: typography.fontFamily.title,
    fontSize: 18,
    color: colors.roseDark,
  },
  contextCopy: {
    marginTop: 6,
    marginBottom: 12,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    lineHeight: 18,
  },
  contextAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    paddingVertical: 10,
  },
  contextActionIcon: {
    width: 18,
    color: colors.textMain,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 13,
  },
  contextActionLabel: {
    color: colors.textMain,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 13,
  },
  signOutButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(217,108,108,.35)',
    borderRadius: 13,
    paddingVertical: 13,
    paddingHorizontal: 14,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  signOutText: {
    color: colors.error,
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: 14,
  },
});

function buildInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
