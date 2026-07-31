import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 md:py-32 w-full">
        <h1 className="ff-display text-4xl md:text-5xl font-black mb-8">Terms of Service</h1>
        <div className="text-muted-foreground space-y-6 text-[15px] leading-relaxed">
          <p>
            Welcome to InvoicePay. These Terms of Service ("Terms") govern your use of the InvoicePay website, applications, and services. By accessing or using our services, you agree to be bound by these Terms.
          </p>

          <h2 className="text-foreground text-2xl font-bold mt-12 mb-4">1. Acceptance of Terms</h2>
          <p>
            By creating an account or otherwise using InvoicePay, you agree to these Terms. If you do not agree to these Terms, you may not use our services.
          </p>

          <h2 className="text-foreground text-2xl font-bold mt-12 mb-4">2. Description of Service</h2>
          <p>
            InvoicePay provides an online invoicing, payment tracking, and financial management platform designed specifically for Ghanaian businesses, freelancers, and SMEs. We act as a software service provider and do not directly process payments, which are handled via third-party integrations like Paystack.
          </p>

          <h2 className="text-foreground text-2xl font-bold mt-12 mb-4">3. User Accounts</h2>
          <p>
            You are responsible for safeguarding your account credentials and for any activities or actions under your account. You must provide accurate and complete information when registering an account.
          </p>

          <h2 className="text-foreground text-2xl font-bold mt-12 mb-4">4. Acceptable Use</h2>
          <p>
            You agree not to use InvoicePay for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction.
          </p>

          <h2 className="text-foreground text-2xl font-bold mt-12 mb-4">5. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, InvoicePay shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
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
