import { ArrowRight } from "lucide-react";
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
    <section className="hero-diagonal relative min-h-[92vh] flex items-center overflow-hidden">
      {/* ₵ ghost watermark */}
      <span className="ff-display pointer-events-none select-none absolute right-[-2%] top-1/2 -translate-y-1/2 text-[clamp(160px,22vw,300px)] font-black leading-none text-primary/5 z-1">
        ₵
      </span>

      <div className="relative z-2 max-w-7xl mx-auto w-full px-6 md:px-16 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* left */}
          <div>
            <SectionLabel>INVOICING FOR GHANAIAN BUSINESSES</SectionLabel>

            <h1 className="ff-display text-[clamp(2.8rem,5.5vw,5rem)] font-black leading-none tracking-[-0.03em] text-[#f5f0e8] mb-7">
              Get paid.
              <br />
              <em className="not-italic text-primary">On time.</em>
              <br />
              Every time.
            </h1>

            <p className="text-[15px] leading-[1.8] text-[#f5f0e8]/45 max-w-100 mb-10">
              Create professional invoices, accept card and mobile money via
              Paystack, and watch cash flow in — without the spreadsheet chaos.
            </p>

            <div className="flex flex-wrap gap-3 mb-5">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-primary text-[#0e0c09] font-bold text-[15px] rounded-xl px-7 py-3.5 no-underline shadow-primary/10 hover:bg-primary transition-colors"
              >
                Start Free Trial <ArrowRight size={15} />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 bg-transparent text-[#f5f0e8]/60 border border-[#f5f0e8]/15 rounded-xl px-6 py-3.5 text-[15px] font-medium no-underline hover:border-[#f5f0e8]/30 transition-colors"
              >
                See how it works
              </Link>
            </div>

            <p className="text-[11px] text-[#f5f0e8]/25 tracking-wide">
              No credit card required · 14-day free trial · Cancel anytime
            </p>
          </div>

          {/* right — mock invoice card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-92.5 bg-[#f5f0e8] rounded-2xl p-7 shadow-[0_24px_80px_rgba(14,12,9,0.55)] border border-[#e0d9cc]">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className="text-[10px] tracking-[0.12em] text-[#7a7060] mb-1">
                    INVOICE
                  </p>
                  <p className="ff-display text-[20px] font-bold text-[#0e0c09]">
                    #INV-0042
                  </p>
                </div>
                <span className="bg-emerald-500/10 text-emerald-700 text-[10px] font-bold rounded-full px-3 py-1 border border-emerald-500/20 tracking-wide">
                  PAID
                </span>
              </div>

              <div className="bg-primary/5 rounded-xl px-4 py-3 mb-4">
                <p className="text-[10px] text-[#7a7060] mb-1">Billed to</p>
                <p className="font-semibold text-[13px] text-[#0e0c09]">
                  Kojo Mensah & Co.
                </p>
                <p className="text-[11px] text-6c63ff">kojo@mensahco.gh</p>
              </div>

              {[
                ["Website Redesign", "GHS 2,400"],
                ["Monthly Retainer", "GHS 800"],
                ["Domain Renewal", "GHS 120"],
              ].map(([item, amt]) => (
                <div
                  key={item}
                  className="flex justify-between py-2.5 border-b border-[#e0d9cc] text-[12px]"
                >
                  <span className="text-[#0e0c09]">{item}</span>
                  <span className="font-semibold text-[#0e0c09]">{amt}</span>
                </div>
              ))}

              <div className="flex justify-between mt-4 px-4 py-3 bg-[#0e0c09] rounded-xl">
                <span className="text-[12px] text-[#f5f0e8]/55 font-medium">
                  Total Due
                </span>
                <span className="ff-display text-[16px] font-bold text-primary">
                  GHS 3,320
                </span>
              </div>
              <div className="mt-3 bg-primary rounded-xl py-2.5 text-center text-[12px] font-bold text-[#0e0c09] cursor-pointer hover:bg-primary transition-colors">
                Pay with Card or MoMo ↗
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
