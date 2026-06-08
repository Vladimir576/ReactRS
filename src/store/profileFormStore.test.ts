import {
  selectClearSubmissions,
  selectCountries,
  useProfileFormStore,
} from './profileFormStore';
import { getPasswordStrength } from '../utils/profileValidation';

describe('profileFormStore', () => {
  beforeEach(() => {
    useProfileFormStore.getState().clearSubmissions();
  });

  it('stores all submissions and marks the latest one', () => {
    const state = useProfileFormStore.getState();
    const id = state.addSubmission({
      source: 'Uncontrolled',
      name: 'Alice',
      age: 29,
      email: 'alice@example.com',
      gender: 'female',
      country: 'Kazakhstan',
      imageBase64: 'data:image/png;base64,test',
      passwordStrength: getPasswordStrength('Aa1!'),
    });

    expect(useProfileFormStore.getState().submissions).toHaveLength(1);
    expect(useProfileFormStore.getState().latestSubmissionId).toBe(id);
  });

  it('exposes countries and clear action through selectors', () => {
    expect(selectCountries(useProfileFormStore.getState())).toContain('Kazakhstan');

    selectClearSubmissions(useProfileFormStore.getState())();

    expect(useProfileFormStore.getState().submissions).toEqual([]);
  });
});
