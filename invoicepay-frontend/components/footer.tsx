import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/30 bg-card/30 px-6 md:px-16 pt-16 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-10 mb-14">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <Image src={"/logo.png"} height={40} width={50} alt="logo" />
            </div>
            <p className="text-[13px] text-muted-foreground/60 leading-[1.75] max-w-xs">
              Simple invoicing for Ghanaian businesses. Get paid faster with
              professional invoices and secure payments.
            </p>
          </div>

          {[
            {
              heading: "Product",
              links: [
                ["Features", "/#features"],
                ["Pricing", "/#pricing"],
                ["How It Works", "/#how-it-works"],
              ],
            },
            {
              heading: "Company",
              links: [
                ["About", "/about"],
                ["Blog", "/blog"],
              ],
            },
          ].map((col) => (
            <div key={col.heading}>
              <h4 className="text-[10px] font-bold tracking-[0.12em] text-muted-foreground/40 uppercase mb-5">
                {col.heading}
              </h4>
              <ul className="space-y-3 list-none p-0 m-0">
                {col.links.map(([l, h]) => (
                  <li key={l}>
                    <Link
                      href={h}
                      className="text-[13px] text-muted-foreground/60 hover:text-foreground transition-colors duration-200 no-underline"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-[10px] font-bold tracking-[0.12em] text-muted-foreground/40 uppercase mb-5">
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
                  <Icon size={13} className="text-primary/60 shrink-0" />
                  <Link
                    href={href}
                    className="text-[13px] text-muted-foreground/60 hover:text-foreground transition-colors duration-200 no-underline"
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[12px] text-muted-foreground/40">
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
                className="text-[12px] text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors duration-200 no-underline"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
