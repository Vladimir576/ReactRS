import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  selectAddSubmission,
  selectCountries,
  useProfileFormStore,
} from '../../store/profileFormStore';
import type { ProfileFormValues } from '../../types/profileForm';
import { fileToBase64 } from '../../utils/imageFile';
import {
  createProfileSchema,
  getDefaultProfileValues,
  getPasswordStrength,
} from '../../utils/profileValidation';
import { mapRHFErrors } from '../../utils/rhfErrors';
import ProfileFormFields from './ProfileFormFields';
import './ProfileForms.css';

interface HookProfileFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function HookProfileForm({
  onCancel,
  onSuccess,
}: HookProfileFormProps) {
  const countries = useProfileFormStore(selectCountries);
  const addSubmission = useProfileFormStore(selectAddSubmission);
  const [password, setPassword] = useState('');
  const profileSchema = useMemo(() => createProfileSchema(countries), [countries]);
  const resolver = useMemo(() => zodResolver(profileSchema), [profileSchema]);
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<ProfileFormValues>({
    defaultValues: getDefaultProfileValues(),
    mode: 'onChange',
    resolver,
  });

  useEffect(() => {
    register('image');
  }, [register]);

  const submitForm = handleSubmit(async (values) => {
    if (!values.image || values.gender === '') {
      return;
    }

    const imageBase64 = await fileToBase64(values.image);

    addSubmission({
      source: 'React Hook Form',
      name: values.name,
      age: Number(values.age),
      email: values.email,
      gender: values.gender,
      country: values.country,
      imageBase64,
      passwordStrength: getPasswordStrength(values.password),
    });

    reset();
    setPassword('');
    onSuccess();
  });

  const handleImageInput = useCallback(
    (file: File | null) => {
      setValue('image', file, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  return (
    <form className="profile-form" noValidate onSubmit={submitForm}>
      <ProfileFormFields
        countries={countries}
        errors={mapRHFErrors(errors)}
        password={password}
        register={register}
        onImageInput={handleImageInput}
        onPasswordInput={setPassword}
      />
      <div className="profile-form-actions">
        <button className="secondary-button" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="primary-button" disabled={!isValid} type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}
