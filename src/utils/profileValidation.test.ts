import { extractFile, fileToBase64 } from './imageFile';
import {
  createProfileSchema,
  getPasswordStrength,
  getValidationErrors,
  validateBasicEmail,
} from './profileValidation';

const image = new File(['avatar'], 'avatar.png', { type: 'image/png' });
const countries = ['Kazakhstan', 'United States'];

describe('profileValidation utilities', () => {
  it('validates email without accepting malformed addresses', () => {
    expect(validateBasicEmail('person@example.com')).toBe(true);
    expect(validateBasicEmail('person@@example.com')).toBe(false);
    expect(validateBasicEmail('@example.com')).toBe(false);
    expect(validateBasicEmail('person@example')).toBe(false);
  });

  it('reports schema errors for invalid form data', () => {
    const errors = getValidationErrors(
      {
        name: 'alice',
        age: '-1',
        email: 'wrong',
        gender: '',
        terms: false,
        password: 'Aa1!',
        confirmPassword: 'Different1!',
        country: 'Atlantis',
        image,
      },
      countries
    );

    expect(errors.name).toBe('First letter must be uppercase');
    expect(errors.age).toBe('Age cannot be negative');
    expect(errors.email).toBe('Email must include one @ and a domain with a dot');
    expect(errors.country).toBe('Choose a country from the list');
    expect(
      getValidationErrors(
        {
          name: 'Alice',
          age: '31',
          email: 'alice@example.com',
          gender: 'female',
          terms: true,
          password: 'Aa1!',
          confirmPassword: 'Different1!',
          country: 'Kazakhstan',
          image,
        },
        countries
      ).confirmPassword
    ).toBe('Passwords must match');
  });

  it('accepts valid profile data and evaluates password strength', () => {
    const result = createProfileSchema(countries).safeParse({
      name: 'Alice',
      age: '31',
      email: 'alice@example.com',
      gender: 'female',
      terms: true,
      password: 'Aa1!',
      confirmPassword: 'Aa1!',
      country: 'Kazakhstan',
      image,
    });

    expect(result.success).toBe(true);
    expect(getPasswordStrength('Aa1!')).toEqual({
      hasNumber: true,
      hasUppercase: true,
      hasLowercase: true,
      hasSpecial: true,
    });
  });

  it('extracts and converts image files to base64', async () => {
    expect(extractFile(image)).toBe(image);
    await expect(fileToBase64(image)).resolves.toContain('data:image/png;base64');
  });
});
