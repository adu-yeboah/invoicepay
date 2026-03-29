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

/* ── data  */
const features = [
  {
    icon: FileText,
    n: "01",
    title: "Professional Invoices",
    desc: "Beautiful, brandable invoices built in seconds — not hours.",
  },
  {
    icon: Send,
    n: "02",
    title: "Send & Track",
    desc: "Email directly to clients. Know the moment they view or pay.",
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

const stats = [
  { val: "10K+", sub: "Active Businesses" },
  { val: "GHS 5M+", sub: "Processed Monthly" },
  { val: "98%", sub: "Satisfaction Rate" },
  { val: "< 2 min", sub: "To First Invoice" },
];

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
    <>
      <div className=" min-h-screen overflow-x- bg-background text-[#f5f0e8]">
        {/* Navbar  */}
        <Navbar />

        {/*  HERO  */}
        <Hero />

        {/*  STATS  */}
        <section className="bg-[#080706] border-y border-[#f5f0e8]/5">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={i}
                className={`text-center py-10 px-6 ${i < 3 ? "border-r border-[#f5f0e8]/6" : ""}`}
              >
                <p className="ff-display text-[clamp(1.8rem,3vw,2.8rem)] font-black text-primary tracking-tight leading-none">
                  {s.val}
                </p>
                <p className="text-[11px] text-[#f5f0e8]/30 mt-2 tracking-widest uppercase">
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/*  FEATURES  */}
        <section
          id="features"
          className="py-28 md:py-36 px-6 md:px-16 bg-[#0e0c09]"
        >
          <div className="max-w-7xl m-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16">
              <div>
                <SectionLabel>FEATURES</SectionLabel>
                <h2 className="ff-display text-[clamp(2rem,4vw,3.4rem)] font-black leading-[1.05] tracking-[-0.03em] text-[#f5f0e8]">
                  Everything you need
                  <br />
                  <span className="text-[#f5f0e8]/22">to get paid.</span>
                </h2>
              </div>
              <p className="text-[15px] text-[#f5f0e8]/40 leading-[1.8] max-w-100 lg:self-end">
                Six tools, one platform. Built around the way Ghanaian
                freelancers and SMEs actually work.
              </p>
            </div>

            {/* asymmetric magazine grid */}
            <div className="grid grid-cols-12 gap-4">
              {/* 01 — large */}
              <div className="col-span-12 md:col-span-5 relative rounded-2xl bg-[#080706] border border-[#f5f0e8]/6 p-8 overflow-hidden hover:-translate-y-1 transition-transform cursor-default">
                <span className="ff-display absolute top-4 right-6 text-[5rem] font-black text-primary/10 leading-none select-none">
                  01
                </span>
                <div className="w-10 h-10 rounded-xl bg-primary/12 border border-primary/20 flex items-center justify-center mb-6">
                  <FileText size={18} color="#6c63ff" />
                </div>
                <h3 className="ff-display text-[1.35rem] font-bold text-[#f5f0e8] mb-3">
                  Professional Invoices
                </h3>
                <p className="text-[13px] text-[#f5f0e8]/38 leading-[1.75]">
                  Beautiful, brandable invoices built in seconds — not hours.
                  Looks like it took a designer days.
                </p>
              </div>

              {/* 02 — wide */}
              <div className="col-span-12 md:col-span-7 relative rounded-2xl bg-[#0a0907] border border-[#f5f0e8]/[0.06] p-8 overflow-hidden hover:-translate-y-1 transition-transform cursor-default">
                <span className="ff-display absolute top-4 right-6 text-[5rem] font-black text-primary/10 leading-none select-none">
                  02
                </span>
                <div className="w-10 h-10 rounded-xl bg-primary/12 border border-primary/20 flex items-center justify-center mb-6">
                  <Send size={18} color="#6c63ff" />
                </div>
                <h3 className="ff-display text-[1.35rem] font-bold text-[#f5f0e8] mb-3">
                  Send & Track Payments
                </h3>
                <p className="text-[13px] text-[#f5f0e8]/38 leading-[1.75] max-w-[420px]">
                  Email directly to clients. Know the exact moment they view or
                  pay. No more "I never got it" from clients.
                </p>
              </div>

              {/* 03–06 small */}
              {features.slice(2).map((f, i) => (
                <div
                  key={i}
                  className="col-span-12 sm:col-span-6 md:col-span-3 relative rounded-2xl bg-[#080706] border border-[#f5f0e8]/[0.06] p-6 overflow-hidden hover:-translate-y-1 transition-transform cursor-default"
                >
                  <span className="ff-display absolute top-2 right-3 text-[3rem] font-black text-primary/10 leading-none select-none">
                    {f.n}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/18 flex items-center justify-center mb-5">
                    <f.icon size={16} color="#6c63ff" />
                  </div>
                  <h3 className="ff-display text-[0.95rem] font-bold text-[#f5f0e8] mb-2">
                    {f.title}
                  </h3>
                  <p className="text-[12px] text-[#f5f0e8]/36 leading-[1.7]">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS  */}
        <section
          id="how-it-works"
          className="py-28 md:py-36 px-6 md:px-16 bg-[#080706] border-t border-[#f5f0e8]/5"
        >
          <div className="max-w-7xl mx-auto">
            <SectionLabel>HOW IT WORKS</SectionLabel>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-end mb-16">
              <h2 className="ff-display text-[clamp(2rem,3.5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em] text-[#f5f0e8]">
                Three steps.
                <br />
                <span className="text-[#f5f0e8]/20">That's it.</span>
              </h2>
              <p className="text-[15px] text-[#f5f0e8]/38 leading-[1.8] max-w-100 lg:self-end">
                From blank page to paid invoice — in minutes, not days.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="relative py-10 px-8 border-l border-[#f5f0e8]/[0.07]"
                >
                  {i < 2 && (
                    <div className="hidden md:flex absolute top-10 -right-3 z-10">
                      <ArrowRight size={18} color="#6c63ff" opacity={0.3} />
                    </div>
                  )}
                  <p className="ff-display text-[4.5rem] font-black text-primary/12 leading-none mb-6">
                    {step.n}
                  </p>
                  <h3 className="ff-display text-[1.2rem] font-bold text-[#f5f0e8] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-[#f5f0e8]/38 leading-[1.75]">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*  PRICING  */}
        <section
          id="pricing"
          className="py-28 md:py-36 px-6 md:px-16 bg-[#0e0c09] border-t border-[#f5f0e8]/5"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <SectionLabel center>PRICING</SectionLabel>
              <h2 className="ff-display text-[clamp(2rem,4vw,3.2rem)] font-black tracking-[-0.03em] text-[#f5f0e8] mb-4">
                Simple, transparent pricing.
              </h2>
              <p className="text-[15px] text-[#f5f0e8]/38 max-w-90 mx-auto leading-[1.75]">
                Choose the plan that fits your business. All plans include core
                features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-240 mx-auto items-start">
              {plans.map((plan, i) => (
                <div
                  key={i}
                  className={`relative rounded-2xl p-8 ${
                    i === 1
                      ? "bg-[#080706] border border-primary/20 shadow-[0_24px_80px_rgba(14,12,9,0.6)] -translate-y-3"
                      : "bg-[#0a0907] border border-[#f5f0e8]/[0.07]"
                  }`}
                >
                  {plan.tag && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-[#0e0c09] text-[10px] font-bold tracking-[0.08em] px-4 py-1.5 rounded-full whitespace-nowrap">
                      {plan.tag.toUpperCase()}
                    </div>
                  )}

                  <p className="ff-display text-[1.1rem] font-bold text-[#f5f0e8] mb-2">
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1 mb-7">
                    <span
                      className={`ff-display text-[2.4rem] font-black tracking-[-0.04em] ${i === 1 ? "text-primary" : "text-[#f5f0e8]"}`}
                    >
                      {plan.price}
                    </span>
                    {plan.per && (
                      <span className="text-[13px] text-[#f5f0e8]/30">
                        {plan.per}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 list-none p-0">
                    {plan.perks.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2.5 text-[13px] text-[#f5f0e8]/48"
                      >
                        <CheckCircle
                          size={13}
                          color="#6c63ff"
                          className="mt-0.5 shrink-0"
                        />
                        {p}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.href}
                    className={`block text-center rounded-xl py-3 text-[13px] font-semibold no-underline transition-colors ${
                      i === 1
                        ? "bg-primary text-[#0e0c09] hover:bg-primary"
                        : "bg-transparent text-[#f5f0e8]/55 border border-[#f5f0e8]/14 hover:border-[#f5f0e8]/28"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*  CTA BAND  */}
        <section className="bg-primary/50 py-20 md:py-28 px-6 md:px-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <h2 className="ff-display text-[clamp(2rem,4vw,3.2rem)] font-black text-[#0e0c09] tracking-[-0.03em] leading-[1.05] mb-4">
                Ready to get paid faster?
              </h2>
              <p className="text-[15px] text-[#0e0c09]/58 max-w-105 leading-[1.75]">
                Join thousands of Ghanaian businesses who trust InvoicePay to
                handle their invoicing and payments.
              </p>
            </div>
            <div className="flex flex-col gap-3 items-start lg:items-end">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-[#0e0c09] text-[#f5f0e8] font-bold text-[15px] rounded-xl px-8 py-4 no-underline hover:bg-[#1a1610] transition-colors whitespace-nowrap"
              >
                Start Your Free Trial <ArrowUpRight size={15} />
              </Link>
              <p className="text-[12px] text-[#0e0c09]/40">
                No credit card required
              </p>
            </div>
          </div>
        </section>

        {/*  FOOTER  */}
        <footer className="bg-[#080706] border-t border-[#6c63ff]/5 px-6 md:px-16 pt-16 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1.5fr] gap-10 mb-14">
              <div>
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="ff-display text-[17px] font-bold text-[#f5f0e8]">
                    InvoicePay
                  </span>
                </div>
                <p className="text-[13px] text-[#f5f0e8]/28 leading-[1.75] max-w-62.5">
                  Simple invoicing for Ghanaian businesses. Get paid faster with
                  professional invoices and secure payments.
                </p>
              </div>

              {[
                {
                  heading: "Product",
                  links: [
                    ["Features", "#features"],
                    ["Pricing", "#pricing"],
                    ["How It Works", "#how-it-works"],
                  ],
                },
                {
                  heading: "Company",
                  links: [
                    ["About", "/about"],
                    ["Blog", "/blog"],
                    ["Careers", "/careers"],
                  ],
                },
              ].map((col) => (
                <div key={col.heading}>
                  <h4 className="text-[10px] font-bold tracking-[0.12em] text-[#f5f0e8]/20 uppercase mb-5">
                    {col.heading}
                  </h4>
                  <ul className="space-y-3 list-none p-0 m-0">
                    {col.links.map(([l, h]) => (
                      <li key={l}>
                        <Link
                          href={h}
                          className="text-[13px] text-[#f5f0e8]/38 hover:text-[#f5f0e8]/75 transition-colors no-underline"
                        >
                          {l}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div>
                <h4 className="text-[10px] font-bold tracking-[0.12em] text-[#f5f0e8]/20 uppercase mb-5">
                  Contact
                </h4>
                <ul className="space-y-3.5 list-none p-0 m-0">
                  {[
                    {
                      Icon: Mail,
                      text: "hello@invoicepay.gh",
                      href: "mailto:hello@invoicepay.gh",
                    },
                    {
                      Icon: Phone,
                      text: "+233 XX XXX XXXX",
                      href: "tel:+233XXXXXXXXX",
                    },
                    { Icon: MapPin, text: "Accra, Ghana", href: "#" },
                  ].map(({ Icon, text, href }) => (
                    <li key={text} className="flex items-center gap-2.5">
                      <Icon size={13} color="#6c63ff" />
                      <Link
                        href={href}
                        className="text-[13px] text-[#f5f0e8]/38 hover:text-[#f5f0e8]/75 transition-colors no-underline"
                      >
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-[#f5f0e8]/6 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-[12px] text-[#f5f0e8]/18">
                © {new Date().getFullYear()} InvoicePay. All rights reserved.
              </p>
              <div className="flex gap-6">
                {[
                  ["Privacy Policy", "/privacy"],
                  ["Terms of Service", "/terms"],
                ].map(([l, h]) => (
                  <Link
                    key={l}
                    href={h}
                    className="text-[12px] text-[#f5f0e8]/24 hover:text-[#f5f0e8]/55 transition-colors no-underline"
                  >
                    {l}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
