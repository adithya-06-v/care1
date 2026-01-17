import { motion } from 'framer-motion';
import { Mic, Square, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';

interface RecordingButtonProps {
  isRecording: boolean;
  hasRecording: boolean;
  audioUrl: string | null;
  duration: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onResetRecording: () => void;
}

export const RecordingButton = ({
  isRecording,
  hasRecording,
  audioUrl,
  duration,
  onStartRecording,
  onStopRecording,
  onResetRecording,
}: RecordingButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main Recording Button */}
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        {isRecording && (
          <motion.div
            className="absolute inset-0 rounded-full bg-destructive/30"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
        <Button
          size="lg"
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={`w-20 h-20 rounded-full shadow-lg ${
            isRecording 
              ? 'bg-destructive hover:bg-destructive/90' 
              : hasRecording 
              ? 'bg-primary hover:bg-primary/90' 
              : 'bg-primary hover:bg-primary/90'
          }`}
        >
          {isRecording ? (
            <Square className="w-8 h-8 text-white fill-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </Button>
      </motion.div>

      {/* Recording Status */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-destructive"
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-destructive"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <span className="font-mono font-medium">{formatDuration(duration)}</span>
          <span className="text-sm">Recording...</span>
        </motion.div>
      )}

      {/* Playback Controls */}
      {hasRecording && !isRecording && audioUrl && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlayback}
            className="rounded-full"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 mr-1" />
            ) : (
              <Play className="w-4 h-4 mr-1" />
            )}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetRecording}
            className="text-muted-foreground"
          >
            Re-record
          </Button>
        </motion.div>
      )}

      {/* Instructions */}
      {!isRecording && !hasRecording && (
        <p className="text-sm text-muted-foreground">
          Tap to start recording your voice
        </p>
      )}
    </div>
  );
};
