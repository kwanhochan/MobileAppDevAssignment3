import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';

type IconName = keyof typeof Ionicons.glyphMap;

type FormInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  icon: IconName;
  hint?: string;
  /** Renders the value hidden and adds a show/hide toggle. */
  secure?: boolean;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur' | 'secureTextEntry'>;

/**
 * A text input wired to React Hook Form through <Controller>.
 * Handles label, leading icon, focus styling, error styling, a valid tick,
 * and an optional show/hide password toggle.
 */
export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  icon,
  hint,
  secure = false,
  onFocus,
  ...inputProps
}: FormInputProps<T>) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secure);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur, ref }, fieldState: { error, isTouched } }) => {
        const hasError = !!error;
        const isValid = isTouched && !hasError && !!value;
        const iconColor = hasError ? colors.error : focused ? colors.primary : colors.muted;

        return (
          <View style={styles.wrapper}>
            <Text style={[styles.label, hasError && styles.labelError]}>{label}</Text>

            <View
              style={[
                styles.inputRow,
                focused && styles.inputFocused,
                hasError && styles.inputError,
                isValid && !focused && styles.inputValid,
              ]}
            >
              <Ionicons name={icon} size={20} color={iconColor} style={styles.icon} />
              <TextInput
                ref={ref}
                value={value ?? ''}
                onChangeText={onChange}
                onFocus={(e) => {
                  setFocused(true);
                  onFocus?.(e);
                }}
                onBlur={() => {
                  setFocused(false);
                  onBlur();
                }}
                secureTextEntry={hidden}
                placeholderTextColor={colors.placeholder}
                style={styles.input}
                accessibilityLabel={label}
                accessibilityHint={hasError ? error?.message : hint}
                {...inputProps}
              />
              {secure ? (
                <Pressable
                  onPress={() => setHidden((h) => !h)}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
                >
                  <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.muted} />
                </Pressable>
              ) : isValid ? (
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              ) : hasError ? (
                <Ionicons name="alert-circle" size={20} color={colors.error} />
              ) : null}
            </View>

            {hasError ? (
              <View style={styles.messageRow} accessibilityLiveRegion="polite">
                <Ionicons name="warning-outline" size={14} color={colors.error} />
                <Text style={styles.errorText}>{error?.message}</Text>
              </View>
            ) : hint ? (
              <Text style={styles.hint}>{hint}</Text>
            ) : null}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.lg },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.xs + 2 },
  labelError: { color: colors.error },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 50,
  },
  inputFocused: { borderColor: colors.primary, backgroundColor: colors.focusBg },
  inputError: { borderColor: colors.error, backgroundColor: colors.errorBg },
  inputValid: { borderColor: colors.success },
  icon: { marginRight: spacing.sm },
  input: { flex: 1, minWidth: 0, fontSize: 16, color: colors.text, paddingVertical: spacing.md },
  messageRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xs + 2 },
  errorText: { color: colors.error, fontSize: 13, flexShrink: 1 },
  hint: { color: colors.muted, fontSize: 12, marginTop: spacing.xs + 2 },
});
