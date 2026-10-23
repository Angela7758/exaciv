// Shared browser-only coordination: reference speech and local recordings never overlap.
export const AUDIO_STOP_EVENT='exaciv-stop-audio';
export function stopLearningAudio(){if(typeof window!=='undefined'){window.dispatchEvent(new Event(AUDIO_STOP_EVENT));window.speechSynthesis?.cancel();}}