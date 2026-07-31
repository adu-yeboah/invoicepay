"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useVerifyPayment } from "@/lib/hooks/use-payments";
import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const token = params.token as string;
  const reference = searchParams.get("reference");

  const {
    data: verification,
    isLoading,
    isError,
  } = useVerifyPayment(token, reference);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <h2 className="text-xl font-bold">Verifying Payment...</h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we confirm your payment.
          </p>
        </div>
      </div>
    );
  }

  if (isError || !verification) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
            <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold">Payment Verification Failed</h2>
          <p className="text-muted-foreground">
            We couldn&apos;t verify your payment. Please contact the business
            for assistance.
          </p>
          <Link href={`/pay/${token}`}>
            <Button>Try Again</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Success Icon */}
        <div className="text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <div>
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
        <Card className="bg-primary/10">
          <CardHeader>
            <CardTitle>Receipt</CardTitle>
            <CardDescription>Payment confirmation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Invoice</span>
              <span className="font-medium">
                {verification.invoice_number}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Reference</span>
              <span className="font-mono text-xs">{reference}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Date</span>
              <span className="font-medium">
                {new Date(verification.paid_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">
                Total Paid
              </span>
              <span className="text-2xl font-bold">
                GHS{" "}
                {Number(verification.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Powered by{" "}
          <span className="font-semibold text-primary">InvoicePay</span>
        </p>
      </div>
    </div>
  );
}
