import { Ionicons } from '@expo/vector-icons';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';

type ChipSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: readonly string[];
};

/** Single-choice selector (e.g. department) controlled by React Hook Form. */
export function ChipSelect<T extends FieldValues>({ control, name, label, options }: ChipSelectProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View style={styles.wrapper}>
          <Text style={[styles.label, error && styles.labelError]}>{label}</Text>
          <View style={[styles.chips, error && styles.chipsError]} accessibilityRole="radiogroup">
            {options.map((option) => {
              const selected = value === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => {
                    onChange(option);
                    onBlur();
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.chipPressed]}
                >
                  {selected && <Ionicons name="checkmark" size={14} color={colors.white} />}
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{option}</Text>
                </Pressable>
              );
            })}
          </View>
          {error && (
            <View style={styles.messageRow}>
              <Ionicons name="warning-outline" size={14} color={colors.error} />
              <Text style={styles.errorText}>{error.message}</Text>
            </View>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.lg },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.xs + 2 },
  labelError: { color: colors.error },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, borderRadius: radius.md },
  chipsError: { padding: spacing.sm, backgroundColor: colors.errorBg, borderWidth: 1.5, borderColor: colors.error },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipPressed: { opacity: 0.7 },
  chipText: { fontSize: 14, color: colors.text, fontWeight: '500' },
  chipTextSelected: { color: colors.white },
  messageRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xs + 2 },
  errorText: { color: colors.error, fontSize: 13 },
});

