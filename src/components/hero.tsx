import Link from "next/link";
import { ArrowRight, Handshake, Globe, Shield, Gift } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground">
            <Handshake className="h-3.5 w-3.5" />
            Collaborative hotel negotiation co-pilot
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Negotiate on your terms with an
            <span className="text-primary"> AI co-pilot</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            You shape the strategy — amenities, credits, flexible terms, and optional rate adjustments. The co-pilot
            executes only what you approve, so you stay aligned and in control.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/trip/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Plan a trip
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              View demo trips
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const features = [
    {
      icon: Handshake,
      title: "You set the brief",
      description:
        "Choose priorities, leverage points, and approved talking points. Nothing is improvised without your consent.",
    },
    {
      icon: Gift,
      title: "Value-add packages",
      description:
        "Negotiate for breakfast, parking, late check-out, and resort credits — not just base rate cuts.",
    },
    {
      icon: Globe,
      title: "Global coverage",
      description: "Search and negotiate with hotels across 6 major cities worldwide, with more being added.",
    },
    {
      icon: Shield,
      title: "Transparent & ethical",
      description:
        "No social engineering or false claims. Review a clear summary of what was agreed — not a raw call transcript.",
    },
  ];

  return (
    <section className="border-t bg-muted/50">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
          <p className="mt-4 text-muted-foreground">Three steps — you stay in the driver&apos;s seat</p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-lg border bg-background p-6">
              <feature.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {[
            { step: "1", title: "Plan your trip", desc: "Destination, dates, budget, and hotel preferences." },
            {
              step: "2",
              title: "Configure your brief",
              desc: "Set priorities, leverage points, and consent to the exact talking points.",
            },
            {
              step: "3",
              title: "Review & approve",
              desc: "Compare secured perk packages and pick the best mutual-value option.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {item.step}
              </div>
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
