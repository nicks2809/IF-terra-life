// src/services/storage.ts
import { Character, DeathRecord, LogEntry, ThemeMode } from '../types';

const STORAGE_KEYS = {
  ACTIVE_CHAR: 'terra_life_active_character',
  ACTIVE_LOGS: 'terra_life_active_logs',
  HALL_OF_FAME: 'terra_life_hall_of_fame',
  THEME: 'terra_life_theme_mode',
  MUTED: 'terra_life_audio_muted'
};

export const storage = {
  saveActiveCharacter(char: Character | null) {
    try {
      if (char) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_CHAR, JSON.stringify(char));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_CHAR);
      }
    } catch {
      // Storage full or unavailable
    }
  },

  loadActiveCharacter(): Character | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_CHAR);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveLogs(logs: LogEntry[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_LOGS, JSON.stringify(logs.slice(-100)));
    } catch {
      // ignore
    }
  },

  loadLogs(): LogEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveMemorial(record: DeathRecord) {
    try {
      const records = this.loadHallOfFame();
      // 중복 방지
      const exists = records.some(r => r.characterName === record.characterName && r.yearOfDeath === record.yearOfDeath);
      if (!exists) {
        records.unshift(record);
        localStorage.setItem(STORAGE_KEYS.HALL_OF_FAME, JSON.stringify(records));
      }
    } catch {
      // ignore
    }
  },

  loadHallOfFame(): DeathRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HALL_OF_FAME);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveTheme(theme: ThemeMode) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      // ignore
    }
  },

  loadTheme(): ThemeMode {
    try {
      const t = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode;
      return t === 'tome' ? 'tome' : 'prts';
    } catch {
      return 'prts';
    }
  },

  saveMuted(muted: boolean) {
    try {
      localStorage.setItem(STORAGE_KEYS.MUTED, String(muted));
    } catch {
      // ignore
    }
  },

  loadMuted(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.MUTED) === 'true';
    } catch {
      return false;
    }
  }
};
