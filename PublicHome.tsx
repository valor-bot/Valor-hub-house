import { Link } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  "Cabinet Painting",
  "Flooring",
  "Drywall/Repairs",
  "Trim & Finish Work",
  "Interior Paint",
  "Exterior Paint",
  "Handyman/Refresh",
];

export default function PublicHome() {
  return (
    <PublicLayout>
      <div className="grid gap-10 lg:grid-cols-2 items-start">
        <div className="space-y-5">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Home improvements done right — without the runaround.
          </h1>
          <p className="text-lg text-muted-foreground">
            Veteran-owned Arizona home improvement. From small repairs to full refreshes — cabinet painting,
            flooring, drywall, trim, interior & exterior paint.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg">
              <Link to="/request-estimate">Get a Free Estimate</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/services">View Services</Link>
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Prefer to talk? Call <a className="underline" href="tel:14802961441">480-296-1441</a>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Popular services</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2">
              {services.map((s) => (
                <li key={s} className="text-sm text-muted-foreground">
                  • <span className="text-foreground">{s}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button asChild className="w-full">
                <Link to="/request-estimate">Request a quote</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Clear communication</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            You get a straight answer, a clear plan, and updates as we go.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quality workmanship</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Prep, protection, and attention to detail — the stuff that makes it last.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Giving back</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Veteran-owned and proud to support local causes and community donations.
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
