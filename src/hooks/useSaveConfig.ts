import { useState, useEffect } from 'react';

/**
 * Custom hook to store and auto-retrieve calculator input fields in localStorage.
 * Enables users to return to partially completed calculations later.
 */
export function useSaveConfig<T>(calculatorKey: string, initialValues: T) {
  const storageKey = `sequenxe_config_${calculatorKey}`;
  const legacyStorageKey = `sequence_config_${calculatorKey}`;

  const [values, setValues] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(storageKey) || localStorage.getItem(legacyStorageKey);
      if (saved) {
        return { ...initialValues, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error(`Error reading ${storageKey} from localStorage`, e);
    }
    return initialValues;
  });

  const [hasSavedIndicator, setHasSavedIndicator] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(values));
      setHasSavedIndicator(true);
      const timeout = setTimeout(() => setHasSavedIndicator(false), 1800);
      return () => clearTimeout(timeout);
    } catch (e) {
      console.error(`Error saving ${storageKey} to localStorage`, e);
    }
  }, [storageKey, values]);

  const resetConfig = () => {
    try {
      localStorage.removeItem(storageKey);
      setValues(initialValues);
    } catch (e) {
      console.error(`Error clearing ${storageKey} from localStorage`, e);
    }
  };

  return {
    values,
    setValues,
    resetConfig,
    hasSavedIndicator
  };
}
