import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 md:py-32 w-full">
        <h1 className="ff-display text-4xl md:text-5xl font-black mb-8">Privacy Policy</h1>
        <div className="text-muted-foreground space-y-6 text-[15px] leading-relaxed">
          <p>
            At InvoicePay, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our application.
          </p>

          <h2 className="text-foreground text-2xl font-bold mt-12 mb-4">1. Information We Collect</h2>
          <p>
            We may collect personal information that you provide to us when registering for an account, such as your name, email address, company name, and billing details. We also collect information about your clients when you create invoices.
          </p>

          <h2 className="text-foreground text-2xl font-bold mt-12 mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to operate, maintain, and improve our services, to process transactions, to send administrative information, and to respond to your inquiries and support requests.
          </p>

          <h2 className="text-foreground text-2xl font-bold mt-12 mb-4">3. Data Security</h2>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information. However, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
          </p>

          <h2 className="text-foreground text-2xl font-bold mt-12 mb-4">4. Sharing Your Information</h2>
          <p>
            We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information with our business partners and trusted affiliates.
          </p>

          <h2 className="text-foreground text-2xl font-bold mt-12 mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@invoicepay.gh.
          </p>

          <p className="pt-12 text-sm text-muted-foreground/60">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
