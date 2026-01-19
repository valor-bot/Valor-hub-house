import PublicLayout from "@/components/layout/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Placeholder gallery data...and allow you to swap in real photos later.
const placeholders = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  title: `Project ${i + 1}`,
  label: "Before / After",
}));

export default function Gallery() {
  return (
    <PublicLayout>
      <h1 className="text-3xl font-bold">Gallery</h1>
      <p className="text-muted-foreground mt-2">
        A few examples of the kinds of work we do. (Placeholders for now — you can add your real photos anytime.)
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {placeholders.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">{p.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                  Before
                </div>
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                  After
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{p.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PublicLayout>
  );
}
