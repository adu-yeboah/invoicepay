"use client";
import Link from "next/link";
import {
  FileText,
  Send,
  CheckCircle,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Footer from "@/components/footer";

/* ── data ── */
const features = [
  {
    icon: FileText,
    n: "01",
    title: "Professional Invoices",
    desc: "Beautiful, brandable invoices built in seconds — not hours. Looks like it took a designer days.",
  },
  {
    icon: Send,
    n: "02",
    title: "Send & Track Payments",
    desc: "Email directly to clients. Know the exact moment they view or pay. No more excuses.",
  },
  {
    icon: CheckCircle,
    n: "03",
    title: "Get Paid Faster",
    desc: "Card & mobile money via Paystack. Instant payment notifications.",
  },
  {
    icon: BarChart3,
    n: "04",
    title: "Client Manager",
    desc: "All contacts, history, and balances in one clean place.",
  },
  {
    icon: Shield,
    n: "05",
    title: "Bank-Grade Security",
    desc: "Encrypted channels. Your data and money, fully protected.",
  },
  {
    icon: Zap,
    n: "06",
    title: "Save Time",
    desc: "Recurring invoices, auto-reminders. Work on business, not admin.",
  },
];

const steps = [
  {
    n: "01",
    title: "Build your invoice",
    body: "Fill in client details, line items, and tax. Done in under 2 minutes.",
  },
  {
    n: "02",
    title: "Send the link",
    body: "Share via email, WhatsApp, or any channel. No app required for clients.",
  },
  {
    n: "03",
    title: "Watch money arrive",
    body: "Clients pay by card or MoMo. Funds clear directly to your account.",
  },
];



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

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />


      {/* ── FEATURES ── */}
      <section id="features" className="relative py-28 md:py-36 px-6 md:px-16">
        {/* background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl m-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16">
            <div>
              <h2 className="ff-display text-[clamp(2rem,4vw,3.4rem)] font-black leading-[1.05] tracking-[-0.03em]">
                Everything you need
                <br />
                <span className="text-muted-foreground/50">to get paid.</span>
              </h2>
            </div>
            <p className="text-[15px] text-muted-foreground leading-[1.8] max-w-md lg:self-end">
              Six tools, one platform. Built around the way Ghanaian
              freelancers and SMEs actually work.
            </p>
          </div>

          {/* asymmetric magazine grid */}
          <div className="grid grid-cols-12 gap-4">
            {/* 01 — large */}
            <div className="col-span-12 md:col-span-5 group relative rounded-2xl bg-card/60 border border-border/40 p-8 overflow-hidden hover:border-primary/30 hover:bg-card/80 transition-all duration-300 cursor-default">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="ff-display absolute top-4 right-6 text-[5rem] font-black text-primary/[0.06] leading-none select-none">
                01
              </span>
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors duration-300">
                  <FileText size={18} className="text-primary" />
                </div>
                <h3 className="ff-display text-[1.35rem] font-bold mb-3">
                  Professional Invoices
                </h3>
                <p className="text-[13px] text-muted-foreground/70 leading-[1.75]">
                  {features[0].desc}
                </p>
              </div>
            </div>

            {/* 02 — wide */}
            <div className="col-span-12 md:col-span-7 group relative rounded-2xl bg-card/40 border border-border/40 p-8 overflow-hidden hover:border-primary/30 hover:bg-card/60 transition-all duration-300 cursor-default">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="ff-display absolute top-4 right-6 text-[5rem] font-black text-primary/[0.06] leading-none select-none">
                02
              </span>
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors duration-300">
                  <Send size={18} className="text-primary" />
                </div>
                <h3 className="ff-display text-[1.35rem] font-bold mb-3">
                  Send & Track Payments
                </h3>
                <p className="text-[13px] text-muted-foreground/70 leading-[1.75] max-w-[420px]">
                  {features[1].desc}
                </p>
              </div>
            </div>

            {/* 03–06 small */}
            {features.slice(2).map((f, i) => (
              <div
                key={i}
                className="col-span-12 sm:col-span-6 md:col-span-3 group relative rounded-2xl bg-card/40 border border-border/40 p-6 overflow-hidden hover:border-primary/30 hover:bg-card/60 transition-all duration-300 cursor-default"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="ff-display absolute top-2 right-3 text-[3rem] font-black text-primary/[0.06] leading-none select-none">
                  {f.n}
                </span>
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors duration-300">
                    <f.icon size={16} className="text-primary" />
                  </div>
                  <h3 className="ff-display text-[0.95rem] font-bold mb-2">
                    {f.title}
                  </h3>
                  <p className="text-[12px] text-muted-foreground/70 leading-[1.7]">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        className="relative py-28 md:py-36 px-6 md:px-16 border-t border-border/30"
      >
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-end mb-16">
            <h2 className="ff-display text-[clamp(2rem,3.5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em]">
              Three steps.
              <br />
              <span className="text-muted-foreground/40">That&apos;s it.</span>
            </h2>
            <p className="text-[15px] text-muted-foreground leading-[1.8] max-w-md lg:self-end">
              From blank page to paid invoice — in minutes, not days.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={i}
                className="group relative py-10 px-8 border-l border-border/40 hover:border-primary/40 transition-colors duration-300"
              >
                {/* connector arrow */}
                {i < 2 && (
                  <div className="hidden md:flex absolute top-12 -right-3 z-10 text-border/50 group-hover:text-primary/40 transition-colors duration-300">
                    <ArrowRight size={18} />
                  </div>
                )}

                {/* step number circle */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300">
                    <span className="ff-display text-[0.85rem] font-black text-primary">
                      {step.n}
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-border/40 to-transparent" />
                </div>

                <h3 className="ff-display text-[1.2rem] font-bold mb-3">
                  {step.title}
                </h3>
                <p className="text-[13px] text-muted-foreground/70 leading-[1.75]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── CTA BAND ── */}
      <section className="relative overflow-hidden">
        {/* gradient background */}
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-light to-primary" />

        {/* decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/[0.06] rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/[0.08] rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />

        <div className="relative py-20 md:py-28 px-6 md:px-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <h2 className="ff-display text-[clamp(2rem,4vw,3.2rem)] font-black text-primary-foreground tracking-[-0.03em] leading-[1.05] mb-4">
                Ready to get paid faster?
              </h2>
              <p className="text-[15px] text-primary-foreground/70 max-w-md leading-[1.75]">
                Join thousands of Ghanaian businesses who trust InvoicePay to
                handle their invoicing and payments.
              </p>
            </div>
            <div className="flex flex-col gap-3 items-start lg:items-end">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2.5 bg-foreground text-background font-bold text-[15px] rounded-xl px-8 py-4 no-underline hover:bg-foreground/90 transition-all duration-200 whitespace-nowrap shadow-xl shadow-black/20"
              >
                Start Your Free Trial
                <ArrowUpRight
                  size={15}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                />
              </Link>
              <p className="text-[12px] text-primary-foreground/50">
                No credit card required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
}