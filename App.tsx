import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/lib/supabase";

import PublicHome from "@/pages/PublicHome";
import Services from "@/pages/Services";
import Gallery from "@/pages/Gallery";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import RequestEstimate from "@/pages/RequestEstimate";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import Jobs from "@/pages/Jobs";
import JobDetail from "@/pages/JobDetail";
import CalendarPage from "@/pages/CalendarPage";
import Estimates from "@/pages/Estimates";
import Invoices from "@/pages/Invoices";
import Settings from "@/pages/Settings";
import Leads from "@/pages/Leads";
import LeadDetail from "@/pages/LeadDetail";
import NotFound from "@/pages/NotFound";

type AuthState = {
  loading: boolean;
  isAuthed: boolean;
  email?: string;
  isAdmin?: boolean;
};

function useAuthState(): AuthState {
  const [state, setState] = useState<AuthState>({ loading: true, isAuthed: false, isAdmin: false });

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      const email = data.session?.user?.email;
      if (!data.session) {
        setState({ loading: false, isAuthed: false, isAdmin: false });
        return;
      }

      // Check admin allowlist (best-effort). If table/policy isn't set up yet,
      // we'll still allow access so you don't get locked out during setup.
      let isAdmin = true;
      try {
        const { data: adminRow, error } = await supabase
          .from('admins')
          .select('email')
          .eq('email', email || '')
          .maybeSingle();
        if (!error) isAdmin = !!adminRow;
      } catch {
        // ignore
      }

      setState({ loading: false, isAuthed: true, email: email || undefined, isAdmin });
    };

    hydrate();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const email = session?.user?.email;
      if (!session) {
        setState({ loading: false, isAuthed: false, isAdmin: false });
        return;
      }

      let isAdmin = true;
      try {
        const { data: adminRow, error } = await supabase
          .from('admins')
          .select('email')
          .eq('email', email || '')
          .maybeSingle();
        if (!error) isAdmin = !!adminRow;
      } catch {
        // ignore
      }

      setState({ loading: false, isAuthed: true, email: email || undefined, isAdmin });
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuthState();

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!auth.isAuthed) return <Navigate to="/admin/login" replace />;
  if (auth.isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-2">
          <div className="text-xl font-semibold">Access denied</div>
          <div className="text-sm text-muted-foreground">
            Your email ({auth.email}) is not in the admin allowlist. Add it to the <code>admins</code> table in Supabase.
          </div>
          <div>
            <a className="underline" href="/admin/login">Back to login</a>
          </div>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

const App = () => {
  const queryClient = useMemo(() => new QueryClient(), []);

  // Warm up session retrieval on first load.
  useEffect(() => {
    supabase.auth.getSession();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Public marketing site */}
            <Route path="/" element={<PublicHome />} />
            <Route path="/services" element={<Services />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/request-estimate" element={<RequestEstimate />} />

            {/* Admin auth */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<Login />} />

            {/* Internal app (protected) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoute>
                  <Clients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <Jobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/:id"
              element={
                <ProtectedRoute>
                  <JobDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <CalendarPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/estimates"
              element={
                <ProtectedRoute>
                  <Estimates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices"
              element={
                <ProtectedRoute>
                  <Invoices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Leads (Supabase-backed) */}
            <Route
              path="/leads"
              element={
                <ProtectedRoute>
                  <Leads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads/:id"
              element={
                <ProtectedRoute>
                  <LeadDetail />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
