import topicDataRaw      from './topicData.json';
import topicOverridesRaw from './topicOverrides.json';

interface TData {
  topics: string[];
  papers: Record<string, { year: number; weights: Record<string, number> }>;
}

const TD        = topicDataRaw as TData;
const OVERRIDES = (topicOverridesRaw as any).overrides as Record<string, string>;

/** Shared topic → colour map. */
export const TOPIC_COLOR: Record<string, string> = {
  'Robotics & Sensing':                   '#76b7b2',
  'Hypertext & Links':                    '#4e79a7',
  'Computer Graphics & AR/VR':            '#f28e2b',
  'Storytelling, Presentation & Cameras': '#d37295',
  'Online Communities':                   '#59a14f',
  'Visualization':                        '#9c755f',
  'Photo/Video Tools':                    '#edc948',
  'Web Search & Content':                 '#ff9da7',
  'Notebooks & Code':                     '#f67019',
  'Interaction Design':                   '#acc236',
  'UI/Visualization for ML':                            '#9467bd',
  'AI Assistance':                            '#17becf',
  'Visual Analytics':                     '#bab0ac',
};

/**
 * Canonical topic order — sorted by earliest paper year in each area:
 *   1987 Robotics & Sensing
 *   1988 Hypertext & Links
 *   1992 Computer Graphics & AR/VR
 *   1992 Storytelling, Presentation & Cameras
 *   1994 Online Communities
 *   1999 Visualization
 *   2001 Photo/Video Tools
 *   2006 Web Search & Content
 *   2006 Notebooks & Code
 *   2006 Interaction Design
 *   2007 UI for AI
 *   2010 AI for UI
 *   2012 Visual Analytics
 */
export const TOPIC_ORDER: string[] = [
  'Robotics & Sensing',
  'Hypertext & Links',
  'Computer Graphics & AR/VR',
  'Storytelling, Presentation & Cameras',
  'Online Communities',
  'Visualization',
  'Photo/Video Tools',
  'Web Search & Content',
  'Notebooks & Code',
  'Interaction Design',
  'UI/Visualization for ML',
  'AI Assistance',
  'Visual Analytics',
];

/**
 * Maps old ML-derived topic names → new canonical names.
 * Applied to papers not found in topicOverrides.json.
 */
export const TOPIC_RENAME: Record<string, string> = {
  'Computer Graphics':     'Computer Graphics & AR/VR',
  'Photo & Image Tools':   'Photo/Video Tools',
  'Video & Rich Media':    'Photo/Video Tools',
  'Data Storytelling':     'Storytelling, Presentation & Cameras',
  'Human-in-the-Loop ML': 'UI/Visualization for ML',       // default; specific papers overridden
  'Immersive & AR/VR':     'Computer Graphics & AR/VR', // default; specific papers overridden
  '3D Navigation & Camera': 'Storytelling, Presentation & Cameras', // eliminated — default fallback
};

/**
 * Resolve the primary display topic for a paper caption.
 * Priority: manual override → ML-derived (with rename) → 'Visualization'.
 */
export function resolveTopic(caption: string): string {
  // 1. Manual override wins (skip section-header separator keys)
  const ov = OVERRIDES[caption];
  if (ov && !ov.startsWith('──')) return ov;

  // 2. ML-derived max-weight topic → apply rename map
  const weights = TD.papers[caption]?.weights ?? {};
  let best = '';
  let maxW = -Infinity;
  Object.entries(weights).forEach(([t, w]) => {
    if ((w as number) > maxW) { maxW = w as number; best = t; }
  });
  if (best) return TOPIC_RENAME[best] ?? best;

  // 3. Default
  return 'Visualization';
}
