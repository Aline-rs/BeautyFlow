export const colors = {
  rose: '#C77D8A',
  roseLight: '#F7EDEB',
  roseDark: '#9E5A65',
  nude: '#F7EDEB',
  offWhite: '#FFF9F7',
  gold: '#D6A85A',
  goldLight: '#F5EDD8',
  textMain: '#2F2424',
  textSecondary: '#7A6A68',
  success: '#5FA777',
  error: '#D96C6C',
  warning: '#E8B84D',
  border: 'rgba(199, 125, 138, 0.18)',
  borderStrong: 'rgba(199, 125, 138, 0.32)',
} as const;

export type AppColor = keyof typeof colors;