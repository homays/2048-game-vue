import type { Theme } from '../types/game';

export const themes: Theme[] = [
  {
    id: 'classic',
    name: '经典',
    colors: {
      background: '#faf8ef',
      board: '#bbada0',
      cell: 'rgba(238, 228, 218, 0.35)',
      text: '#776e65',
      tiles: {
        2: { background: '#eee4da', text: '#776e65' },
        4: { background: '#ede0c8', text: '#776e65' },
        8: { background: '#f2b179', text: '#f9f6f2' },
        16: { background: '#f59563', text: '#f9f6f2' },
        32: { background: '#f67c5f', text: '#f9f6f2' },
        64: { background: '#f65e3b', text: '#f9f6f2' },
        128: { background: '#edcf72', text: '#f9f6f2' },
        256: { background: '#edcc61', text: '#f9f6f2' },
        512: { background: '#edc850', text: '#f9f6f2' },
        1024: { background: '#edc53f', text: '#f9f6f2' },
        2048: { background: '#edc22e', text: '#f9f6f2' },
        4096: { background: '#3c3a32', text: '#f9f6f2' },
        8192: { background: '#3c3a32', text: '#f9f6f2' }
      }
    }
  },
  {
    id: 'dark',
    name: '深色',
    colors: {
      background: '#1a1a2e',
      board: '#16213e',
      cell: 'rgba(255, 255, 255, 0.05)',
      text: '#eaeaea',
      tiles: {
        2: { background: '#2d3a4f', text: '#eaeaea' },
        4: { background: '#3d4a5f', text: '#eaeaea' },
        8: { background: '#e94560', text: '#f9f6f2' },
        16: { background: '#ff6b6b', text: '#f9f6f2' },
        32: { background: '#feca57', text: '#1a1a2e' },
        64: { background: '#ff9ff3', text: '#1a1a2e' },
        128: { background: '#54a0ff', text: '#f9f6f2' },
        256: { background: '#5f27cd', text: '#f9f6f2' },
        512: { background: '#00d2d3', text: '#1a1a2e' },
        1024: { background: '#ff9f43', text: '#f9f6f2' },
        2048: { background: '#10ac84', text: '#f9f6f2' },
        4096: { background: '#ee5a24', text: '#f9f6f2' },
        8192: { background: '#0984e3', text: '#f9f6f2' }
      }
    }
  },
  {
    id: 'forest',
    name: '森林',
    colors: {
      background: '#e8f5e9',
      board: '#4caf50',
      cell: 'rgba(255, 255, 255, 0.3)',
      text: '#1b5e20',
      tiles: {
        2: { background: '#c8e6c9', text: '#1b5e20' },
        4: { background: '#a5d6a7', text: '#1b5e20' },
        8: { background: '#81c784', text: '#1b5e20' },
        16: { background: '#66bb6a', text: '#f9f6f2' },
        32: { background: '#4caf50', text: '#f9f6f2' },
        64: { background: '#43a047', text: '#f9f6f2' },
        128: { background: '#388e3c', text: '#f9f6f2' },
        256: { background: '#2e7d32', text: '#f9f6f2' },
        512: { background: '#1b5e20', text: '#f9f6f2' },
        1024: { background: '#d4e157', text: '#1b5e20' },
        2048: { background: '#afb42b', text: '#f9f6f2' },
        4096: { background: '#827717', text: '#f9f6f2' },
        8192: { background: '#33691e', text: '#f9f6f2' }
      }
    }
  }
];

export function getThemeById(id: string): Theme {
  return themes.find(t => t.id === id) || themes[0];
}

export function getTileColor(theme: Theme, value: number): { background: string; text: string } {
  return theme.colors.tiles[value] || { background: '#3c3a32', text: '#f9f6f2' };
}
