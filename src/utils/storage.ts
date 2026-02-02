const BEST_SCORE_KEY = '2048-best-score';

export function saveBestScore(score: number): void {
  localStorage.setItem(BEST_SCORE_KEY, score.toString());
}

export function getBestScore(): number {
  const score = localStorage.getItem(BEST_SCORE_KEY);
  return score ? parseInt(score, 10) : 0;
}
