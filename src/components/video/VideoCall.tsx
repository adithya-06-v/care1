import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AgoraRTC, {
  type IAgoraRTCClient,
  type ICameraVideoTrack,
  type IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { useRole } from '@/hooks/useRole';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

type LocalTracks = [IMicrophoneAudioTrack, ICameraVideoTrack];

/** Placeholder until real scoring is wired (e.g. speech analysis). Stored on appointment row. */
const SESSION_SCORE_PLACEHOLDER = 70;

interface VideoCallProps {
  roomId: string;
}

function formatMmSs(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

async function stopAndCloseTracks(tracks: LocalTracks | null) {
  if (!tracks) return;
  try {
    tracks[0].stop();
    tracks[1].stop();
  } catch {
    /* ignore */
  }
  try {
    tracks[0].close();
    tracks[1].close();
  } catch {
    /* ignore */
  }
}

export function VideoCall({ roomId }: VideoCallProps) {
  const navigate = useNavigate();
  const { isTherapist } = useRole();

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localTracksRef = useRef<LocalTracks | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [hasRemoteUser, setHasRemoteUser] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [endingCall, setEndingCall] = useState(false);

  const leavingRef = useRef(false);
  /** True after local "End call" DB write succeeds (prevents double updates). */
  const dbEndRequestedRef = useRef(false);
  const callStartedAtRef = useRef<number | null>(null);

  function calculateCallDurationSeconds(): number {
    const started = callStartedAtRef.current;
    if (!started) return 0;
    return Math.max(0, Math.floor((Date.now() - started) / 1000));
  }

  const cleanupAgora = useCallback(async () => {
    const tracks = localTracksRef.current;
    const client = clientRef.current;
    localTracksRef.current = null;
    clientRef.current = null;
    await stopAndCloseTracks(tracks);
    if (client) {
      try {
        await client.leave();
      } catch {
        /* ignore */
      }
    }
  }, []);

  /**
   * Runs for both peers when `appointments.status` becomes `completed` (Realtime).
   * Stops tracks, leaves Agora, redirects — single exit path (no immediate navigate after End click).
   */
  const handleRemoteEndCall = useCallback(async () => {
    if (leavingRef.current) return;
    leavingRef.current = true;

    try {
      await cleanupAgora();
    } catch (err) {
      console.error('Error ending call:', err);
    }

    try {
      navigate(isTherapist ? '/therapist-dashboard' : '/dashboard', {
        replace: true,
        state: isTherapist ? { openSessionNotes: true, roomId } : undefined,
      });
    } catch (err) {
      console.error('Navigation error:', err);
    }
  }, [cleanupAgora, navigate, isTherapist, roomId]);

  /** DB update only — Realtime delivers completion to both therapist and patient. */
  const handleEndCall = async () => {
    if (dbEndRequestedRef.current || leavingRef.current || endingCall) return;

    const duration = calculateCallDurationSeconds();
    setEndingCall(true);

    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          status: 'completed',
          duration,
          score: SESSION_SCORE_PLACEHOLDER,
        })
        .eq('room_id', roomId);

      if (error) {
        console.error(error);
        toast({
          title: 'Could not end call',
          description: error.message,
          variant: 'destructive',
        });
        setEndingCall(false);
        return;
      }

      dbEndRequestedRef.current = true;
    } catch (err) {
      console.error(err);
      toast({
        title: 'Could not end call',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
      setEndingCall(false);
    }
  };

  const toggleMic = async () => {
    const tracks = localTracksRef.current;
    if (!tracks) return;
    const next = !tracks[0].enabled;
    await tracks[0].setEnabled(next);
    setMicOn(next);
  };

  const toggleCamera = async () => {
    const tracks = localTracksRef.current;
    if (!tracks) return;
    const next = !tracks[1].enabled;
    await tracks[1].setEnabled(next);
    setCameraOn(next);
  };

  /** Keeps Realtime on latest handler while useEffect deps stay [roomId] only. */
  const handleRemoteEndCallRef = useRef(handleRemoteEndCall);
  handleRemoteEndCallRef.current = handleRemoteEndCall;

  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`call-end-listener-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const next = payload.new as { status?: string | null };
          if (next.status === 'completed') {
            void handleRemoteEndCallRef.current();
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  /** Call timer: starts once connected (joining false) */
  useEffect(() => {
    if (joining) return;
    const start = callStartedAtRef.current;
    if (!start) return;

    const tick = () => {
      setElapsedSec(Math.max(0, Math.floor((Date.now() - start) / 1000)));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [joining]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const appId = import.meta.env.VITE_AGORA_APP_ID;
      if (!roomId || !appId) {
        if (mounted) {
          setError(!appId ? 'VITE_AGORA_APP_ID is not set' : 'Missing room');
          setJoining(false);
        }
        return;
      }

      let client: IAgoraRTCClient | null = null;

      try {
        client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        clientRef.current = client;

        client.on('user-joined', () => {
          if (mounted) setHasRemoteUser(true);
        });

        client.on('user-left', () => {
          if (!mounted || !clientRef.current) return;
          setHasRemoteUser(clientRef.current.remoteUsers.length > 0);
        });

        await client.join(appId, roomId, null, null);

        if (!mounted) {
          await client.leave();
          clientRef.current = null;
          return;
        }

        const localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

        if (!mounted) {
          await stopAndCloseTracks(localTracks);
          await client.leave();
          clientRef.current = null;
          return;
        }

        localTracksRef.current = localTracks;
        await client.publish(localTracks);

        if (localVideoRef.current) {
          localTracks[1].play(localVideoRef.current);
        }

        client.on('user-published', async (remoteUser, mediaType) => {
          if (!clientRef.current) return;
          await clientRef.current.subscribe(remoteUser, mediaType);
          if (mediaType === 'video' && remoteUser.videoTrack && remoteVideoRef.current) {
            remoteUser.videoTrack.play(remoteVideoRef.current);
          }
          if (mediaType === 'audio' && remoteUser.audioTrack) {
            remoteUser.audioTrack.play();
          }
        });

        if (mounted) {
          callStartedAtRef.current = Date.now();
          setJoining(false);
          if (client.remoteUsers.length > 0) {
            setHasRemoteUser(true);
          }
        }
      } catch (err) {
        console.error('Agora join error:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to join video call');
          setJoining(false);
        }
        if (client) {
          try {
            await client.leave();
          } catch {
            /* ignore */
          }
          clientRef.current = null;
        }
      }
    };

    void init();

    return () => {
      mounted = false;
      void cleanupAgora();
    };
  }, [roomId, cleanupAgora]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6">
        <p className="max-w-md text-center text-destructive">{error}</p>
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    );
  }

  const showWaiting = !joining && !hasRemoteUser;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black">
      {/* Timer — top-left */}
      <div className="pointer-events-none absolute left-4 top-4 z-30 select-none rounded-lg bg-black/50 px-3 py-1.5 font-mono text-sm tabular-nums text-white shadow-lg backdrop-blur-sm">
        {formatMmSs(elapsedSec)}
      </div>

      {/* Remote — full screen */}
      <div className="relative min-h-0 flex-1 bg-black">
        <div
          ref={remoteVideoRef}
          className="absolute inset-0 [&_video]:h-full [&_video]:w-full [&_video]:object-contain"
        />

        {showWaiting && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/60 px-6 text-center backdrop-blur-[2px]">
            <p className="text-lg font-medium text-white/95">Waiting for other user…</p>
            <p className="max-w-sm text-sm text-white/60">
              They will appear here when they join the call
            </p>
          </div>
        )}

        {/* Local — top-right overlay */}
        <div
          ref={localVideoRef}
          className="absolute right-4 top-4 z-20 h-28 w-40 overflow-hidden rounded-xl border border-white/20 bg-zinc-900 shadow-2xl ring-1 ring-white/10 sm:h-36 sm:w-52 [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
        />

        {joining && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/75 text-sm text-white backdrop-blur-sm">
            Joining…
          </div>
        )}
      </div>

      {/* Floating control bar */}
      <div className="pointer-events-none absolute bottom-8 left-0 right-0 z-50 flex justify-center px-4">
        <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-zinc-900/95 px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur-md sm:gap-4 sm:px-6">
          <button
            type="button"
            onClick={() => void toggleMic()}
            disabled={joining}
            aria-pressed={micOn}
            aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
            className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition hover:scale-105 hover:shadow-xl disabled:opacity-40 ${
              micOn
                ? 'bg-white/15 text-white hover:bg-white/25'
                : 'bg-red-500/90 text-white hover:bg-red-600'
            }`}
          >
            {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={() => void toggleCamera()}
            disabled={joining}
            aria-pressed={cameraOn}
            aria-label={cameraOn ? 'Turn off camera' : 'Turn on camera'}
            className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition hover:scale-105 hover:shadow-xl disabled:opacity-40 ${
              cameraOn
                ? 'bg-white/15 text-white hover:bg-white/25'
                : 'bg-red-500/90 text-white hover:bg-red-600'
            }`}
          >
            {cameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={() => void handleEndCall()}
            disabled={joining || endingCall}
            aria-label="End call"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:scale-105 hover:bg-red-700 hover:shadow-xl disabled:opacity-40"
          >
            <PhoneOff className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
