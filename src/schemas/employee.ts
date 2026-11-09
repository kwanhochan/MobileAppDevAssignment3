import { z } from 'zod';

export const DEPARTMENTS = [
  'Engineering',
  'Finance',
  'Human Resources',
  'Marketing',
  'Operations',
  'Sales',
] as const;

const personName = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .min(2, `${label} must be at least 2 characters`)
    .max(50, `${label} must be 50 characters or fewer`)
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/, `${label} can only contain letters, spaces, hyphens and apostrophes`);

/** True when "YYYY-MM-DD" is a real calendar date (rejects 2025-02-30 etc). */
const isRealDate = (value: string) => {
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d
  );
};

export const employeeSchema = z.object({
  firstName: personName('First name'),
  lastName: personName('Last name'),
  employeeId: z
    .string()
    .trim()
    .min(1, 'Employee ID is required')
    .regex(/^EMP-\d{4}$/, 'Use the format EMP-1234'),
  email: z
    .string()
    .trim()
    .min(1, 'Work email is required')
    .max(100, 'Email must be 100 characters or fewer')
    .email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(
      /^(\+1[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$/,
      'Enter a valid 10-digit phone number, e.g. (403) 555-0123'
    ),
  department: z
    .string()
    .min(1, 'Select a department')
    .refine((v) => (DEPARTMENTS as readonly string[]).includes(v), 'Select a valid department'),
  jobTitle: z
    .string()
    .trim()
    .min(1, 'Job title is required')
    .min(2, 'Job title must be at least 2 characters')
    .max(60, 'Job title must be 60 characters or fewer'),
  startDate: z
    .string()
    .trim()
    .min(1, 'Start date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the format YYYY-MM-DD')
    .refine(isRealDate, 'Enter a real calendar date')
    .refine((v) => {
      const date = new Date(`${v}T00:00:00Z`);
      const min = new Date('1950-01-01T00:00:00Z');
      const max = new Date();
      max.setFullYear(max.getFullYear() + 1);
      return date >= min && date <= max;
    }, 'Start date must be between 1950 and one year from today'),
  salary: z
    .string()
    .trim()
    .min(1, 'Annual salary is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter numbers only, with up to 2 decimals')
    .refine((v) => Number(v) >= 15000 && Number(v) <= 500000, 'Salary must be between $15,000 and $500,000'),
  postalCode: z
    .string()
    .trim()
    .min(1, 'Postal code is required')
    .regex(
      /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
      'Enter a valid Canadian postal code, e.g. T2M 0L4'
    ),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;

export const employeeDefaults: EmployeeFormValues = {
  firstName: '',
  lastName: '',
  employeeId: '',
  email: '',
  phone: '',
  department: '',
  jobTitle: '',
  startDate: '',
  salary: '',
  postalCode: '',
};

