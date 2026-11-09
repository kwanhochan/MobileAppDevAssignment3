import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FormInput } from '@/components/FormInput';
import { FormScreen } from '@/components/FormScreen';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SignInValues, signInSchema } from '@/schemas/auth';
import { colors, spacing } from '@/theme';

export default function SignInScreen() {
  const {
    control,
    handleSubmit,
    setFocus,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  // UI only (no backend yet): handleSubmit only calls this once Zod says the form is valid,
  // so we just confirm the submission. No account lookup or password check happens here.
  const onSubmit = ({ email }: SignInValues) => {
    reset();
    router.push({
      pathname: '/success',
      params: {
        title: 'Sign-in form submitted',
        message: 'Your details passed validation.',
        data: JSON.stringify({ Email: email }),
      },
    });
  };

  return (
    <FormScreen icon="lock-closed-outline" title="Welcome back" subtitle="Sign in to continue to your account.">
      <FormInput
        control={control}
        name="email"
        label="Email"
        icon="mail-outline"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => setFocus('password')}
      />
      <FormInput
        control={control}
        name="password"
        label="Password"
        icon="key-outline"
        placeholder="Enter your password"
        secure
        autoCapitalize="none"
        autoComplete="password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={() => isValid && handleSubmit(onSubmit)()}
      />

      <PrimaryButton
        title="Sign in"
        icon="log-in-outline"
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid}
        loading={isSubmitting}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <Pressable onPress={() => router.push('/auth/sign-up')} hitSlop={8}>
          <Text style={styles.link}>Sign up</Text>
        </Pressable>
      </View>
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  footer: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.lg },
  footerText: { color: colors.muted, fontSize: 14 },
  link: { color: colors.primary, fontSize: 14, fontWeight: '700' },
});

