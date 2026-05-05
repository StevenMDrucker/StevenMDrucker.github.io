import topicDataRaw      from './topicData.json';
import topicOverridesRaw from './topicOverrides.json';

interface TData {
  topics: string[];
  papers: Record<string, { year: number; weights: Record<string, number> }>;
}

const TD       = topicDataRaw as TData;
const OVERRIDES = (topicOverridesRaw as any).overrides as Record<string, string>;

/** Shared topic → colour map used by WordParticleVis and TimelineVis. */
export const TOPIC_COLOR: Record<string, string> = {
  'Hypertext & Links':                    '#4e79a7',
  'Computer Graphics & AR/VR':            '#f28e2b',
  '3D Navigation & Camera':               '#e15759',
  'Robotics & Sensing':                   '#76b7b2',
  'Online Communities':                   '#59a14f',
  'Photo/Video Tools':                    '#edc948',
  'Web Search & Content':                 '#ff9da7',
  'Visualization':                        '#9c755f',
  'Visual Analytics':                     '#bab0ac',
  'Storytelling, Presentation & Cameras': '#d37295',
  'UI for AI':                            '#9467bd',
  'AI for UI':                            '#17becf',
  'AI Assistance':                        '#4dc9f6',
  'Notebooks & Code':                     '#f67019',
  'Interaction Design':                   '#acc236',
};

/** Canonical topic display order. */
export const TOPIC_ORDER: string[] = [
  'Hypertext & Links',
  'Computer Graphics & AR/VR',
  '3D Navigation & Camera',
  'Robotics & Sensing',
  'Online Communities',
  'Photo/Video Tools',
  'Web Search & Content',
  'Visualization',
  'Visual Analytics',
  'Storytelling, Presentation & Cameras',
  'UI for AI',
  'AI for UI',
  'AI Assistance',
  'Notebooks & Code',
  'Interaction Design',
];

/**
 * Maps old ML-derived topic names → new canonical names.
 * Papers not in topicOverrides fall through to this rename map.
 */
export const TOPIC_RENAME: Record<string, string> = {
  'Computer Graphics':     'Computer Graphics & AR/VR',
  'Photo & Image Tools':   'Photo/Video Tools',
  'Video & Rich Media':    'Photo/Video Tools',
  'Data Storytelling':     'Storytelling, Presentation & Cameras',
  'Human-in-the-Loop ML': 'UI for AI',       // default; specific papers overridden
  'Immersive & AR/VR':     'Computer Graphics & AR/VR', // default; specific papers overridden
};

/**
 * Resolve the primary display topic for a paper caption.
 * Priority: manual override → ML-derived (with rename) → 'Visualization'.
 */
export function resolveTopic(caption: string): string {
  // 1. Manual override wins (skip separator keys)
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
