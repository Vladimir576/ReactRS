import { useCallback, type FormEvent, useState } from 'react';
import {
  selectAddSubmission,
  selectCountries,
  useProfileFormStore,
} from '../../store/profileFormStore';
import type { ProfileFieldName, ProfileFormValues } from '../../types/profileForm';
import { extractFile, fileToBase64 } from '../../utils/imageFile';
import {
  getPasswordStrength,
  getValidationErrors,
} from '../../utils/profileValidation';
import ProfileFormFields from './ProfileFormFields';
import './ProfileForms.css';

interface UncontrolledProfileFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

function getFormValues(form: HTMLFormElement): ProfileFormValues {
  const formData = new FormData(form);

  return {
    name: String(formData.get('name') ?? ''),
    age: String(formData.get('age') ?? ''),
    email: String(formData.get('email') ?? ''),
    gender: String(formData.get('gender') ?? '') as ProfileFormValues['gender'],
    terms: formData.get('terms') === 'on',
    password: String(formData.get('password') ?? ''),
    confirmPassword: String(formData.get('confirmPassword') ?? ''),
    country: String(formData.get('country') ?? ''),
    image: extractFile(formData.get('image')),
  };
}

export default function UncontrolledProfileForm({
  onCancel,
  onSuccess,
}: UncontrolledProfileFormProps) {
  const countries = useProfileFormStore(selectCountries);
  const addSubmission = useProfileFormStore(selectAddSubmission);
  const [errors, setErrors] = useState<Partial<Record<ProfileFieldName, string>>>(
    {}
  );
  const [password, setPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const values = {
      ...getFormValues(form),
      image: selectedImage,
    };
    const validationErrors = getValidationErrors(values, countries);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0 || !values.image || values.gender === '') {
      return;
    }

    const imageBase64 = await fileToBase64(values.image);

    addSubmission({
      source: 'Uncontrolled',
      name: values.name,
      age: Number(values.age),
      email: values.email,
      gender: values.gender,
      country: values.country,
      imageBase64,
      passwordStrength: getPasswordStrength(values.password),
    });

    form.reset();
    setPassword('');
    setSelectedImage(null);
    setErrors({});
    onSuccess();
  }, [addSubmission, countries, onSuccess, selectedImage]);

  return (
    <form className="profile-form" noValidate onSubmit={handleSubmit}>
      <ProfileFormFields
        countries={countries}
        errors={errors}
        password={password}
        onImageInput={setSelectedImage}
        onPasswordInput={setPassword}
      />
      <div className="profile-form-actions">
        <button className="secondary-button" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="primary-button" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}
