import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-primary/15 bg-[#0e0c09]/95 backdrop-blur-xl">
      <div className="max-w-7xl m-auto px-6 md:px-16 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          
          <span className="ff-display text-[18px] font-bold text-[#f5f0e8] tracking-tight">
            InvoicePay
          </span>
        </div>

        <div className="hidden md:flex items-center gap-9">
          {[
            ["Features", "#features"],
            ["How It Works", "#how-it-works"],
            ["Pricing", "#pricing"],
          ].map(([l, h]) => (
            <Link
              key={l}
              href={h}
              className="text-[13px] font-medium text-[#f5f0e8]/50 hover:text-primary transition-colors no-underline"
            >
              {l}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-[13px] font-medium text-[#f5f0e8]/45 hover:text-[#f5f0e8] transition-colors no-underline px-3 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 bg-primary text-[#0e0c09] text-[13px] font-semibold rounded-lg px-5 py-2.5 no-underline hover:bg-primary transition-colors"
          >
            Get Started <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
