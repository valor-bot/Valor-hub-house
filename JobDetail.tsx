import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { sampleJobs, sampleClients, JobStatus } from '@/lib/sample-data';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Receipt,
  Edit,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { useState } from 'react';

const statuses: JobStatus[] = ['Lead', 'Scheduled', 'In Progress', 'Complete', 'Invoiced', 'Paid'];

export default function JobDetail() {
  const { id } = useParams();
  const job = sampleJobs.find((j) => j.id === id);
  const client = job ? sampleClients.find((c) => c.id === job.clientId) : null;

  const [status, setStatus] = useState(job?.status || 'Lead');
  const [checklist, setChecklist] = useState(job?.checklistItems || []);

  if (!job) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Job not found</p>
          <Button asChild className="mt-4">
            <Link to="/jobs">Back to Jobs</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const toggleChecklistItem = (itemId: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/jobs">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">{job.serviceType}</h2>
            <p className="text-muted-foreground">{job.clientName}</p>
          </div>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Select value={status} onValueChange={(value) => setStatus(value as JobStatus)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(job.scheduledDate, 'EEEE, MMMM d, yyyy')}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{job.scheduledTime}</span>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Assigned to {job.assignedStaff}</span>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{job.address}</span>
                </div>

                {job.estimateAmount && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Estimate Amount</span>
                      <span className="text-xl font-bold">${job.estimateAmount.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                {checklist.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No checklist items</p>
                ) : (
                  <div className="space-y-3">
                    {checklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={() => toggleChecklistItem(item.id)}
                        />
                        <span
                          className={
                            item.completed
                              ? 'text-muted-foreground line-through'
                              : 'text-foreground'
                          }
                        >
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  defaultValue={job.notes}
                  placeholder="Add notes about this job..."
                  className="min-h-[100px]"
                />
                <Button className="mt-3 bg-accent text-accent-foreground hover:bg-accent/90">
                  Save Notes
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            {client && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Client</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-medium">
                        {client.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{client.name}</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${client.phone}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="h-4 w-4" />
                    {client.phone}
                  </a>

                  <a
                    href={`mailto:${client.email}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="h-4 w-4" />
                    {client.email}
                  </a>

                  {client.notes && (
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded mt-3">
                      {client.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/estimates">
                    <FileText className="h-4 w-4 mr-2" />
                    View Estimate
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/invoices">
                    <Receipt className="h-4 w-4 mr-2" />
                    Create Invoice
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
