import type { FieldErrors } from 'react-hook-form';
import type { ProfileFieldName, ProfileFormValues } from '../types/profileForm';

function getRHFErrorMessage(
  errors: FieldErrors<ProfileFormValues>,
  fieldName: ProfileFieldName
) {
  const message = errors[fieldName]?.message;

  return typeof message === 'string' ? message : undefined;
}

export function mapRHFErrors(
  errors: FieldErrors<ProfileFormValues>
): Partial<Record<ProfileFieldName, string>> {
  return {
    name: getRHFErrorMessage(errors, 'name'),
    age: getRHFErrorMessage(errors, 'age'),
    email: getRHFErrorMessage(errors, 'email'),
    gender: getRHFErrorMessage(errors, 'gender'),
    terms: getRHFErrorMessage(errors, 'terms'),
    password: getRHFErrorMessage(errors, 'password'),
    confirmPassword: getRHFErrorMessage(errors, 'confirmPassword'),
    country: getRHFErrorMessage(errors, 'country'),
    image: getRHFErrorMessage(errors, 'image'),
  };
}
