import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { supabase } from "@/lib/supabase";

type Lead = {
  id: string;
  created_at: string;
  name: string;
  services: string[];
  status: string;
};

export default function Dashboard() {
  const { data: leads, isLoading, error } = useQuery({
    queryKey: ["leads", "dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id,created_at,name,services,status")
        .order("created_at", { ascending: false })
        .limit(25);
      if (error) throw error;
      return (data || []) as Lead[];
    },
  });

  const total = leads?.length ?? 0;
  const open = (leads || []).filter((l) => (l.status || "new") !== "won" && (l.status || "new") !== "lost").length;
  const newest = (leads || []).slice(0, 5);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-muted-foreground">Quick view of new estimate requests.</p>
          </div>
          <Button asChild>
            <Link to="/leads">View Leads</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">Total recent leads</div>
              <div className="text-3xl font-bold">{isLoading ? "—" : total}</div>
              <div className="text-xs text-muted-foreground mt-2">Showing the latest 25 requests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">Open leads</div>
              <div className="text-3xl font-bold">{isLoading ? "—" : open}</div>
              <div className="text-xs text-muted-foreground mt-2">Not marked won/lost yet</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Newest requests</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/leads">Open Leads</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-muted-foreground">Loading…</div>
            ) : error ? (
              <div className="text-sm text-muted-foreground">
                {(error as any)?.message || "Couldn't load leads"}
              </div>
            ) : newest.length === 0 ? (
              <div className="text-muted-foreground">No leads yet.</div>
            ) : (
              <div className="space-y-3">
                {newest.map((l) => (
                  <Link
                    key={l.id}
                    to={`/leads/${l.id}`}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate">{l.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {(l.services || []).join(", ") || "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(l.created_at).toLocaleString()}
                      </div>
                    </div>
                    <StatusBadge status={l.status || "new"} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
