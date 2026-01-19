import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { sampleInvoices } from '@/lib/sample-data';
import { Search, Plus, Receipt, User, Calendar, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, isPast, isFuture } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Invoices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredInvoices = sampleInvoices.filter((invoice) =>
    invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnpaid = sampleInvoices
    .filter((inv) => inv.status !== 'Paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalPaid = sampleInvoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Invoices</h2>
            <p className="text-muted-foreground">{sampleInvoices.length} total invoices</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="c1">John Anderson</SelectItem>
                      <SelectItem value="c2">Sarah Mitchell</SelectItem>
                      <SelectItem value="c3">Robert Chen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Job</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a job" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="j1">Kitchen Remodel - John Anderson</SelectItem>
                      <SelectItem value="j2">Bathroom Renovation - Sarah Mitchell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="button" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setIsDialogOpen(false)}>
                    Create Invoice
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                  <p className="text-2xl font-bold text-warning">${totalUnpaid.toLocaleString()}</p>
                </div>
                <div className="h-10 w-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Collected</p>
                  <p className="text-2xl font-bold text-success">${totalPaid.toLocaleString()}</p>
                </div>
                <div className="h-10 w-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Invoices list */}
        <div className="space-y-3">
          {filteredInvoices.map((invoice) => {
            const isOverdue = invoice.status !== 'Paid' && isPast(invoice.dueDate);

            return (
              <Card key={invoice.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          invoice.status === 'Paid' ? 'bg-success/10' : 'bg-warning/10'
                        )}
                      >
                        <Receipt
                          className={cn(
                            'h-5 w-5',
                            invoice.status === 'Paid' ? 'text-success' : 'text-warning'
                          )}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">
                            INV-{invoice.id.slice(1)}
                          </h3>
                          <StatusBadge status={invoice.status} />
                          {isOverdue && (
                            <span className="text-xs text-destructive font-medium">OVERDUE</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            {invoice.clientName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            Due {format(invoice.dueDate, 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="sm:ml-auto text-right">
                      <p className="text-2xl font-bold text-foreground">
                        ${invoice.total.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Created {format(invoice.createdAt, 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>

                  {/* Line items preview */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="space-y-2">
                      {invoice.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.description}</span>
                          <span className="font-medium">
                            ${(item.quantity * item.unitPrice).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No invoices found.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
