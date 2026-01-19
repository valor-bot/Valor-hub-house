import { Link } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <PublicLayout>
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Want a free estimate? The fastest way is to submit the request form. You can also call or email anytime.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Get in touch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Phone: </span>
              <a className="underline" href="tel:14802961441">480-296-1441</a>
            </div>
            <div>
              <span className="text-muted-foreground">Email: </span>
              <a className="underline" href="mailto:chase@valorhomeaz.com">chase@valorhomeaz.com</a>
            </div>
            <div className="text-muted-foreground">
              Hours: Mon–Fri 8am–6pm • Sat 10am–2pm • Sun closed
            </div>
            <div className="pt-2">
              <Button asChild>
                <Link to="/request-estimate">Get a Free Estimate</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Service area</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <div>Based in Arizona. Let us know your city/ZIP and we’ll confirm availability.</div>
            <div>
              Tip: If you have photos of the project, include them in the estimate request to speed things up.
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
