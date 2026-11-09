import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '@/theme';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary';
};

/** Button with distinct enabled / pressed / disabled / loading states. */
export function PrimaryButton({ title, onPress, disabled = false, loading = false, icon, variant = 'primary' }: Props) {
  const isDisabled = disabled || loading;
  const secondary = variant === 'secondary';
  const contentColor = isDisabled ? colors.disabledText : secondary ? colors.primary : colors.white;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        secondary ? styles.secondary : styles.primary,
        pressed && !isDisabled && (secondary ? styles.secondaryPressed : styles.primaryPressed),
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={contentColor} />
      ) : (
        icon && <Ionicons name={icon} size={20} color={contentColor} />
      )}
      <Text style={[styles.text, { color: contentColor }]}>{loading ? 'Please wait…' : title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 52,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  primary: { backgroundColor: colors.primary },
  primaryPressed: { backgroundColor: colors.primaryPressed, transform: [{ scale: 0.98 }] },
  secondary: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.primary },
  secondaryPressed: { backgroundColor: colors.focusBg },
  disabled: { backgroundColor: colors.disabledBg, borderColor: colors.disabledBg },
  text: { fontSize: 16, fontWeight: '700' },
});
