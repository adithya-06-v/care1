import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SessionCard, type SessionHistoryRow } from '@/components/dashboard/SessionCard';

const GROUP_LABELS = ['Today', 'Yesterday', 'Last week', 'Earlier'] as const;
type GroupLabel = (typeof GROUP_LABELS)[number];

function startOfLocalDay(d: Date): number {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

/** Bucket sessions for section headings: Today, Yesterday, rolling last week (2–7d), or Earlier. */
function getSessionGroupLabel(createdAt: string, now = new Date()): GroupLabel {
  const date = new Date(createdAt);
  const t0 = startOfLocalDay(now);
  const t = startOfLocalDay(date);
  const dayMs = 86_400_000;
  const diffDays = Math.round((t0 - t) / dayMs);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays >= 2 && diffDays <= 7) return 'Last week';
  return 'Earlier';
}

function groupSessionsByLabel(sessions: SessionHistoryRow[]): Map<GroupLabel, SessionHistoryRow[]> {
  const map = new Map<GroupLabel, SessionHistoryRow[]>();
  for (const label of GROUP_LABELS) {
    map.set(label, []);
  }
  for (const s of sessions) {
    const label = getSessionGroupLabel(s.created_at);
    map.get(label)!.push(s);
  }
  return map;
}

export interface SessionHistoryProps {
  sessions: SessionHistoryRow[];
}

export function SessionHistory({ sessions }: SessionHistoryProps) {
  const [showAll, setShowAll] = useState(false);

  const sortedSessions = useMemo(() => {
    return [...sessions].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [sessions]);

  const visibleSessions = showAll ? sortedSessions : sortedSessions.slice(0, 5);

  const grouped = useMemo(() => groupSessionsByLabel(visibleSessions), [visibleSessions]);

  if (sessions.length === 0) {
    return <p className="text-sm text-muted-foreground">No completed sessions yet.</p>;
  }

  return (
    <Card className="border-border shadow-card">
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {GROUP_LABELS.map((label) => {
            const groupSessions = grouped.get(label) ?? [];
            if (groupSessions.length === 0) return null;
            return (
              <div key={label}>
                <div className="bg-muted/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {label}
                </div>
                <ul className="divide-y divide-border/80">
                  {groupSessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        {sessions.length > 5 && (
          <div className="border-t border-border px-4 py-3">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="mt-4 text-sm font-medium text-primary hover:text-primary/80 hover:underline"
            >
              {showAll ? 'Show Less' : 'View All Sessions'}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
