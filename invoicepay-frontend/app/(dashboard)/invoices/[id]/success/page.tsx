"use client";

import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

// Sample invoice data
const invoicesData: Record<
  string,
  {
    id: string;
    from: string;
    total: number;
  }
> = {
  "INV-2025-011": {
    id: "INV-2025-011",
    from: "Adu Studio",
    total: 800,
  },
};

export default function PaymentSuccessPage() {
  const params = useParams();
  const invoiceId = params.id as string;
  const invoice = invoicesData[invoiceId];
  const paymentDate = new Date().toISOString().split("T")[0];

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
      {/* Success Icon */}
      <div className="flex flex-col items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Payment Received!</h2>
          <p className="text-muted-foreground">
            Your payment has been processed successfully.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            A receipt has been sent to your email.
          </p>
        </div>
      </div>

      {/* Receipt Card */}
      <Card className="w-full max-w-md bg-primary/10">
        <CardHeader>
          <CardTitle>Receipt</CardTitle>
          <CardDescription>Payment confirmation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Invoice */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Invoice</span>
            <span className="font-medium">{invoice.id}</span>
          </div>

          <Separator />

          {/* From */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">From</span>
            <span className="font-medium">{invoice.from}</span>
          </div>

          {/* Method */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Method</span>
            <span className="font-medium">Paystack · Card</span>
          </div>

          {/* Date */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Date</span>
            <span className="font-medium">
              {new Date(paymentDate).toLocaleDateString()}
            </span>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-muted-foreground">Total Paid</span>
            <span className="text-2xl font-bold">
              GHS {invoice.total.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Link href={`/dashboard/invoices/${invoiceId}`}>
          <Button variant="outline">View Invoice</Button>
        </Link>
        <Link href="/dashboard/invoices">
          <Button>Back to Invoices</Button>
        </Link>
      </div>
    </div>
  );
}
