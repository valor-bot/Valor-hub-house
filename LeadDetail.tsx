import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { supabase } from "@/lib/supabase";

type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  phone: string | null;
  preferred_contact: string | null;
  address: string | null;
  city: string | null;
  zip: string | null;
  services: string[];
  notes: string | null;
  preferred_times: string[] | null;
  status: string;
  admin_notes: string | null;
};

const statusOptions = ["new", "contacted", "scheduled", "won", "lost"] as const;

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["lead", id],
    queryFn: async () => {
      if (!id) throw new Error("Missing lead id");
      const { data, error } = await supabase
        .from("leads")
        .select(
          "id,created_at,name,email,phone,preferred_contact,address,city,zip,services,notes,preferred_times,status,admin_notes"
        )
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Lead;
    },
  });

  const [status, setStatus] = useState<(typeof statusOptions)[number]>("new");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    if (!data) return;
    setStatus((data.status as any) || "new");
    setAdminNotes(data.admin_notes || "");
  }, [data]);

  const update = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Missing lead id");
      const { error } = await supabase
        .from("leads")
        .update({ status, admin_notes: adminNotes || null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["leads"] });
      await qc.invalidateQueries({ queryKey: ["lead", id] });
    },
  });

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Lead</h2>
            <p className="text-muted-foreground">Details and status updates.</p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>

        {isLoading ? (
          <div className="text-muted-foreground">Loading…</div>
        ) : error ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Couldn’t load lead</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {(error as any)?.message || "Unknown error"}
            </CardContent>
          </Card>
        ) : !data ? (
          <div className="text-muted-foreground">Not found.</div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{data.name}</CardTitle>
                <StatusBadge status={data.status || "new"} />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <div className="text-xs text-muted-foreground">Created</div>
                    <div className="text-sm">{new Date(data.created_at).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Preferred contact</div>
                    <div className="text-sm">{data.preferred_contact || "—"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Phone</div>
                    <div className="text-sm">{data.phone || "—"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <div className="text-sm">{data.email || "—"}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Services</div>
                  <div className="text-sm">{(data.services || []).join(", ") || "—"}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Address</div>
                  <div className="text-sm">
                    {[data.address, data.city, data.zip].filter(Boolean).join(", ") || "—"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Project notes</div>
                  <div className="text-sm whitespace-pre-wrap">{data.notes || "—"}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Preferred times</div>
                  <div className="text-sm">{(data.preferred_times || []).join(" · ") || "—"}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Update</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                    <SelectTrigger>
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

                <div className="space-y-2">
                  <Label>Admin notes</Label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Call notes, next steps, etc."
                    rows={6}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={() => update.mutate()}
                  disabled={update.isPending}
                >
                  {update.isPending ? "Saving…" : "Save"}
                </Button>

                {update.isError ? (
                  <div className="text-sm text-destructive">
                    {(update.error as any)?.message || "Couldn't save"}
                  </div>
                ) : null}

                <div className="text-xs text-muted-foreground">
                  Tip: After you contact the customer, set status to <b>contacted</b> or <b>scheduled</b>.
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
