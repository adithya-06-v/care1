import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Flame, Activity } from 'lucide-react';

interface Patient {
  id: string;
  patient_id: string;
  assigned_at: string;
  notes: string | null;
  profile?: {
    full_name: string | null;
    email?: string | null;
    therapy_sessions_completed: number | null;
    current_streak: number | null;
    therapy_mode: string | null;
  };
}

interface PatientListProps {
  patients: Patient[];
  /** Total patients in roster (before search filter); used for empty-search UX */
  rosterTotal?: number;
  selectedPatientId: string | null;
  onSelectPatient: (patientId: string) => void;
  isLoading: boolean;
}

export const PatientList = ({
  patients,
  rosterTotal,
  selectedPatientId,
  onSelectPatient,
  isLoading,
}: PatientListProps) => {
  const total = rosterTotal ?? patients.length;
  const searchNoMatch = total > 0 && patients.length === 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (searchNoMatch) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No patients found</p>
        <p className="text-xs mt-1">Try a different search</p>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No patients yet</p>
        <p className="text-xs mt-1">Patients appear after you accept a booking</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {patients.map((patient) => (
          <Button
            key={patient.id}
            variant={selectedPatientId === patient.patient_id ? 'default' : 'ghost'}
            className={`w-full justify-start h-auto py-3 px-3 ${
              selectedPatientId === patient.patient_id 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
            onClick={() => onSelectPatient(patient.patient_id)}
          >
            <div className="flex items-center gap-3 w-full">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                selectedPatientId === patient.patient_id 
                  ? 'bg-primary-foreground/20' 
                  : 'bg-primary/10'
              }`}>
                <User className={`w-4 h-4 ${
                  selectedPatientId === patient.patient_id 
                    ? 'text-primary-foreground' 
                    : 'text-primary'
                }`} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className={`font-medium truncate ${
                  selectedPatientId === patient.patient_id 
                    ? 'text-primary-foreground' 
                    : 'text-foreground'
                }`}>
                  {patient.profile?.full_name || 'Unknown'}
                </p>
                {patient.profile?.email ? (
                  <p
                    className={`text-xs truncate ${
                      selectedPatientId === patient.patient_id
                        ? 'text-primary-foreground/80'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {patient.profile.email}
                  </p>
                ) : null}
                <div className="flex items-center gap-2 mt-0.5">
                  {patient.profile?.current_streak && patient.profile.current_streak > 0 && (
                    <span className={`flex items-center gap-1 text-xs ${
                      selectedPatientId === patient.patient_id 
                        ? 'text-primary-foreground/70' 
                        : 'text-orange-500'
                    }`}>
                      <Flame className="w-3 h-3" />
                      {patient.profile.current_streak}
                    </span>
                  )}
                  <span className={`flex items-center gap-1 text-xs ${
                    selectedPatientId === patient.patient_id 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    <Activity className="w-3 h-3" />
                    {patient.profile?.therapy_sessions_completed || 0} sessions
                  </span>
                </div>
              </div>
              {patient.profile?.therapy_mode && (
                <Badge 
                  variant="outline" 
                  className={`text-xs capitalize ${
                    selectedPatientId === patient.patient_id 
                      ? 'border-primary-foreground/30 text-primary-foreground' 
                      : ''
                  }`}
                >
                  {patient.profile.therapy_mode.replace('_', ' ')}
                </Badge>
              )}
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};
