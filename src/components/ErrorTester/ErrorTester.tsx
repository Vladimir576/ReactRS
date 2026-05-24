interface ErrorTesterProps {
  active: boolean;
}

export default function ErrorTester({ active }: ErrorTesterProps) {
  if (active) {
    throw new Error('Simulated application error');
  }

  return null;
}
