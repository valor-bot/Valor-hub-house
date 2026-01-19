import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { sampleJobs } from '@/lib/sample-data';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
} from 'date-fns';
import { cn } from '@/lib/utils';

type ViewMode = 'month' | 'week' | 'day';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getJobsForDay = (date: Date) => {
    return sampleJobs.filter((job) => isSameDay(job.scheduledDate, date));
  };

  const navigatePrev = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const navigateNext = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={navigatePrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-bold text-foreground min-w-[200px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <Button variant="outline" size="icon" onClick={navigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={goToToday}>
              Today
            </Button>
            <div className="flex border border-border rounded-lg overflow-hidden">
              {(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
                <Button
                  key={mode}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'rounded-none px-4',
                    viewMode === mode && 'bg-accent text-accent-foreground'
                  )}
                  onClick={() => setViewMode(mode)}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-0">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-border">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="p-3 text-center text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const dayJobs = getJobsForDay(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isDayToday = isToday(day);

                return (
                  <div
                    key={idx}
                    className={cn(
                      'min-h-[100px] sm:min-h-[120px] p-2 border-b border-r border-border',
                      !isCurrentMonth && 'bg-muted/30',
                      idx % 7 === 0 && 'border-l-0',
                      idx >= calendarDays.length - 7 && 'border-b-0'
                    )}
                  >
                    <div
                      className={cn(
                        'text-sm font-medium mb-1',
                        !isCurrentMonth && 'text-muted-foreground',
                        isDayToday &&
                          'bg-accent text-accent-foreground w-7 h-7 rounded-full flex items-center justify-center'
                      )}
                    >
                      {format(day, 'd')}
                    </div>

                    <div className="space-y-1">
                      {dayJobs.slice(0, 2).map((job) => (
                        <Link
                          key={job.id}
                          to={`/jobs/${job.id}`}
                          className="block p-1.5 rounded text-xs bg-accent/10 hover:bg-accent/20 transition-colors"
                        >
                          <div className="font-medium text-foreground truncate">
                            {job.serviceType}
                          </div>
                          <div className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {job.scheduledTime}
                          </div>
                        </Link>
                      ))}
                      {dayJobs.length > 2 && (
                        <div className="text-xs text-muted-foreground pl-1.5">
                          +{dayJobs.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Today's Jobs List (Mobile Friendly) */}
        <div className="lg:hidden">
          <h3 className="text-lg font-semibold mb-4">
            Jobs on {format(currentDate, 'MMMM d, yyyy')}
          </h3>
          <div className="space-y-3">
            {getJobsForDay(currentDate).length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No jobs scheduled</p>
            ) : (
              getJobsForDay(currentDate).map((job) => (
                <Link key={job.id} to={`/jobs/${job.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{job.serviceType}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Clock className="h-3.5 w-3.5" />
                            {job.scheduledTime}
                            <User className="h-3.5 w-3.5 ml-2" />
                            {job.assignedStaff}
                          </div>
                        </div>
                        <StatusBadge status={job.status} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
