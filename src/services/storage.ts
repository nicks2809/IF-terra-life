// src/services/storage.ts
import { AdvancedSettings, Character, DeathRecord, GameSpeed, LogEntry, ThemeMode, UnlockedAchievement } from '../types';
import { ACHIEVEMENTS_DATA } from '../data/achievements';

export const DEFAULT_ADVANCED_SETTINGS: AdvancedSettings = {
  aiStrategy: 'balanced',
  pauseOnLowHp: true,
  pauseOnOripathyCrisis: false,
  pauseOnRareEvent: false,
  autoUseApAndShop: true,
  minorEventAutoTimeout: false,
  crtEffect: true,
};

const VALID_SPEEDS: GameSpeed[] = [1, 2, 4, 8, 16, 32];

const STORAGE_KEYS = {
  ACTIVE_CHAR: 'terra_life_active_character',
  ACTIVE_LOGS: 'terra_life_active_logs',
  HALL_OF_FAME: 'terra_life_hall_of_fame',
  THEME: 'terra_life_theme_mode',
  MUTED: 'terra_life_audio_muted',
  AUTO_CHOICE: 'terra_life_auto_choice_mode',
  SPEED: 'terra_life_game_speed_v1',
  ACHIEVEMENTS: 'terra_life_achievements_v2',
  DISCOVERED_ENDINGS: 'terra_life_discovered_endings_v2',
  ADVANCED_SETTINGS: 'terra_life_advanced_settings_v1',
  INHERITANCE_LMD: 'terra_life_legacy_inheritance_lmd'
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
      const exists = records.some(r => r.characterName === record.characterName && r.yearOfDeath === record.yearOfDeath && r.ageAtDeath === record.ageAtDeath);
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

  saveSpeed(speed: GameSpeed) {
    try {
      localStorage.setItem(STORAGE_KEYS.SPEED, String(speed));
    } catch {
      // ignore
    }
  },

  loadSpeed(): GameSpeed {
    try {
      const val = Number(localStorage.getItem(STORAGE_KEYS.SPEED)) as GameSpeed;
      return VALID_SPEEDS.includes(val) ? val : 1;
    } catch {
      return 1;
    }
  },

  saveAdvancedSettings(settings: AdvancedSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.ADVANCED_SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  },

  loadAdvancedSettings(): AdvancedSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADVANCED_SETTINGS);
      return data ? { ...DEFAULT_ADVANCED_SETTINGS, ...JSON.parse(data) } : DEFAULT_ADVANCED_SETTINGS;
    } catch {
      return DEFAULT_ADVANCED_SETTINGS;
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
  },

  saveLastInheritanceLmd(lmd: number) {
    try {
      const inherited = Math.min(5000, Math.max(0, Math.floor(lmd * 0.1)));
      localStorage.setItem(STORAGE_KEYS.INHERITANCE_LMD, String(inherited));
    } catch {
      // ignore
    }
  },

  consumeLastInheritanceLmd(): number {
    try {
      const val = Number(localStorage.getItem(STORAGE_KEYS.INHERITANCE_LMD)) || 0;
      localStorage.removeItem(STORAGE_KEYS.INHERITANCE_LMD);
      return val;
    } catch {
      return 0;
    }
  },

  peekLastInheritanceLmd(): number {
    try {
      return Number(localStorage.getItem(STORAGE_KEYS.INHERITANCE_LMD)) || 0;
    } catch {
      return 0;
    }
  },

  // --- 기록관 백업 JSON 내보내기 / 가져오기 ---
  exportBackupJson(): string {
    const payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      hallOfFame: this.loadHallOfFame(),
      achievements: this.loadUnlockedAchievements(),
      discoveredEndings: this.loadDiscoveredEndings(),
      advancedSettings: this.loadAdvancedSettings(),
      activeCharacter: this.loadActiveCharacter(),
      activeLogs: this.loadLogs()
    };
    return JSON.stringify(payload, null, 2);
  },

  importBackupJson(raw: string): boolean {
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return false;
      const hasValidField =
        Array.isArray(parsed.hallOfFame) ||
        (parsed.achievements && typeof parsed.achievements === 'object') ||
        (parsed.discoveredEndings && typeof parsed.discoveredEndings === 'object');
      if (!hasValidField) return false;

      if (Array.isArray(parsed.hallOfFame)) {
        localStorage.setItem(STORAGE_KEYS.HALL_OF_FAME, JSON.stringify(parsed.hallOfFame));
      }
      if (parsed.achievements && typeof parsed.achievements === 'object' && !Array.isArray(parsed.achievements)) {
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(parsed.achievements));
      }
      if (parsed.discoveredEndings && typeof parsed.discoveredEndings === 'object' && !Array.isArray(parsed.discoveredEndings)) {
        localStorage.setItem(STORAGE_KEYS.DISCOVERED_ENDINGS, JSON.stringify(parsed.discoveredEndings));
      }
      if (parsed.advancedSettings && typeof parsed.advancedSettings === 'object') {
        this.saveAdvancedSettings({ ...DEFAULT_ADVANCED_SETTINGS, ...parsed.advancedSettings });
      }
      if (parsed.activeCharacter && typeof parsed.activeCharacter === 'object' && parsed.activeCharacter.name) {
        this.saveActiveCharacter(parsed.activeCharacter);
      }
      if (Array.isArray(parsed.activeLogs)) {
        this.saveLogs(parsed.activeLogs);
      }
      return true;
    } catch {
      return false;
    }
  }
};

