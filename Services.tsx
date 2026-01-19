import { Link } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceCards = [
  {
    title: "Cabinet Painting",
    desc: "Clean, durable finishes with pro prep (degrease, sand, prime, spray/roll).",
  },
  {
    title: "Flooring",
    desc: "LVP/laminate installs, baseboards, transitions, and clean finish details.",
  },
  {
    title: "Drywall / Repairs",
    desc: "Patches, texture match, dents/holes, and clean paint blending.",
  },
  {
    title: "Trim & Finish Work",
    desc: "Baseboards, casing, crown, doors, and punch-list improvements.",
  },
  {
    title: "Interior Paint",
    desc: "Walls, ceilings, accent walls, and clean cut lines with protection.",
  },
  {
    title: "Exterior Paint",
    desc: "Prep-first exterior painting for long-lasting curb appeal.",
  },
  {
    title: "Handyman / Refresh",
    desc: "Small fixes, upgrades, and refresh projects to make your home feel new.",
  },
];

export default function Services() {
  return (
    <PublicLayout>
      <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground mt-2">
            Veteran-owned Arizona home improvement — quality work, clear communication.
          </p>
        </div>
        <Button asChild>
          <Link to="/request-estimate">Get a Free Estimate</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {serviceCards.map((s) => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle className="text-lg">{s.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{s.desc}</p>
              <Button asChild variant="outline" className="w-full">
                <Link to={`/request-estimate?service=${encodeURIComponent(s.title)}`}>Request quote</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PublicLayout>
  );
}
