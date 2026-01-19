import PublicLayout from "@/components/layout/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <PublicLayout>
      <h1 className="text-3xl font-bold">About Valor</h1>
      <p className="text-muted-foreground mt-2 max-w-3xl">
        Valor Home Improvement is a veteran-owned business serving Arizona homeowners with honest communication and
        craftsmanship you can count on. We focus on the details that make a project last — prep, protection, and a clean
        finish.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Veteran-owned</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Built on integrity, punctuality, and pride in workmanship.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quality-first</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            We don’t rush prep. We protect your home and deliver a finish that holds up.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Giving back</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            We support local causes and community donations whenever we can.
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
