// src/services/storage.ts
import { Character, DeathRecord, LogEntry, ThemeMode, UnlockedAchievement } from '../types';
import { ACHIEVEMENTS_DATA } from '../data/achievements';

const STORAGE_KEYS = {
  ACTIVE_CHAR: 'terra_life_active_character',
  ACTIVE_LOGS: 'terra_life_active_logs',
  HALL_OF_FAME: 'terra_life_hall_of_fame',
  THEME: 'terra_life_theme_mode',
  MUTED: 'terra_life_audio_muted',
  AUTO_CHOICE: 'terra_life_auto_choice_mode',
  ACHIEVEMENTS: 'terra_life_achievements_v2',
  DISCOVERED_ENDINGS: 'terra_life_discovered_endings_v2'
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
      if (record.endingId) {
        this.saveDiscoveredEnding(record.endingId);
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
  },

  saveAutoChoice(enabled: boolean) {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTO_CHOICE, String(enabled));
    } catch {
      // ignore
    }
  },

  loadAutoChoice(): boolean {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.AUTO_CHOICE);
      return val === null ? true : val === 'true';
    } catch {
      return true;
    }
  },

  // --- 다회차 누적 업적 도감 관리 (Cross-run Achievement Collection Book) ---
  loadUnlockedAchievements(): Record<string, UnlockedAchievement> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  saveUnlockedAchievement(achievementId: string, charName: string, year: number): boolean {
    try {
      const unlockedMap = this.loadUnlockedAchievements();
      if (!unlockedMap[achievementId]) {
        unlockedMap[achievementId] = {
          id: achievementId,
          unlockedAt: new Date().toISOString(),
          characterName: charName,
          year: year
        };
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(unlockedMap));
        return true; // Newly unlocked!
      }
      return false; // Already unlocked
    } catch {
      return false;
    }
  },

  isAchievementUnlocked(achievementId: string): boolean {
    const unlockedMap = this.loadUnlockedAchievements();
    return !!unlockedMap[achievementId];
  },

  getAchievementCollectionStats(): { unlockedCount: number; totalCount: number; totalPoints: number } {
    const unlockedMap = this.loadUnlockedAchievements();
    const totalCount = ACHIEVEMENTS_DATA.length;
    let unlockedCount = 0;
    let totalPoints = 0;

    for (const ach of ACHIEVEMENTS_DATA) {
      if (unlockedMap[ach.id]) {
        unlockedCount++;
        totalPoints += ach.points;
      }
    }

    return { unlockedCount, totalCount, totalPoints };
  },

  // --- 발견한 엔딩 도감 관리 ---
  loadDiscoveredEndings(): Record<string, string> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DISCOVERED_ENDINGS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  saveDiscoveredEnding(endingId: string) {
    try {
      const map = this.loadDiscoveredEndings();
      if (!map[endingId]) {
        map[endingId] = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.DISCOVERED_ENDINGS, JSON.stringify(map));
      }
    } catch {
      // ignore
    }
  }
};
