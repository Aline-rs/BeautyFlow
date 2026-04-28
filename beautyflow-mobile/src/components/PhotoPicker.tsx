import { Pressable, Text, View } from 'react-native';
import { colors, radius, typography } from '../theme';

type PhotoPickerProps = {
  label?: string;
  onPress?: () => void;
};

export function PhotoPicker({
  label = 'Adicionar foto da cliente',
  onPress,
}: PhotoPickerProps) {
  return (
    <Pressable
      style={{
        minHeight: 120,
        marginBottom: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.borderStrong,
        borderRadius: radius.lg,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onPress={onPress}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.roseLight,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            color: colors.roseDark,
            fontFamily: typography.fontFamily.bodyBold,
            fontSize: 24,
          }}
        >
          +
        </Text>
      </View>
      <Text
        style={{
          fontFamily: typography.fontFamily.bodyBold,
          fontSize: 13,
          color: colors.textMain,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          marginTop: 4,
          fontFamily: typography.fontFamily.body,
          fontSize: 10,
          color: colors.textSecondary,
        }}
      >
        Toque para abrir a galeria
      </Text>
    </Pressable>
  );
}
