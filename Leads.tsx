import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { supabase } from "@/lib/supabase";
import { useMemo, useState } from "react";

type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  phone: string | null;
  services: string[];
  status: string;
};

const statusOptions = ["all", "new", "contacted", "scheduled", "won", "lost"] as const;

export default function Leads() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id,created_at,name,email,phone,services,status")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as Lead[];
    },
  });

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (data || []).filter((l) => {
      if (status !== "all" && (l.status || "new") !== status) return false;
      if (!needle) return true;
      const hay = `${l.name} ${l.email || ""} ${l.phone || ""} ${(l.services || []).join(" ")}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [data, q, status]);

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Leads</h2>
            <p className="text-muted-foreground">New estimate requests and status tracking.</p>
          </div>
          <div className="flex gap-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, phone, service…"
              className="w-full sm:w-72"
            />
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-muted-foreground">Loading…</div>
        ) : error ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Couldn’t load leads</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {(error as any)?.message || "Unknown error"}
              <div className="mt-2">
                If you see a permissions error, add your email to the <code>admins</code> table and apply the RLS
                policies.
              </div>
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <div className="text-muted-foreground">No leads found.</div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((l) => (
              <Link key={l.id} to={`/leads/${l.id}`} className="block">
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{l.name}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {(l.services || []).join(", ") || "—"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(l.created_at).toLocaleString()}
                          {l.phone ? (
                            <>
                              {" · "}
                              {l.phone}
                            </>
                          ) : null}
                          {l.email ? (
                            <>
                              {" · "}
                              {l.email}
                            </>
                          ) : null}
                        </div>
                      </div>
                      <StatusBadge status={l.status || "new"} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
