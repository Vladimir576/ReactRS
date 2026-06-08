import {
  selectLatestSubmissionId,
  selectSubmissions,
  useProfileFormStore,
} from '../../store/profileFormStore';
import { genderOptions } from '../../utils/profileValidation';

function formatGender(value: string) {
  return genderOptions.find((option) => option.value === value)?.label ?? value;
}

export default function ProfileSubmissions() {
  const submissions = useProfileFormStore(selectSubmissions);
  const latestSubmissionId = useProfileFormStore(selectLatestSubmissionId);

  if (submissions.length === 0) {
    return (
      <div className="submissions-empty">
        Submitted profiles will appear here after a successful form submit.
      </div>
    );
  }

  return (
    <ul className="submissions-grid" aria-label="Submitted profiles">
      {submissions.map((submission) => (
        <li
          className={`submission-card ${
            submission.id === latestSubmissionId ? 'submission-card-new' : ''
          }`}
          key={submission.id}
        >
          <img alt={`${submission.name} profile`} src={submission.imageBase64} />
          <div className="submission-card-body">
            <div className="submission-card-header">
              <h3>{submission.name}</h3>
              <span>{submission.source}</span>
            </div>
            <p>
              {submission.age} years, {formatGender(submission.gender)}
            </p>
            <p>{submission.email}</p>
            <p>{submission.country}</p>
            <ul className="submission-strength" aria-label="Password checks met">
              {submission.passwordStrength.hasNumber && <li>Number</li>}
              {submission.passwordStrength.hasUppercase && <li>Uppercase</li>}
              {submission.passwordStrength.hasLowercase && <li>Lowercase</li>}
              {submission.passwordStrength.hasSpecial && <li>Special</li>}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}
