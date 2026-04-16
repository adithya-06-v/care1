import { motion } from "framer-motion";
import { Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecordingButtonProps {
  isRecording: boolean;
  transcript: string;
  status: string;
  audioLevel: number;
  onToggleRecording: () => void;
}

export const RecordingButton = ({
  isRecording,
  transcript,
  status,
  audioLevel,
  onToggleRecording,
}: RecordingButtonProps) => {
  const meterWidth = `${Math.min(100, Math.max(6, audioLevel * 1400))}%`;

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div whileTap={{ scale: 0.95 }} className="relative">
        <motion.div
          className={`pointer-events-none absolute inset-0 rounded-full ${isRecording ? "bg-destructive/25" : "bg-primary/20"}`}
          animate={{ scale: [1, isRecording ? 1.12 : 1.06, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <Button
          size="lg"
          onClick={onToggleRecording}
          className={`min-w-[220px] rounded-full shadow-lg text-white ${
            isRecording
              ? "bg-destructive hover:bg-destructive/90"
              : "bg-primary hover:bg-primary/90"
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-5 h-5 fill-white mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Start Recording
            </>
          )}
        </Button>
      </motion.div>

      {/* Recording Status */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-2 text-destructive"
        >
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-destructive"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <span className="text-sm">Listening...</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">{status}</p>
          <div className="w-full max-w-[260px] h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-150"
              style={{ width: meterWidth }}
            />
          </div>
        </motion.div>
      )}

      {(isRecording || transcript) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 w-full"
        >
          <div className="w-full p-3 bg-muted/40 rounded-lg border border-border text-center min-h-[88px]">
            <p className="text-xs text-muted-foreground mb-1">
              {isRecording ? "Live preview" : "You said"}
            </p>
            <p className="text-sm font-medium text-foreground">
              {transcript || "Start speaking and your words will appear here in real time."}
            </p>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      {!isRecording && !transcript && (
        <p className="text-sm text-muted-foreground">
          {status}
        </p>
      )}
    </div>
  );
};
