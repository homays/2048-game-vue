import type { LeaderboardEntry, Achievement, BoardSize, GameMode } from '../types/game';

const BEST_SCORE_KEY = '2048-best-score';
const BEST_SCORES_BY_SIZE_KEY = '2048-best-scores-by-size';
const LEADERBOARD_KEY = '2048-leaderboard';
const ACHIEVEMENTS_KEY = '2048-achievements';
const SETTINGS_KEY = '2048-settings';

export function saveBestScore(score: number): void {
  localStorage.setItem(BEST_SCORE_KEY, score.toString());
}

export function getBestScore(): number {
  const score = localStorage.getItem(BEST_SCORE_KEY);
  return score ? parseInt(score, 10) : 0;
}

export function saveBestScoreBySize(size: BoardSize, score: number): void {
  const scores = getBestScoresBySize();
  scores[size] = Math.max(scores[size] || 0, score);
  localStorage.setItem(BEST_SCORES_BY_SIZE_KEY, JSON.stringify(scores));
}

export function getBestScoresBySize(): Record<BoardSize, number> {
  const scores = localStorage.getItem(BEST_SCORES_BY_SIZE_KEY);
  return scores ? JSON.parse(scores) : { 3: 0, 4: 0, 5: 0, 6: 0 };
}

export function addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'date'>): void {
  const entries = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: Date.now().toString(),
    date: Date.now()
  };
  entries.push(newEntry);
  entries.sort((a, b) => b.score - a.score);
  const topEntries = entries.slice(0, 50);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(topEntries));
}

export function getLeaderboard(): LeaderboardEntry[] {
  const entries = localStorage.getItem(LEADERBOARD_KEY);
  return entries ? JSON.parse(entries) : [];
}

export function getLeaderboardBySize(size: BoardSize): LeaderboardEntry[] {
  return getLeaderboard().filter(entry => entry.boardSize === size);
}

export function getLeaderboardByMode(mode: GameMode): LeaderboardEntry[] {
  return getLeaderboard().filter(entry => entry.mode === mode);
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'reach-512', name: '初出茅庐', description: '首次达到512分', icon: '🌱', unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'reach-1024', name: '小有成就', description: '首次达到1024分', icon: '🌿', unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'reach-2048', name: '2048大师', description: '首次达到2048分', icon: '🏆', unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'reach-4096', name: '数字狂人', description: '首次达到4096分', icon: '👑', unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'merge-100', name: '合并新手', description: '累计合并100次', icon: '🔀', unlocked: false, progress: 0, maxProgress: 100 },
  { id: 'merge-1000', name: '合并专家', description: '累计合并1000次', icon: '⚡', unlocked: false, progress: 0, maxProgress: 1000 },
  { id: 'play-3x3', name: '极简挑战者', description: '在3x3模式下游戏', icon: '🎯', unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'play-5x5', name: '空间探索者', description: '在5x5模式下游戏', icon: '🔍', unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'play-6x6', name: '广阔天地', description: '在6x6模式下游戏', icon: '🌍', unlocked: false, progress: 0, maxProgress: 1 },
  { id: 'no-undo-win', name: '完美主义', description: '不使用撤销达到2048', icon: '✨', unlocked: false, progress: 0, maxProgress: 1 }
];

export function getAchievements(): Achievement[] {
  const achievements = localStorage.getItem(ACHIEVEMENTS_KEY);
  if (!achievements) {
    return [...DEFAULT_ACHIEVEMENTS];
  }
  const saved = JSON.parse(achievements);
  return DEFAULT_ACHIEVEMENTS.map(defaultAch => {
    const savedAch = saved.find((a: Achievement) => a.id === defaultAch.id);
    return savedAch || defaultAch;
  });
}

export function saveAchievements(achievements: Achievement[]): void {
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
}

export function updateAchievementProgress(id: string, progress: number): Achievement | null {
  const achievements = getAchievements();
  const achievement = achievements.find(a => a.id === id);
  if (!achievement || achievement.unlocked) return null;
  
  achievement.progress = Math.min(progress, achievement.maxProgress);
  if (achievement.progress >= achievement.maxProgress) {
    achievement.unlocked = true;
    achievement.unlockedAt = Date.now();
  }
  
  saveAchievements(achievements);
  return achievement.unlocked ? achievement : null;
}

export function incrementAchievementProgress(id: string, increment: number = 1): Achievement | null {
  const achievements = getAchievements();
  const achievement = achievements.find(a => a.id === id);
  if (!achievement) return null;
  
  return updateAchievementProgress(id, achievement.progress + increment);
}

interface Settings {
  theme: string;
  soundEnabled: boolean;
  animationEnabled: boolean;
  boardSize: BoardSize;
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'classic',
  soundEnabled: true,
  animationEnabled: true,
  boardSize: 4
};

export function getSettings(): Settings {
  const settings = localStorage.getItem(SETTINGS_KEY);
  return settings ? { ...DEFAULT_SETTINGS, ...JSON.parse(settings) } : DEFAULT_SETTINGS;
}

export function saveSettings(settings: Partial<Settings>): void {
  const current = getSettings();
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
}
