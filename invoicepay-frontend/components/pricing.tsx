import { CheckCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      per: "",
      tag: null,
      cta: "Get Started",
      href: "/signup",
      perks: [
        "5 invoices / month",
        "10 clients",
        "Basic templates",
        "Paystack payments",
      ],
    },
    {
      name: "Pro",
      price: "GHS 50",
      per: "/mo",
      tag: "Most Popular",
      cta: "Start Free Trial",
      href: "/signup",
      perks: [
        "Unlimited invoices",
        "Unlimited clients",
        "Custom templates",
        "Payment reminders",
        "Reports & analytics",
      ],
    },
    {
      name: "Enterprise",
      price: "GHS 150",
      per: "/mo",
      tag: null,
      cta: "Contact Sales",
      href: "/signup",
      perks: [
        "Everything in Pro",
        "Team members",
        "API access",
        "Priority support",
        "Custom integrations",
      ],
    },
  ];

  return (
    <>
      {/* ── PRICING ── */}
      <section
        id="pricing"
        className="relative py-28 md:py-36 px-6 md:px-16 border-t border-border/30"
      >
        {/* background glow behind featured card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="ff-display text-[clamp(2rem,4vw,3.2rem)] font-black tracking-[-0.03em] mb-4">
              Simple, transparent pricing.
            </h2>
            <p className="text-[15px] text-muted-foreground max-w-md mx-auto leading-[1.75]">
              Choose the plan that fits your business. All plans include core
              features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto items-start">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  i === 1
                    ? "bg-card border-2 border-primary/30 shadow-[0_0_60px_-12px_rgba(255,87,51,0.15)] md:-translate-y-4"
                    : "bg-card/60 border border-border/40 hover:border-border/70"
                }`}
              >
                {plan.tag && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold tracking-[0.08em] px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg shadow-primary/20">
                    {plan.tag.toUpperCase()}
                  </div>
                )}

                <p className="ff-display text-[1.1rem] font-bold mb-2">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1 mb-7">
                  <span
                    className={`ff-display text-[2.4rem] font-black tracking-[-0.04em] ${
                      i === 1 ? "text-primary" : ""
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.per && (
                    <span className="text-[13px] text-muted-foreground">
                      {plan.per}
                    </span>
                  )}
                </div>

                <ul className="space-y-3.5 mb-8 list-none p-0">
                  {plan.perks.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2.5 text-[13px] text-muted-foreground"
                    >
                      <CheckCircle
                        size={14}
                        className={`mt-0.5 shrink-0 ${
                          i === 1 ? "text-primary" : "text-primary/60"
                        }`}
                      />
                      {p}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block text-center rounded-xl py-3.5 text-[13px] font-semibold no-underline transition-all duration-200 ${
                    i === 1
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30"
                      : "bg-transparent text-foreground/60 border border-border/50 hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
