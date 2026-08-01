import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import React from "react";

function SectionLabel({
  children,
  center = false,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 mb-5 ${center ? "justify-center" : ""}`}
    >
      <span className="w-10 h-px bg-primary shrink-0" />
      <span className="text-[11px] tracking-[0.18em] font-semibold text-primary">
        {children}
      </span>
      {center && <span className="w-10 h-px bg-primary shrink-0" />}
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* decorative primary glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/[0.07] rounded-full blur-[120px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[100px] -z-10 pointer-events-none -translate-x-1/4 translate-y-1/4" />
      {/* subtle grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-2 max-w-7xl mx-auto w-full px-6 md:px-16 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* ── left ── */}
          <div>

            <h1 className="ff-display text-[clamp(2.8rem,5.5vw,5rem)] font-black leading-none tracking-[-0.03em] text-foreground mb-7">
              Get paid.
              <br />
              <em className="not-italic text-primary">On time.</em>
              <br />
              Every time.
            </h1>

            <p className="text-[15px] leading-[1.8] text-muted-foreground max-w-md mb-10">
              Create professional invoices, accept card and mobile money via
              Paystack, and watch cash flow in — without the spreadsheet chaos.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-[15px] rounded-xl px-7 py-3.5 no-underline shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 transition-all duration-200"
              >
                Start Free Trial
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-0.5 transition-transform duration-200"
                />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 bg-transparent text-foreground/60 border border-border/60 rounded-xl px-6 py-3.5 text-[15px] font-medium no-underline hover:border-border hover:text-foreground hover:bg-muted/30 transition-all duration-200"
              >
                See how it works
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {["No credit card required", "14-day free trial", "Cancel anytime"].map(
                (t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <Check
                      size={12}
                      className="text-primary/60 shrink-0"
                      strokeWidth={3}
                    />
                    <span className="text-[11px] text-muted-foreground/50 tracking-wide">
                      {t}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* ── right — mock invoice card ── */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[370px] bg-card rounded-2xl p-7 shadow-2xl shadow-black/[0.08] dark:shadow-black/30 border border-border/60 hover:-translate-y-1 transition-transform duration-500">
              {/* header */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className="text-[10px] tracking-[0.12em] text-muted-foreground mb-1">
                    INVOICE
                  </p>
                  <p className="ff-display text-[20px] font-bold text-foreground">
                    #INV-0042
                  </p>
                </div>
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full px-3 py-1 border border-emerald-500/20 tracking-wide">
                  PAID
                </span>
              </div>

              {/* billed to */}
              <div className="bg-primary/5 rounded-xl px-4 py-3 mb-4 border border-primary/5">
                <p className="text-[10px] text-muted-foreground mb-1">Billed to</p>
                <p className="font-semibold text-[13px] text-foreground">
                  Kojo Mensah &amp; Co.
                </p>
                <p className="text-[11px] text-primary">kojo@mensahco.gh</p>
              </div>

              {/* line items */}
              <div className="divide-y divide-border/50">
                {[
                  ["Website Redesign", "GHS 2,400"],
                  ["Monthly Retainer", "GHS 800"],
                  ["Domain Renewal", "GHS 120"],
                ].map(([item, amt]) => (
                  <div
                    key={item}
                    className="flex justify-between py-2.5 text-[12px]"
                  >
                    <span className="text-foreground/80">{item}</span>
                    <span className="font-semibold text-foreground tabular-nums">
                      {amt}
                    </span>
                  </div>
                ))}
              </div>

              {/* total */}
              <div className="flex justify-between mt-4 px-4 py-3 bg-foreground rounded-xl">
                <span className="text-[12px] text-background/55 font-medium">
                  Total Due
                </span>
                <span className="ff-display text-[16px] font-bold text-primary">
                  GHS 3,320
                </span>
              </div>

              {/* pay button */}
              <div className="mt-3 bg-primary rounded-xl py-2.5 text-center text-[12px] font-bold text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors duration-200 shadow-sm shadow-primary/15">
                Pay with Card or MoMo ↗
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}