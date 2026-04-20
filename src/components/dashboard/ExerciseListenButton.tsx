import { useState, type ComponentProps } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getExerciseSpeechText, playAudio } from '@/services/tts.js';
import { cn } from '@/lib/utils';

type ExerciseLike = {
  title: string;
  description?: string | null;
};

export interface ExerciseListenButtonProps {
  exercise: ExerciseLike;
  disabled?: boolean;
  className?: string;
  variant?: ComponentProps<typeof Button>['variant'];
  size?: ComponentProps<typeof Button>['size'];
}

export function ExerciseListenButton({
  exercise,
  disabled = false,
  className,
  variant = 'outline',
  size = 'sm',
}: ExerciseListenButtonProps) {
  const [loading, setLoading] = useState(false);
  const text = getExerciseSpeechText(exercise);

  const handleClick = async () => {
    if (!text.trim() || disabled || loading) return;
    setLoading(true);
    try {
      await playAudio(text);
    } catch {
      /* errors logged in tts.js */
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn('gap-2', className)}
      disabled={!text.trim() || disabled || loading}
      aria-busy={loading}
      onClick={() => void handleClick()}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
          Generating audio…
        </>
      ) : (
        <>
          <span aria-hidden>🔊</span>
          Listen Clearly
        </>
      )}
    </Button>
  );
}
