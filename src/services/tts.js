/**
 * ElevenLabs Text-to-Speech with browser speechSynthesis fallback.
 */

let lastAudio = null;
let lastObjectUrl = null;

function stopCurrentPlayback() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
  }
  if (lastAudio) {
    try {
      lastAudio.pause();
      lastAudio.src = '';
    } catch {
      /* ignore */
    }
    lastAudio = null;
  }
  if (lastObjectUrl) {
    try {
      URL.revokeObjectURL(lastObjectUrl);
    } catch {
      /* ignore */
    }
    lastObjectUrl = null;
  }
}

/**
 * Returns an object URL for ElevenLabs audio, or null if the request cannot be completed.
 * Does not throw on API/network failure — callers may fall back to browser TTS.
 */
export async function generateSpeech(text) {
  const payload =
    typeof text === 'string' && text.trim() ? text.trim() : String(text ?? '').trim();
  if (!payload) {
    return null;
  }

  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.warn('[tts] VITE_ELEVENLABS_API_KEY is not set — will use browser TTS if playAudio falls back');
    return null;
  }

  try {
    const response = await fetch(
      'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL',
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: payload,
          model_id: 'eleven_multilingual_v2',
        }),
      },
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.warn('[tts] ElevenLabs API failed:', response.status, detail);
      return null;
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn('[tts] generateSpeech failed:', err);
    return null;
  }
}

function speakBrowserTts(text, waitUntilEnd) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.8;
  utterance.pitch = 1;
  utterance.lang = 'en-US';

  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return Promise.resolve();
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);

  if (!waitUntilEnd) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
  });
}

/**
 * @param {string} text
 * @param {{ waitUntilEnd?: boolean }} [options] - Use waitUntilEnd for sequential clips (e.g. therapy feedback).
 */
export async function playAudio(text, options = {}) {
  const trimmed = typeof text === 'string' ? text.trim() : '';
  if (!trimmed) return;

  const waitUntilEnd = options.waitUntilEnd === true;

  try {
    stopCurrentPlayback();

    const audioUrl = await generateSpeech(trimmed);

    if (!audioUrl) {
      throw new Error('ElevenLabs unavailable');
    }

    const audio = new Audio(audioUrl);
    lastAudio = audio;
    lastObjectUrl = audioUrl;

    const cleanup = () => {
      if (lastObjectUrl === audioUrl) {
        try {
          URL.revokeObjectURL(audioUrl);
        } catch {
          /* ignore */
        }
        lastObjectUrl = null;
        lastAudio = null;
      }
    };

    audio.addEventListener('ended', cleanup, { once: true });
    audio.addEventListener(
      'error',
      () => {
        cleanup();
      },
      { once: true },
    );

    await audio.play();

    if (waitUntilEnd) {
      await new Promise((resolve, reject) => {
        audio.addEventListener('ended', () => resolve(), { once: true });
        audio.addEventListener('error', () => reject(new Error('Audio error')), {
          once: true,
        });
      });
    }
  } catch (err) {
    console.warn('ElevenLabs failed, using browser TTS');

    stopCurrentPlayback();
    await speakBrowserTts(trimmed, waitUntilEnd);
  }
}

/**
 * @param {{ title?: string | null; description?: string | null } | null | undefined} exercise
 * @returns {string}
 */
export function getExerciseSpeechText(exercise) {
  if (!exercise) return '';
  const title = (exercise.title || '').trim();
  const desc = (exercise.description || '').trim();
  if (desc && title) return `${title}. ${desc}`;
  return desc || title || '';
}
