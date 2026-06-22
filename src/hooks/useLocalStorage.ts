import { useState } from 'react';

export function useLocalStorage(key: string, startValue: string) {
  const [value, setValue] = useState(() => {
    return localStorage.getItem(key) || startValue;
  });

  function saveValue(newValue: string) {
    localStorage.setItem(key, newValue);
    setValue(newValue);
  }

  return [value, saveValue] as const;
}
