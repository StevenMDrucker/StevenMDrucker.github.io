/** Shared topic → colour map used by WordParticleVis and TimelineVis. */
export const TOPIC_COLOR: Record<string, string> = {
  'Hypertext & Links':      '#4e79a7',
  'Computer Graphics':      '#f28e2b',
  '3D Navigation & Camera': '#e15759',
  'Robotics & Sensing':     '#76b7b2',
  'Online Communities':     '#59a14f',
  'Photo & Image Tools':    '#edc948',
  'Video & Rich Media':     '#b07aa1',
  'Web Search & Content':   '#ff9da7',
  'Visualization':          '#9c755f',
  'Visual Analytics':       '#bab0ac',
  'Data Storytelling':      '#d37295',
  'Human-in-the-Loop ML':   '#e377c2',
  'AI Assistance':          '#4dc9f6',
  'Notebooks & Code':       '#f67019',
  'Immersive & AR/VR':      '#537bc4',
  'Interaction Design':     '#acc236',
};

/** Canonical topic display order (matches topicData.json). */
export const TOPIC_ORDER: string[] = [
  'Hypertext & Links',
  'Computer Graphics',
  '3D Navigation & Camera',
  'Robotics & Sensing',
  'Online Communities',
  'Photo & Image Tools',
  'Video & Rich Media',
  'Web Search & Content',
  'Visualization',
  'Visual Analytics',
  'Data Storytelling',
  'Human-in-the-Loop ML',
  'AI Assistance',
  'Notebooks & Code',
  'Immersive & AR/VR',
  'Interaction Design',
];
