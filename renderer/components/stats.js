
import { formatBytes, formatDuration } from '../utils/utils.js';
import { statFiles, statDuration, statSize } from './dom.js';
/* Stats */
export function updateStats(stats) {
  statFiles.textContent = stats.count || 0;
  statSize.textContent = formatBytes(stats.size || 0);
  statDuration.textContent = formatDuration(stats.duration || 0);
}