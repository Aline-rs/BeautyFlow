import { ReactNode } from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import { AppCard } from './AppCard';
import { colors, typography } from '../theme';

type ListCardProps = {
  title: string;
  subtitle?: string;
  extraSubtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ListCard(props: ListCardProps) {
  const card = (
    <AppCard
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginBottom: 8,
        },
        props.style,
      ]}
    >
      {props.left}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: typography.fontFamily.bodyBold,
            fontSize: 13,
            color: colors.textMain,
          }}
        >
          {props.title}
        </Text>
        {props.subtitle ? (
          <Text
            style={{
              marginTop: 2,
              fontFamily: typography.fontFamily.body,
              fontSize: 10,
              color: colors.textSecondary,
            }}
          >
            {props.subtitle}
          </Text>
        ) : null}
        {props.extraSubtitle ? (
          <Text
            style={{
              marginTop: 2,
              fontFamily: typography.fontFamily.body,
              fontSize: 10,
              color: colors.textSecondary,
            }}
          >
            {props.extraSubtitle}
          </Text>
        ) : null}
      </View>
      {props.right}
    </AppCard>
  );

  return props.onPress ? <Pressable onPress={props.onPress}>{card}</Pressable> : card;
}
