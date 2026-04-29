import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppCard } from '../components/AppCard';
import { Screen } from '../components/Screen';
import { useAuth } from '../features/auth';
import { useSettings } from '../features/settings';
import { MoreStackParamList } from '../navigation/types';
import { colors, typography } from '../theme';

type Props = NativeStackScreenProps<MoreStackParamList, 'MoreMain'>;

type MenuRoute = 'SalonProfile' | 'Services' | 'MessageTemplates' | 'Notifications';

const menuItems: {
  label: string;
  icon: string;
  route: MenuRoute;
}[] = [
  { icon: 'S', label: 'Meu salao', route: 'SalonProfile' },
  { icon: 'C', label: 'Servicos', route: 'Services' },
  { icon: 'M', label: 'Mensagens padrao', route: 'MessageTemplates' },
  { icon: 'N', label: 'Notificacoes', route: 'Notifications' },
];

export function MoreScreen({ navigation }: Props) {
  const { signOut } = useAuth();
  const { loadSettings, salonProfile } = useSettings();

  useFocusEffect(
    useCallback(() => {
      void loadSettings();
    }, [loadSettings]),
  );

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>SB</Text>
        </View>
        <Text style={styles.heroTitle}>{salonProfile?.salonName ?? 'Studio Bella Hair'}</Text>
        <Text style={styles.heroSubtitle}>{salonProfile?.email ?? 'bellahairstudio@email.com'}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionLabel}>Configuracoes</Text>

        <AppCard style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.route}
              style={[styles.menuRow, index === menuItems.length - 1 ? styles.lastRow : null]}
              onPress={() => navigation.navigate(item.route)}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>{'>'}</Text>
            </Pressable>
          ))}
        </AppCard>

        <Pressable style={styles.signOutButton} onPress={() => void signOut()}>
          <Text style={styles.signOutText}>Sair da conta</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 18,
    alignItems: 'center',
    backgroundColor: '#FFF5F3',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.rose,
    marginBottom: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: 18,
  },
  heroTitle: {
    fontFamily: typography.fontFamily.title,
    fontSize: 18,
    color: colors.roseDark,
  },
  heroSubtitle: {
    marginTop: 4,
    fontFamily: typography.fontFamily.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
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
