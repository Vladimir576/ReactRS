import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
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
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<ProfileFormValues>({
    defaultValues: getDefaultProfileValues(),
    mode: 'onChange',
    resolver: zodResolver(createProfileSchema(countries)),
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

  return (
    <form className="profile-form" noValidate onSubmit={submitForm}>
      <ProfileFormFields
        countries={countries}
        errors={mapRHFErrors(errors)}
        password={password}
        register={register}
        onImageInput={(file) =>
          setValue('image', file, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          })
        }
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
