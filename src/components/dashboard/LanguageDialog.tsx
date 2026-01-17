import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface LanguageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  userId: string;
}

interface LanguageGroup {
  name: string;
  languages: string[];
}

const languageGroups: LanguageGroup[] = [
  {
    name: 'Indian Languages',
    languages: [
      'Hindi',
      'Bengali',
      'Telugu',
      'Marathi',
      'Tamil',
      'Gujarati',
      'Kannada',
      'Malayalam',
      'Punjabi',
      'Odia',
      'Assamese',
      'Urdu',
      'Sanskrit',
      'Konkani',
      'Manipuri',
      'Nepali',
      'Sindhi',
      'Kashmiri',
      'Dogri',
      'Maithili',
    ],
  },
  {
    name: 'European Languages',
    languages: [
      'English',
      'Spanish',
      'French',
      'German',
      'Italian',
      'Portuguese',
      'Dutch',
      'Russian',
      'Polish',
      'Swedish',
    ],
  },
  {
    name: 'Asian Languages',
    languages: [
      'Mandarin',
      'Japanese',
      'Korean',
      'Thai',
      'Vietnamese',
      'Indonesian',
      'Malay',
      'Filipino',
    ],
  },
  {
    name: 'Middle Eastern Languages',
    languages: [
      'Arabic',
      'Hebrew',
      'Persian',
      'Turkish',
    ],
  },
];

export const LanguageDialog = ({
  open,
  onOpenChange,
  selectedLanguage,
  onLanguageChange,
  userId,
}: LanguageDialogProps) => {
  const [saving, setSaving] = useState(false);
  const [tempSelected, setTempSelected] = useState(selectedLanguage);

  useEffect(() => {
    setTempSelected(selectedLanguage);
  }, [selectedLanguage, open]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ preferred_language: tempSelected })
        .eq('user_id', userId);

      if (error) throw error;

      onLanguageChange(tempSelected);
      toast({
        title: 'Language Updated',
        description: `Your therapy language is now set to ${tempSelected}.`,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating language:', error);
      toast({
        title: 'Error',
        description: 'Failed to update language. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Select Therapy Language
          </DialogTitle>
          <DialogDescription>
            Choose from 40+ languages including major Indian regional languages
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {languageGroups.map((group) => (
              <div key={group.name}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  {group.name}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {group.languages.map((lang) => (
                    <Button
                      key={lang}
                      variant={tempSelected === lang ? 'default' : 'outline'}
                      size="sm"
                      className={`justify-start h-auto py-2 px-3 ${
                        tempSelected === lang ? 'shadow-button' : ''
                      }`}
                      onClick={() => setTempSelected(lang)}
                    >
                      {tempSelected === lang && (
                        <Check className="w-4 h-4 mr-2 shrink-0" />
                      )}
                      <span className="truncate">{lang}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Language'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
