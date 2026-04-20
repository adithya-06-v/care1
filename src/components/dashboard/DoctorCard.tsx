import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface DoctorCardProps {
  name: string;
  image: string;
  qualification: string;
  experience: string;
  specialization: string;
  /** Supabase auth user id of the therapist who receives this booking */
  therapistId: string;
}

export const DoctorCard = ({
  name,
  image,
  qualification,
  experience,
  specialization,
  therapistId,
}: DoctorCardProps) => {
  const { user } = useAuth();
  const [imgSrc, setImgSrc] = useState(image);
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=0f5f5c&color=ffffff&bold=true`;

  useEffect(() => {
    setImgSrc(image);
  }, [image]);

  const handleBookSession = async () => {
    if (!user?.id) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to book a session.',
        variant: 'destructive',
      });
      return;
    }

    const therapistIdFinal = therapistId;

    if (!therapistIdFinal) {
      console.error('❌ therapistId missing from env');
      toast({
        title: 'Therapist unavailable',
        description: 'Env not loaded properly',
        variant: 'destructive',
      });
      return;
    }

    console.log('ENV therapistId:', therapistIdFinal);

    const { data: pendingExisting, error: pendingError } = await supabase
      .from('appointments')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('therapist_id', therapistIdFinal)
      .eq('status', 'pending')
      .maybeSingle();

    if (pendingError) {
      toast({
        title: 'Could not check existing bookings',
        description: pendingError.message,
        variant: 'destructive',
      });
      return;
    }

    if (pendingExisting) {
      toast({
        title: 'Booking already pending',
        description: 'You already have a pending appointment with this therapist.',
      });
      return;
    }

    const { error: insertError } = await supabase.from('appointments').insert({
      user_id: user.id,
      therapist_id: therapistIdFinal,
      status: 'pending',
    });

    if (insertError) {
      toast({
        title: 'Booking failed',
        description: insertError.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Session requested',
      description: 'Your booking has been submitted.',
    });
  };

  return (
    <Card
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-200 hover:scale-105 hover:shadow-card-hover"
    >
      <div className="aspect-square w-full overflow-hidden bg-muted">
        <img
          src={imgSrc}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgSrc((s) => (s === fallbackAvatar ? s : fallbackAvatar))}
        />
      </div>
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-semibold leading-tight text-foreground">{name}</h3>
        <p className="text-sm font-medium text-primary">{qualification}</p>
        <p className="text-xs text-muted-foreground">{experience}</p>
        <p className="text-sm text-foreground/90">{specialization}</p>
      </CardContent>
      <CardFooter className="border-t border-border/60 p-4 pt-0">
        <Button
          type="button"
          size="lg"
          className="w-full rounded-pill shadow-button transition-all hover:shadow-card-hover"
          onClick={handleBookSession}
        >
          Book Session
        </Button>
      </CardFooter>
    </Card>
  );
};
