import { z } from 'zod';

const email = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .max(100, 'Email must be 100 characters or fewer')
  .email('Enter a valid email address');

/** Shared with the live strength checklist on the Sign-Up screen. */
export const PASSWORD_RULES: { label: string; test: (v: string) => boolean }[] = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { label: 'One number', test: (v) => /\d/.test(v) },
  { label: 'One special character', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

// ---------- Sign in ----------
export const signInSchema = z.object({
  email,
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must be 64 characters or fewer'),
});
export type SignInValues = z.infer<typeof signInSchema>;

// ---------- Sign up ----------
const strongPassword = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .max(64, 'Password must be 64 characters or fewer')
  .regex(/[A-Z]/, 'Password needs an uppercase letter')
  .regex(/[a-z]/, 'Password needs a lowercase letter')
  .regex(/\d/, 'Password needs a number')
  .regex(/[^A-Za-z0-9]/, 'Password needs a special character')
  .refine((v) => !/\s/.test(v), 'Password cannot contain spaces');

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Full name is required')
      .min(3, 'Full name must be at least 3 characters')
      .max(60, 'Full name must be 60 characters or fewer')
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/, 'Name can only contain letters, spaces, hyphens and apostrophes')
      .refine((v) => v.split(/\s+/).filter(Boolean).length >= 2, 'Enter your first and last name'),
    email,
    password: strongPassword,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type SignUpValues = z.infer<typeof signUpSchema>;
