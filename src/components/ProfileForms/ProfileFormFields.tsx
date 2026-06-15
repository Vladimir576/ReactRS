import {
  memo,
  useCallback,
  useMemo,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import type { UseFormRegister } from 'react-hook-form';
import type { ProfileFieldName, ProfileFormValues } from '../../types/profileForm';
import { genderOptions, getPasswordStrength } from '../../utils/profileValidation';

interface ProfileFormFieldsProps {
  countries: string[];
  errors: Partial<Record<ProfileFieldName, string>>;
  password: string;
  register?: UseFormRegister<ProfileFormValues>;
  onPasswordInput?: (password: string) => void;
  onImageInput?: (file: File | null) => void;
}

interface ErrorMessageProps {
  id: string;
  message?: string;
}

const ErrorMessage = memo(function ErrorMessage({ id, message }: ErrorMessageProps) {
  return (
    <p aria-live="polite" className="form-error" id={id}>
      {message ?? '\u00a0'}
    </p>
  );
});

function ProfileFormFields({
  countries,
  errors,
  password,
  register,
  onPasswordInput,
  onImageInput,
}: ProfileFormFieldsProps) {
  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const sortedCountries = useMemo(
    () => [...countries].sort((firstCountry, secondCountry) =>
      firstCountry.localeCompare(secondCountry)
    ),
    [countries]
  );
  const passwordRegistration = register?.('password', {
    onChange: (event) => {
      onPasswordInput?.(String(event.target.value));
    },
  });
  const imageRegistration = onImageInput ? undefined : register?.('image');
  const handleImageChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onImageInput?.(event.target.files?.item(0) ?? null);
  }, [onImageInput]);

  const handlePasswordInput = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      onPasswordInput?.(event.currentTarget.value);
    },
    [onPasswordInput]
  );

  return (
    <div className="profile-form-grid">
      <div className="field-group">
        <label htmlFor="profile-name">Name</label>
        <input
          aria-describedby="profile-name-error"
          id="profile-name"
          name="name"
          type="text"
          {...register?.('name')}
        />
        <ErrorMessage id="profile-name-error" message={errors.name} />
      </div>

      <div className="field-group">
        <label htmlFor="profile-age">Age</label>
        <input
          aria-describedby="profile-age-error"
          id="profile-age"
          name="age"
          type="number"
          {...register?.('age')}
        />
        <ErrorMessage id="profile-age-error" message={errors.age} />
      </div>

      <div className="field-group">
        <label htmlFor="profile-email">Email</label>
        <input
          aria-describedby="profile-email-error"
          id="profile-email"
          name="email"
          type="email"
          {...register?.('email')}
        />
        <ErrorMessage id="profile-email-error" message={errors.email} />
      </div>

      <div className="field-group">
        <label htmlFor="profile-gender">Gender</label>
        <select
          aria-describedby="profile-gender-error"
          id="profile-gender"
          name="gender"
          {...register?.('gender')}
        >
          <option value="">Choose gender</option>
          {genderOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ErrorMessage id="profile-gender-error" message={errors.gender} />
      </div>

      <div className="field-group">
        <label htmlFor="profile-country">Country</label>
        <input
          aria-describedby="profile-country-error"
          id="profile-country"
          list="profile-countries"
          name="country"
          type="text"
          {...register?.('country')}
        />
        <datalist id="profile-countries">
          {sortedCountries.map((country) => (
            <option key={country} value={country} />
          ))}
        </datalist>
        <ErrorMessage id="profile-country-error" message={errors.country} />
      </div>

      <div className="field-group">
        <label htmlFor="profile-image">Profile image</label>
        <input
          accept="image/png,image/jpeg"
          aria-describedby="profile-image-error"
          id="profile-image"
          name="image"
          type="file"
          {...imageRegistration}
          onChange={handleImageChange}
        />
        <ErrorMessage id="profile-image-error" message={errors.image} />
      </div>

      <div className="field-group">
        <label htmlFor="profile-password">Password</label>
        <input
          aria-describedby="profile-password-error"
          id="profile-password"
          name="password"
          type="password"
          onInput={handlePasswordInput}
          {...passwordRegistration}
        />
        <ErrorMessage id="profile-password-error" message={errors.password} />
        <ul className="password-strength" aria-label="Password strength">
          <li className={strength.hasNumber ? 'met' : ''}>1 number</li>
          <li className={strength.hasUppercase ? 'met' : ''}>1 uppercase</li>
          <li className={strength.hasLowercase ? 'met' : ''}>1 lowercase</li>
          <li className={strength.hasSpecial ? 'met' : ''}>1 special character</li>
        </ul>
      </div>

      <div className="field-group">
        <label htmlFor="profile-confirm-password">Confirm password</label>
        <input
          aria-describedby="profile-confirm-password-error"
          id="profile-confirm-password"
          name="confirmPassword"
          type="password"
          {...register?.('confirmPassword')}
        />
        <ErrorMessage
          id="profile-confirm-password-error"
          message={errors.confirmPassword}
        />
      </div>

      <div className="field-group terms-field">
        <input id="profile-terms" name="terms" type="checkbox" {...register?.('terms')} />
        <label htmlFor="profile-terms">Accept Terms and Conditions</label>
        <ErrorMessage id="profile-terms-error" message={errors.terms} />
      </div>
    </div>
  );
}

export default memo(ProfileFormFields);
