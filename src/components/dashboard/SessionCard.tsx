import type { Database } from '@/integrations/supabase/types';

export type SessionHistoryRow = Database['public']['Tables']['appointments']['Row'] & {
  therapistName: string | null;
};

export function formatSessionDuration(seconds: number | null | undefined): string {
  if (seconds == null || seconds <= 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export interface SessionCardProps {
  session: SessionHistoryRow;
}

export function SessionCard({ session }: SessionCardProps) {
  const created = new Date(session.created_at);
  const dateLine = created.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeLine = created.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
  const duration = formatSessionDuration(session.duration);

  return (
    <li className="rounded-lg border border-transparent px-4 py-3 text-sm transition-colors hover:border-border hover:bg-muted/40">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="font-semibold text-foreground">
            {session.therapistName?.trim() || 'Therapist'}
          </p>
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground/90">{dateLine}</p>
            <p>{timeLine}</p>
          </div>
        </div>
        <p className="shrink-0 text-xs font-medium text-muted-foreground sm:text-right">
          {duration === '—' ? (
            <span>Duration: —</span>
          ) : (
            <span>
              Duration: <span className="text-foreground">{duration}</span>
            </span>
          )}
        </p>
      </div>
      {session.notes?.trim() ? (
        <p className="mt-3 text-muted-foreground whitespace-pre-wrap border-t border-border/60 pt-3">
          <span className="font-medium text-foreground">Notes: </span>
          {session.notes}
        </p>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground italic border-t border-border/60 pt-3">
          No notes for this session.
        </p>
      )}
    </li>
  );
}
