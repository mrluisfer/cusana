import { ServiceIcon } from "@/components/dashboard/service-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { realServiceKeys } from "@/constants/icons";

export default function LabsPage() {
  return (
    <div className="container mx-auto mt-6 min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Pagina de experimentos para probar cosas</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeToggle variant="outline" />

          <div>
            <ul className="motion-safe:animate-marquee mt-2 flex flex-wrap items-center gap-4 motion-safe:group-hover:[animation-play-state:paused]">
              {[...realServiceKeys].map((service, i) => (
                <li
                  key={`${service}-${i}`}
                  aria-hidden={i >= realServiceKeys.length ? "true" : undefined}
                >
                  <ServiceIcon
                    service={service}
                    className="ring-border/50 shadow-sm ring-1 transition-transform hover:-translate-y-0.5 hover:scale-110"
                  />
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
