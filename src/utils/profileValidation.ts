import { z } from 'zod';
import type {
  PasswordStrength,
  ProfileFieldName,
  ProfileFormValues,
} from '../types/profileForm';

export const maxImageSizeBytes = 1024 * 1024;

export const genderOptions = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'nonBinary', label: 'Non-binary' },
  { value: 'preferNot', label: 'Prefer not to say' },
] as const;

export function validateBasicEmail(email: string): boolean {
  const parts = email.split('@');

  if (parts.length !== 2) {
    return false;
  }

  const [localPart, domain] = parts;

  return localPart.length > 0 && domain.includes('.') && domain.length > 2;
}

export function getPasswordStrength(password: string): PasswordStrength {
  const characters = password.split('');
  const isNumber = (character: string) => character >= '0' && character <= '9';
  const isUppercase = (character: string) => character >= 'A' && character <= 'Z';
  const isLowercase = (character: string) => character >= 'a' && character <= 'z';

  return {
    hasNumber: characters.some(isNumber),
    hasUppercase: characters.some(isUppercase),
    hasLowercase: characters.some(isLowercase),
    hasSpecial: characters.some(
      (character) =>
        !isNumber(character) && !isUppercase(character) && !isLowercase(character)
    ),
  };
}

export function createProfileSchema(countries: string[]) {
  return z
    .object({
      name: z
        .string()
        .min(1, 'Name is required')
        .refine((name) => name[0] === name[0]?.toUpperCase(), {
          message: 'First letter must be uppercase',
        }),
      age: z
        .string()
        .min(1, 'Age is required')
        .refine((age) => !Number.isNaN(Number(age)), {
          message: 'Age must be a number',
        })
        .refine((age) => Number(age) >= 0, {
          message: 'Age cannot be negative',
        }),
      email: z
        .string()
        .min(1, 'Email is required')
        .refine(validateBasicEmail, {
          message: 'Email must include one @ and a domain with a dot',
        }),
      gender: z
        .union([
          z.enum(['female', 'male', 'nonBinary', 'preferNot']),
          z.literal(''),
        ])
        .refine((gender) => gender !== '', {
          message: 'Gender is required',
        }),
      terms: z.boolean().refine((terms) => terms, {
        message: 'Terms and Conditions must be accepted',
      }),
      password: z.string().min(1, 'Password is required'),
      confirmPassword: z.string().min(1, 'Confirm password is required'),
      country: z
        .string()
        .min(1, 'Country is required')
        .refine((country) => countries.includes(country), {
          message: 'Choose a country from the list',
        }),
      image: z
        .custom<File | null>(
          (value) => value === null || value instanceof File,
          'Image is required'
        )
        .refine((file) => file instanceof File, {
          message: 'Image is required',
        })
        .refine((file) => file instanceof File && ['image/png', 'image/jpeg'].includes(file.type), {
          message: 'Image must be PNG or JPEG',
        })
        .refine((file) => file instanceof File && file.size <= maxImageSizeBytes, {
          message: 'Image must be 1 MB or smaller',
        }),
    })
    .refine((values) => values.password === values.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Passwords must match',
    });
}

export type ProfileSchema = ReturnType<typeof createProfileSchema>;

export function getDefaultProfileValues(): ProfileFormValues {
  return {
    name: '',
    age: '',
    email: '',
    gender: '',
    terms: false,
    password: '',
    confirmPassword: '',
    country: '',
    image: null,
  };
}

export function getValidationErrors(
  values: ProfileFormValues,
  countries: string[]
): Partial<Record<ProfileFieldName, string>> {
  const result = createProfileSchema(countries).safeParse(values);

  if (result.success) {
    return {};
  }

  return result.error.issues.reduce<Partial<Record<ProfileFieldName, string>>>(
    (errors, issue) => {
      const fieldName = issue.path[0];

      if (typeof fieldName === 'string' && !(fieldName in errors)) {
        errors[fieldName as ProfileFieldName] = issue.message;
      }

      return errors;
    },
    {}
  );
}
