import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface AssignExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  therapistId: string;
  onExerciseAssigned: () => void;
}

export const AssignExerciseDialog = ({
  open,
  onOpenChange,
  patientId,
  therapistId,
  onExerciseAssigned,
}: AssignExerciseDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    instruction: '',
    content: '',
    exercise_type: 'word_repetition',
    difficulty: 'beginner',
    priority: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.instruction || !formData.content) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('custom_exercises')
        .insert({
          therapist_id: therapistId,
          patient_id: patientId,
          title: formData.title,
          instruction: formData.instruction,
          content: formData.content,
          exercise_type: formData.exercise_type,
          difficulty: formData.difficulty,
          priority: formData.priority,
        });

      if (error) throw error;

      toast({
        title: 'Exercise Assigned',
        description: 'The custom exercise has been assigned to the patient.',
      });

      // Reset form and close
      setFormData({
        title: '',
        instruction: '',
        content: '',
        exercise_type: 'word_repetition',
        difficulty: 'beginner',
        priority: 1,
      });
      onExerciseAssigned();
      onOpenChange(false);
    } catch (error) {
      console.error('Error assigning exercise:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign exercise.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Custom Exercise</DialogTitle>
          <DialogDescription>
            Create a personalized exercise for this patient.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Exercise Title *</Label>
              <Input
                id="title"
                placeholder="e.g., R Sound Practice"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="instruction">Instructions *</Label>
              <Textarea
                id="instruction"
                placeholder="e.g., Say each word slowly, focusing on the R sound"
                value={formData.instruction}
                onChange={(e) => setFormData({ ...formData, instruction: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Exercise Content *</Label>
              <Textarea
                id="content"
                placeholder="e.g., Run, River, Rain, Rose, Right"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Exercise Type</Label>
                <Select
                  value={formData.exercise_type}
                  onValueChange={(value) => setFormData({ ...formData, exercise_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="word_repetition">Word Repetition</SelectItem>
                    <SelectItem value="sentence_reading">Sentence Reading</SelectItem>
                    <SelectItem value="tongue_twister">Tongue Twister</SelectItem>
                    <SelectItem value="pronunciation">Pronunciation</SelectItem>
                    <SelectItem value="breathing">Breathing</SelectItem>
                    <SelectItem value="minimal_pairs">Minimal Pairs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Priority (1-5)</Label>
              <Select
                value={formData.priority.toString()}
                onValueChange={(value) => setFormData({ ...formData, priority: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Low</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3 - Medium</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5 - High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Assign Exercise
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
