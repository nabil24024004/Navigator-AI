import { IncidentState } from '../types';

const STORAGE_KEY = 'navigator_history';
const MAX_HISTORY_ITEMS = 50;

export const getHistory = (): IncidentState[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const saveToHistory = (incident: IncidentState) => {
  try {
    const history = getHistory();
    // Add new incident to the beginning
    const updated = [incident, ...history].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save history", e);
  }
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const deleteHistoryItem = (id: string): IncidentState[] => {
    const history = getHistory();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
};
