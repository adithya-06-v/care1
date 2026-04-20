/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** ElevenLabs TTS for exercise “Listen Clearly” (dashboard exercise cards / modal) */
  readonly VITE_ELEVENLABS_API_KEY?: string;
  readonly VITE_AGORA_APP_ID?: string;
  /** Supabase auth `user.id` for each therapist card (set in `.env`) */
  readonly VITE_BOOKING_THERAPIST_PRIYA?: string;
  readonly VITE_BOOKING_THERAPIST_RAHUL?: string;
  readonly VITE_BOOKING_THERAPIST_ANJALI?: string;
  readonly VITE_BOOKING_THERAPIST_ARJUN?: string;
  readonly VITE_BOOKING_THERAPIST_KAVITA?: string;
}

declare global {
  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
    onend: ((this: SpeechRecognition, ev: Event) => void) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
    start(): void;
    stop(): void;
    abort(): void;
  }

  interface SpeechRecognitionConstructor {
    new (): SpeechRecognition;
  }

  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export {};
