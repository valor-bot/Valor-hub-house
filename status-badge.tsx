import { cn } from '@/lib/utils';
interface StatusBadgeProps {
  status:
    | 'Lead'
    | 'Scheduled'
    | 'In Progress'
    | 'Complete'
    | 'Invoiced'
    | 'Paid'
    | 'Draft'
    | 'Sent'
    | 'Approved'
    | 'Declined'
    | 'new'
    | 'contacted'
    | 'scheduled'
    | 'won'
    | 'lost'
    | string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  Lead: 'status-badge status-lead',
  Scheduled: 'status-badge status-scheduled',
  'In Progress': 'status-badge status-in-progress',
  Complete: 'status-badge status-complete',
  Invoiced: 'status-badge status-invoiced',
  Paid: 'status-badge status-paid',
  Draft: 'status-badge bg-gray-100 text-gray-800',
  Sent: 'status-badge bg-blue-100 text-blue-800',
  Approved: 'status-badge status-complete',
  Declined: 'status-badge bg-red-100 text-red-800',
  new: 'status-badge bg-blue-100 text-blue-800',
  contacted: 'status-badge bg-amber-100 text-amber-800',
  scheduled: 'status-badge status-scheduled',
  won: 'status-badge status-complete',
  lost: 'status-badge bg-gray-100 text-gray-800',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(statusStyles[status] || 'status-badge', className)}>
      {status}
    </span>
  );
}
