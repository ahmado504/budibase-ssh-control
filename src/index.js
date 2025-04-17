// src/index.ts
import { startRecording, stopRecording } from './automation';
/**
 * Export both automations for Budibase (or whichever host) to pick up.
 */
export { startRecording, stopRecording };
// Or, if your host expects an array of handlers:
// export const automations = [ startRecording, stopRecording ];
