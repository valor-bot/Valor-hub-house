import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { sampleEstimates } from '@/lib/sample-data';
import { Search, Plus, FileText, User, Calendar } from 'lucide-react';
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
import { format } from 'date-fns';

export default function Estimates() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredEstimates = sampleEstimates.filter((estimate) =>
    estimate.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Estimates</h2>
            <p className="text-muted-foreground">{sampleEstimates.length} total estimates</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                New Estimate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Estimate</DialogTitle>
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

                <div className="space-y-3">
                  <Label>Line Items</Label>
                  <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
                    <div className="col-span-6">Description</div>
                    <div className="col-span-2">Qty</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-2">Total</div>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <Input className="col-span-6" placeholder="Item description" />
                    <Input className="col-span-2" type="number" placeholder="1" />
                    <Input className="col-span-2" type="number" placeholder="0.00" />
                    <div className="col-span-2 flex items-center text-sm">$0.00</div>
                  </div>
                  <Button type="button" variant="outline" size="sm">
                    + Add Line Item
                  </Button>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="button" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setIsDialogOpen(false)}>
                    Create Estimate
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search estimates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Estimates list */}
        <div className="space-y-3">
          {filteredEstimates.map((estimate) => (
            <Card key={estimate.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-info" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">EST-{estimate.id.slice(1)}</h3>
                        <StatusBadge status={estimate.status} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {estimate.clientName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(estimate.createdAt, 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:ml-auto text-right">
                    <p className="text-2xl font-bold text-foreground">
                      ${estimate.total.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {estimate.items.length} line items
                    </p>
                  </div>
                </div>

                {/* Line items preview */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="space-y-2">
                    {estimate.items.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.description}</span>
                        <span className="font-medium">
                          ${(item.quantity * item.unitPrice).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {estimate.items.length > 2 && (
                      <p className="text-sm text-muted-foreground">
                        +{estimate.items.length - 2} more items
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEstimates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No estimates found.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
