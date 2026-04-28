import { Image, ImageSourcePropType, Text, View } from 'react-native';
import { colors, typography } from '../theme';

type AvatarProps = {
  initials: string;
  size?: number;
  source?: ImageSourcePropType;
};

export function Avatar({ initials, size = 42, source }: AvatarProps) {
  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  } as const;

  return (
    <View
      style={[
        avatarStyle,
        {
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: colors.roseLight,
        },
      ]}
    >
      {source ? (
        <Image source={source} style={avatarStyle} resizeMode="cover" />
      ) : (
        <Text
          style={{
            color: colors.roseDark,
            fontFamily: typography.fontFamily.bodyBold,
            fontSize: 12,
          }}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}
