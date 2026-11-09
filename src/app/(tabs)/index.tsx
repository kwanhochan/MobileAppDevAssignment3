import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
 
import { ChipSelect } from '@/components/ChipSelect';
import { FormInput } from '@/components/FormInput';
import { FormScreen, SectionTitle } from '@/components/FormScreen';
import { PrimaryButton } from '@/components/PrimaryButton';
import { DEPARTMENTS, EmployeeFormValues, employeeDefaults, employeeSchema } from '@/schemas/employee';
import { colors, spacing } from '@/theme';
 
export default function EmployeeFormScreen() {
  const {
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { isValid, isSubmitting, isDirty, errors, submitCount },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employeeDefaults,
    // Validate a field after the user leaves it, then re-validate live as they fix it.
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });
 
  const errorCount = Object.keys(errors).length;
 
  // UI only (no backend yet): the valid data is shown on the success screen, not saved anywhere.
  const onSubmit = (values: EmployeeFormValues) => {
    router.push({
      pathname: '/success',
      params: {
        title: 'Employee details submitted',
        message: `${values.firstName} ${values.lastName} was added to ${values.department}.`,
        data: JSON.stringify({
          'Employee ID': values.employeeId,
          Name: `${values.firstName} ${values.lastName}`,
          Email: values.email,
          Phone: values.phone,
          Department: values.department,
          'Job title': values.jobTitle,
          'Start date': values.startDate,
          Salary: `$${Number(values.salary).toLocaleString('en-CA')}`,
          'Postal code': values.postalCode.toUpperCase(),
        }),
      },
    });
    reset(employeeDefaults);
  };
 
  return (
<FormScreen
      icon="id-card-outline"
      title="New Employee"
      subtitle="Fill in the employee's details. All fields are required."
>
<SectionTitle>Personal details</SectionTitle>
<View style={styles.row}>
<View style={styles.half}>
<FormInput
            control={control}
            name="firstName"
            label="First name"
            icon="person-outline"
            placeholder="Jane"
            autoCapitalize="words"
            autoComplete="given-name"
            returnKeyType="next"
            onSubmitEditing={() => setFocus('lastName')}
          />
</View>
<View style={styles.half}>
<FormInput
            control={control}
            name="lastName"
            label="Last name"
            icon="person-outline"
            placeholder="Doe"
            autoCapitalize="words"
            autoComplete="family-name"
            returnKeyType="next"
            onSubmitEditing={() => setFocus('email')}
          />
</View>
</View>
<FormInput
        control={control}
        name="email"
        label="Work email"
        icon="mail-outline"
        placeholder="jane.doe@company.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        returnKeyType="next"
        onSubmitEditing={() => setFocus('phone')}
      />
<FormInput
        control={control}
        name="phone"
        label="Phone number"
        icon="call-outline"
        placeholder="(403) 555-0123"
        keyboardType="phone-pad"
        autoComplete="tel"
        returnKeyType="next"
        onSubmitEditing={() => setFocus('postalCode')}
      />
<FormInput
        control={control}
        name="postalCode"
        label="Postal code"
        icon="location-outline"
        placeholder="T2M 0L4"
        autoCapitalize="characters"
        maxLength={7}
        hint="Canadian format: A1A 1A1"
        returnKeyType="next"
        onSubmitEditing={() => setFocus('employeeId')}
      />
 
      <SectionTitle>Employment</SectionTitle>
<FormInput
        control={control}
        name="employeeId"
        label="Employee ID"
        icon="barcode-outline"
        placeholder="EMP-1234"
        autoCapitalize="characters"
        maxLength={8}
        hint="Format: EMP- followed by 4 digits"
        returnKeyType="next"
        onSubmitEditing={() => setFocus('jobTitle')}
      />
<FormInput
        control={control}
        name="jobTitle"
        label="Job title"
        icon="briefcase-outline"
        placeholder="Software Developer"
        autoCapitalize="words"
        returnKeyType="next"
        onSubmitEditing={() => setFocus('startDate')}
      />
<ChipSelect control={control} name="department" label="Department" options={DEPARTMENTS} />
<FormInput
        control={control}
        name="startDate"
        label="Start date"
        icon="calendar-outline"
        placeholder="YYYY-MM-DD"
        keyboardType="numbers-and-punctuation"
        maxLength={10}
        returnKeyType="next"
        onSubmitEditing={() => setFocus('salary')}
      />
<FormInput
        control={control}
        name="salary"
        label="Annual salary (CAD)"
        icon="cash-outline"
        placeholder="65000"
        keyboardType="decimal-pad"
        hint="Between $15,000 and $500,000"
        returnKeyType="done"
      />
 
      {submitCount > 0 && errorCount > 0 && (
<Text style={styles.summary}>
          Please fix {errorCount} {errorCount === 1 ? 'field' : 'fields'} highlighted above.
</Text>
      )}
 
      <PrimaryButton
        title="Save employee"
        icon="save-outline"
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid}
        loading={isSubmitting}
      />
<PrimaryButton
        title="Clear form"
        icon="refresh-outline"
        variant="secondary"
        onPress={() => reset(employeeDefaults)}
        disabled={!isDirty || isSubmitting}
      />
</FormScreen>
  );
}
 
const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1 },
  summary: { color: colors.error, fontWeight: '600', textAlign: 'center', marginBottom: spacing.sm },
});
