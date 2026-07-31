import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {/* subtle primary accent line at top */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl m-auto px-6 md:px-16 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="ff-display text-[13px] font-bold text-primary-foreground leading-none">
              IP
            </span>
          </div>
          <span className="ff-display text-[18px] font-bold text-foreground tracking-tight">
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
              className="relative text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 no-underline after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {l}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 no-underline px-3 py-2 rounded-lg hover:bg-muted/50"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="group inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-[13px] font-semibold rounded-lg px-5 py-2.5 no-underline hover:bg-primary/90 transition-all duration-200 shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/25"
          >
            Get Started
            <ArrowRight
              size={13}
              className="group-hover:translate-x-0.5 transition-transform duration-200"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}