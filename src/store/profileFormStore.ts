import { create } from 'zustand';
import type { FormSource, ProfileSubmission } from '../types/profileForm';

interface AddSubmissionPayload
  extends Omit<ProfileSubmission, 'id' | 'submittedAt' | 'source'> {
  source: FormSource;
}

interface ProfileFormState {
  countries: string[];
  submissions: ProfileSubmission[];
  latestSubmissionId: string | null;
  addSubmission: (submission: AddSubmissionPayload) => string;
  clearSubmissions: () => void;
}

const countries = [
  'Argentina',
  'Australia',
  'Brazil',
  'Canada',
  'France',
  'Germany',
  'India',
  'Japan',
  'Kazakhstan',
  'Poland',
  'United Kingdom',
  'United States',
];

export const useProfileFormStore = create<ProfileFormState>((set) => ({
  countries,
  submissions: [],
  latestSubmissionId: null,
  addSubmission: (submission) => {
    const id = crypto.randomUUID();

    set((state) => ({
      submissions: [
        {
          ...submission,
          id,
          submittedAt: new Date().toISOString(),
        },
        ...state.submissions,
      ],
      latestSubmissionId: id,
    }));

    window.setTimeout(() => {
      set((state) => ({
        latestSubmissionId:
          state.latestSubmissionId === id ? null : state.latestSubmissionId,
      }));
    }, 3000);

    return id;
  },
  clearSubmissions: () => set({ submissions: [], latestSubmissionId: null }),
}));

export const selectCountries = (state: ProfileFormState) => state.countries;

export const selectSubmissions = (state: ProfileFormState) => state.submissions;

export const selectLatestSubmissionId = (state: ProfileFormState) =>
  state.latestSubmissionId;

export const selectAddSubmission = (state: ProfileFormState) =>
  state.addSubmission;

export const selectClearSubmissions = (state: ProfileFormState) =>
  state.clearSubmissions;
