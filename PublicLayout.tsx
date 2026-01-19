import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-lg">V</span>
            </div>
            <div className="leading-tight">
              <div className="font-extrabold">Valor Home Improvement</div>
              <div className="text-xs text-muted-foreground">Veteran-owned • Arizona</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {nav.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild className="hidden sm:inline-flex">
              <Link to="/request-estimate">Get a Free Estimate</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="tel:14802961441">Call</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <span className="font-medium text-foreground">Hours:</span> Mon–Fri 8am–6pm • Sat 10am–2pm • Sun closed
            </div>
            <div className="flex items-center gap-4">
              <a className="hover:underline" href="tel:14802961441">
                480-296-1441
              </a>
              <a className="hover:underline" href="mailto:chase@valorhomeaz.com">
                chase@valorhomeaz.com
              </a>
            </div>
          </div>
          <div>© {new Date().getFullYear()} Valor Home Improvement • Veteran-owned • Giving back to the community</div>
          <div>
            <Link to="/admin/login" className="hover:underline">
              Admin login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
