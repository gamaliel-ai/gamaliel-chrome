import type { PageSnapshot } from './capture.ts';

export type CaptureRequest = { type: 'capture' };
export type CaptureResponse = { type: 'snapshot'; snapshot: PageSnapshot };

export type PanelToBackground = { type: 'ask' };
export type BackgroundToPanel =
  | { type: 'delta'; text: string }
  | { type: 'done' }
  | { type: 'error'; message: string };
