import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, radius, spacing } from '@/theme';

export default function SuccessScreen() {
  const { title, message, data } = useLocalSearchParams<{ title?: string; message?: string; data?: string }>();

  let rows: [string, string][] = [];
  try {
    rows = Object.entries(JSON.parse(data ?? '{}') as Record<string, string>);
  } catch {
    rows = [];
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.badge}>
        <Ionicons name="checkmark" size={40} color={colors.white} />
      </View>
      <Text style={styles.title}>{title ?? 'Success'}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}

      {rows.length > 0 && (
        <View style={styles.card}>
          {rows.map(([key, value], i) => (
            <View key={key} style={[styles.row, i < rows.length - 1 && styles.rowDivider]}>
              <Text style={styles.key}>{key}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}
        </View>
      )}

      <PrimaryButton title="Done" icon="arrow-back-outline" onPress={() => router.back()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, alignItems: 'stretch' },
  badge: {
    alignSelf: 'center',
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'center' },
  message: { fontSize: 15, color: colors.muted, textAlign: 'center', marginTop: spacing.sm },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.xl,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.md, gap: spacing.md },
  rowDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  key: { color: colors.muted, fontSize: 14 },
  value: { color: colors.text, fontSize: 14, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
});
