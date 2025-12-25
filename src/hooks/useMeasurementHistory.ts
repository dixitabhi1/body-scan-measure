import { useState, useEffect, useCallback } from "react";
import type { HistoryEntry } from "@/components/MeasurementHistory";

const STORAGE_KEY = "measurement_history";
const MAX_ENTRIES = 10;

export const useMeasurementHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load measurement history:", error);
    }
  }, []);

  // Save to localStorage whenever history changes
  const saveHistory = useCallback((newHistory: HistoryEntry[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error("Failed to save measurement history:", error);
    }
  }, []);

  const addEntry = useCallback((results: HistoryEntry["results"]) => {
    const newEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      results,
    };
    
    const newHistory = [newEntry, ...history].slice(0, MAX_ENTRIES);
    saveHistory(newHistory);
  }, [history, saveHistory]);

  const deleteEntry = useCallback((id: string) => {
    const newHistory = history.filter((entry) => entry.id !== id);
    saveHistory(newHistory);
  }, [history, saveHistory]);

  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, [saveHistory]);

  return {
    history,
    addEntry,
    deleteEntry,
    clearHistory,
  };
};
