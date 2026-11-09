import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FormInput } from '@/components/FormInput';
import { FormScreen } from '@/components/FormScreen';
import { PasswordChecklist } from '@/components/PasswordChecklist';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SignUpValues, signUpSchema } from '@/schemas/auth';
import { colors, spacing } from '@/theme';

const defaults: SignUpValues = { fullName: '', email: '', password: '', confirmPassword: '' };

export default function SignUpScreen() {
  const {
    control,
    handleSubmit,
    setFocus,
    trigger,
    reset,
    getFieldState,
    formState,
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: defaults,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });
  const { isValid, isSubmitting } = formState;

  const password = useWatch({ control, name: 'password' });

  // If the user edits the password after filling "confirm", re-check the match immediately.
  useEffect(() => {
    if (getFieldState('confirmPassword', formState).isTouched) {
      trigger('confirmPassword');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  // UI only (no backend yet): handleSubmit only calls this once Zod says the form is valid,
  // so we just confirm the submission. No account is actually created or stored.
  const onSubmit = ({ fullName, email }: SignUpValues) => {
    reset(defaults);
    router.push({
      pathname: '/success',
      params: {
        title: 'Sign-up form submitted',
        message: `Thanks, ${fullName.trim()}! Your details passed validation.`,
        data: JSON.stringify({ Name: fullName.trim(), Email: email.trim() }),
      },
    });
  };

  return (
    <FormScreen icon="person-add-outline" title="Create account" subtitle="It only takes a minute.">
      <FormInput
        control={control}
        name="fullName"
        label="Full name"
        icon="person-outline"
        placeholder="Jane Doe"
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        onSubmitEditing={() => setFocus('email')}
      />
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
        placeholder="Create a password"
        secure
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        onSubmitEditing={() => setFocus('confirmPassword')}
      />
      <PasswordChecklist password={password ?? ''} />
      <FormInput
        control={control}
        name="confirmPassword"
        label="Confirm password"
        icon="shield-checkmark-outline"
        placeholder="Re-enter your password"
        secure
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
      />

      <PrimaryButton
        title="Create account"
        icon="person-add-outline"
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid}
        loading={isSubmitting}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/auth'))} hitSlop={8}>
          <Text style={styles.link}>Sign in</Text>
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
