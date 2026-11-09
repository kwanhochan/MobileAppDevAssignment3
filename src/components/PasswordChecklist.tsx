import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PASSWORD_RULES } from '@/schemas/auth';
import { colors, radius, spacing } from '@/theme';

const LEVELS = [
  { label: 'Too weak', color: colors.error },
  { label: 'Weak', color: colors.error },
  { label: 'Fair', color: '#F59E0B' },
  { label: 'Good', color: '#84CC16' },
  { label: 'Strong', color: colors.success },
];

/** Live password strength meter + rule checklist (uses the same rules as the Zod schema). */
export function PasswordChecklist({ password }: { password: string }) {
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const level = LEVELS[Math.max(0, passed - 1)];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Password strength</Text>
        <Text style={[styles.level, { color: password ? level.color : colors.muted }]}>
          {password ? level.label : '—'}
        </Text>
      </View>
      <View style={styles.bar}>
        {PASSWORD_RULES.map((_, i) => (
          <View
            key={i}
            style={[styles.segment, { backgroundColor: i < passed ? level.color : colors.border }]}
          />
        ))}
      </View>
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(password);
        return (
          <View key={rule.label} style={styles.rule}>
            <Ionicons
              name={ok ? 'checkmark-circle' : 'ellipse-outline'}
              size={16}
              color={ok ? colors.success : colors.muted}
            />
            <Text style={[styles.ruleText, ok && styles.ruleOk]}>{rule.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: -spacing.sm,
    marginBottom: spacing.lg,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  title: { fontSize: 13, fontWeight: '600', color: colors.text },
  level: { fontSize: 13, fontWeight: '700' },
  bar: { flexDirection: 'row', gap: 4, marginBottom: spacing.sm },
  segment: { flex: 1, height: 5, borderRadius: 3 },
  rule: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  ruleText: { fontSize: 13, color: colors.muted },
  ruleOk: { color: colors.success },
});
