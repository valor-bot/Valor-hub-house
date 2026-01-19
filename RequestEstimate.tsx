import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

const SERVICE_OPTIONS = [
  "Cabinet Painting",
  "Flooring",
  "Drywall/Repairs",
  "Trim & Finish Work",
  "Interior Paint",
  "Exterior Paint",
  "Handyman/Refresh",
];

type LeadInsert = {
  name: string;
  email?: string | null;
  phone?: string | null;
  preferred_contact: string;
  address?: string | null;
  city?: string | null;
  zip?: string | null;
  services: string[];
  notes?: string | null;
  preferred_times?: string[] | null;
  status?: string;
};

export default function RequestEstimate() {
  const [params] = useSearchParams();
  const prefillService = params.get("service");

  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [services, setServices] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredContact, setPreferredContact] = useState("phone");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [notes, setNotes] = useState("");
  const [time1, setTime1] = useState("");
  const [time2, setTime2] = useState("");
  const [time3, setTime3] = useState("");

  useEffect(() => {
    if (prefillService && SERVICE_OPTIONS.includes(prefillService)) {
      setServices((prev) => (prev.includes(prefillService) ? prev : [prefillService, ...prev]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const preferredTimes = useMemo(
    () => [time1, time2, time3].map((t) => t.trim()).filter(Boolean),
    [time1, time2, time3]
  );

  const toggleService = (s: string) => {
    setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const submit = async () => {
    setError(null);
    if (!name.trim()) return setError("Name is required.");
    if (services.length === 0) return setError("Please select at least one service.");

    const payload: LeadInsert = {
      name: name.trim(),
      email: email.trim() || null,
      phone: phone.trim() || null,
      preferred_contact: preferredContact,
      address: address.trim() || null,
      city: city.trim() || null,
      zip: zip.trim() || null,
      services,
      notes: notes.trim() || null,
      preferred_times: preferredTimes.length ? preferredTimes : null,
      status: "new",
    };

    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .insert([payload])
      .select("id")
      .single();
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSubmittedId(data.id);
  };

  return (
    <PublicLayout>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold">Request a Free Estimate</h1>
        <p className="text-muted-foreground mt-2">
          Tell us what you need and we’ll reach out to confirm details and schedule a visit.
        </p>

        {submittedId ? (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Thanks — we got it!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div>We’ll contact you shortly to confirm and schedule your free estimate.</div>
              <div className="text-xs">Confirmation ID: {submittedId}</div>
              <div className="pt-2">
                Prefer to talk now? Call <a className="underline" href="tel:14802961441">480-296-1441</a>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>1) Select services</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {SERVICE_OPTIONS.map((s) => (
                  <label key={s} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <Checkbox checked={services.includes(s)} onCheckedChange={() => toggleService(s)} />
                    <span className="text-sm">{s}</span>
                  </label>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2) Location + notes</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address" />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="zip">ZIP</Label>
                    <Input id="zip" value={zip} onChange={(e) => setZip(e.target.value)} placeholder="ZIP" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Project notes</Label>
                  <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What are you looking to do? Any details help." />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3) Preferred times (optional)</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="text-sm text-muted-foreground">
                  Drop 1–3 options (example: “Tue 2–4pm”, “Fri morning”).
                </div>
                <Input value={time1} onChange={(e) => setTime1(e.target.value)} placeholder="Option 1" />
                <Input value={time2} onChange={(e) => setTime2(e.target.value)} placeholder="Option 2" />
                <Input value={time3} onChange={(e) => setTime3(e.target.value)} placeholder="Option 3" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4) Your contact info</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(###) ###-####" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Preferred contact</Label>
                  <Select value={preferredContact} onValueChange={setPreferredContact}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Phone call</SelectItem>
                      <SelectItem value="text">Text message</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && <div className="text-sm text-destructive">{error}</div>}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={submit} disabled={loading}>
                    {loading ? "Submitting…" : "Submit request"}
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="tel:14802961441">Or call 480-296-1441</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
