import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { THERAPY_MODES, TherapyMode, TherapyModeConfig } from '@/lib/therapyModes';
import { motion } from 'framer-motion';

interface TherapyModeSelectorProps {
  userId: string;
  currentMode: TherapyMode | null;
  onModeChange?: (mode: TherapyMode) => void;
}

export const TherapyModeSelector = ({ userId, currentMode, onModeChange }: TherapyModeSelectorProps) => {
  const [selectedMode, setSelectedMode] = useState<TherapyMode>(currentMode || 'pronunciation');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentMode) {
      setSelectedMode(currentMode);
    }
  }, [currentMode]);

  const handleModeSelect = async (mode: TherapyMode) => {
    if (mode === selectedMode) return;
    
    setSelectedMode(mode);
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ therapy_mode: mode })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: 'Mode Updated!',
        description: `Switched to ${THERAPY_MODES[mode].name} mode.`,
      });

      onModeChange?.(mode);
    } catch (error) {
      console.error('Error updating therapy mode:', error);
      toast({
        title: 'Error',
        description: 'Failed to update therapy mode.',
        variant: 'destructive',
      });
      // Revert on error
      setSelectedMode(currentMode || 'pronunciation');
    } finally {
      setIsSaving(false);
    }
  };

  const modes = Object.values(THERAPY_MODES);

  return (
    <Card className="bg-card border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-foreground text-base">
          <Sparkles className="w-5 h-5 text-primary" />
          Therapy Mode
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {modes.map((mode) => (
            <ModeCard
              key={mode.id}
              mode={mode}
              isSelected={selectedMode === mode.id}
              onSelect={() => handleModeSelect(mode.id)}
              isLoading={isSaving && selectedMode === mode.id}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface ModeCardProps {
  mode: TherapyModeConfig;
  isSelected: boolean;
  onSelect: () => void;
  isLoading?: boolean;
}

const ModeCard = ({ mode, isSelected, onSelect, isLoading }: ModeCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        variant="outline"
        onClick={onSelect}
        disabled={isLoading}
        className={`
          relative w-full h-auto p-4 flex flex-col items-start gap-2 rounded-xl
          transition-all duration-200
          ${isSelected 
            ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20' 
            : 'hover:border-primary/50 hover:bg-muted/50'
          }
        `}
      >
        {/* Selected indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2"
          >
            <Badge className="bg-primary text-primary-foreground px-1.5 py-0.5">
              <Check className="w-3 h-3" />
            </Badge>
          </motion.div>
        )}

        {/* Icon and Name */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">{mode.icon}</span>
          <span className={`font-semibold text-sm ${isSelected ? 'text-primary' : 'text-foreground'}`}>
            {mode.name}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground text-left line-clamp-2">
          {mode.description}
        </p>
      </Button>
    </motion.div>
  );
};
