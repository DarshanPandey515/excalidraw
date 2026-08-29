import { STORAGE_KEY, LEGACY_KEY } from '../constants';

export const loadElements = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const strokes = JSON.parse(legacy);
      return strokes.map((s) => ({ ...s, type: 'pen' }));
    }
    return [];
  } catch {
    return [];
  }
};

export const saveElements = (elements) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(elements));
};