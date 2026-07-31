"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

// Sample invoice data
const invoicesData: Record<
  string,
  {
    id: string;
    client: string;
    from: string;
    items: Array<{
      description: string;
      unitPrice: number;
    }>;
    dueDate: string;
    total: number;
  }
> = {
  "INV-2025-011": {
    id: "INV-2025-011",
    client: "Abena Frimpong",
    from: "Adu Studio",
    dueDate: "2025-03-10",
    total: 800,
    items: [
      { description: "Homepage Design", unitPrice: 500 },
      { description: "Mobile Responsive", unitPrice: 200 },
      { description: "SEO Setup", unitPrice: 100 },
    ],
  },
};

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;
  const invoice = invoicesData[invoiceId];
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      router.push(`/dashboard/invoices/${invoiceId}/success`);
    }, 2000);
  };

  if (!invoice) {
    return (
      <div className="flex-1 flex-col flex w-full gap-8 p-4 md:p-8 pt-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Invoice Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The invoice you're looking for doesn't exist.
          </p>
          <Link href="/dashboard/invoices">
            <Button>Back to Invoices</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center gap-8 p-4 md:p-8 pt-6 min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-primary mb-2">
          {invoice.from}
        </h3>
        <p className="text-sm text-muted-foreground">Invoice {invoice.id}</p>
      </div>

      {/* Payment Card */}
      <Card className="w-full max-w-md bg-card border-none">
        <CardHeader>
          <CardTitle className="text-center">Amount Due</CardTitle>
          <CardDescription className="text-center">
            <p className="text-4xl font-bold text-foreground mt-2">
              GHS {invoice.total.toFixed(2)}
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Items */}
          <div className="space-y-2">
            {invoice.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm py-2 border-b last:border-0"
              >
                <span>{item.description}</span>
                <span className="font-medium">
                  GHS {item.unitPrice.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Billing Info */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Billed to: <span className="font-medium">{invoice.client}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Due:{" "}
              <span className="font-medium">
                {new Date(invoice.dueDate).toLocaleDateString()}
              </span>
            </p>
          </div>

          {/* Pay Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              "Processing..."
            ) : (
              <>
                Pay GHS {invoice.total.toFixed(2)} via Paystack
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Secured by Paystack · Card & Mobile Money accepted</span>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Link */}
      <Link
        href={`/dashboard/invoices/${invoiceId}`}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Cancel and return to invoice
      </Link>
    </div>
  );
}
