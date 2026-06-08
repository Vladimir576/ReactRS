export type Gender = 'female' | 'male' | 'nonBinary' | 'preferNot';

export type FormSource = 'Uncontrolled' | 'React Hook Form';

export interface PasswordStrength {
  hasNumber: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasSpecial: boolean;
}

export interface ProfileFormValues {
  name: string;
  age: string;
  email: string;
  gender: Gender | '';
  terms: boolean;
  password: string;
  confirmPassword: string;
  country: string;
  image: File | null;
}

export interface ProfileSubmission {
  id: string;
  source: FormSource;
  submittedAt: string;
  name: string;
  age: number;
  email: string;
  gender: Gender;
  country: string;
  imageBase64: string;
  passwordStrength: PasswordStrength;
}

export type ProfileFieldName = keyof ProfileFormValues;
