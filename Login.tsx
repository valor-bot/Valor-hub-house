import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // If already logged in, go to dashboard
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/dashboard");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/dashboard");
    });

    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSent(false);
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/dashboard",
      },
    });

    setLoading(false);

    if (error) setErrorMsg(error.message);
    else setSent(true);
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-accent rounded-xl mb-4">
            <span className="text-accent-foreground font-bold text-xl">V</span>
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground">Valor Home</h1>
          <p className="text-primary-foreground/80 mt-2">Field Service Management</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>We’ll email you a one-time sign-in link.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading || !email}>
                {loading ? "Sending…" : "Send magic link"}
              </Button>

              {sent && (
                <p className="text-sm text-green-700">
                  ✅ Link sent. Check your email and tap the sign-in link.
                </p>
              )}

              {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
