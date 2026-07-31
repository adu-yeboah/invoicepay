"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicInvoice, useInitiatePayment } from "@/lib/hooks/use-payments";

export default function PublicPaymentPage() {
  const params = useParams();
  const token = params.token as string;

  const { data: invoice, isLoading, isError } = usePublicInvoice(token);
  const initiatePayment = useInitiatePayment();

  const handlePay = () => {
    initiatePayment.mutate({ token });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !invoice) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-4">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold">Invoice Not Found</h2>
          <p className="text-muted-foreground">
            This invoice link is invalid or has expired.
          </p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (invoice.status === "paid") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
            <FileText className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold">Already Paid</h2>
          <p className="text-muted-foreground">
            This invoice has already been paid. Thank you!
          </p>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = Number(invoice.subtotal) || 0;
  const taxAmount = Number(invoice.tax_amount) || 0;
  const total = Number(invoice.total) || 0;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Business Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            {invoice.business.logo ? (
              <img
                src={invoice.business.logo}
                alt="Logo"
                className="h-10 w-10 rounded-lg object-cover"
              />
            ) : null}
            <h3 className="text-xl font-bold text-primary">
              {invoice.business.name || "InvoicePay"}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Invoice {invoice.invoice_number}
          </p>
        </div>

        {/* Invoice Card */}
        <Card className="bg-primary/10">
          <CardHeader>
            <CardTitle className="text-center">Amount Due</CardTitle>
            <CardDescription className="text-center">
              <p className="text-4xl font-bold text-foreground mt-2">
                {invoice.currency} {total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Client */}
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">
                Billed to:{" "}
                <span className="font-medium text-foreground">
                  {invoice.client.name}
                </span>
              </p>
              {invoice.due_date && (
                <p className="text-muted-foreground">
                  Due:{" "}
                  <span className="font-medium text-foreground">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </span>
                </p>
              )}
            </div>

            <Separator />

            {/* Items */}
            <div className="space-y-2">
              {invoice.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm py-2 border-b last:border-0"
                >
                  <span>{item.description}</span>
                  <span className="font-medium">
                    {invoice.currency}{" "}
                    {Number(item.total).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
            </div>

            {Number(invoice.tax_rate) > 0 && (
              <>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>
                    {invoice.currency}{" "}
                    {subtotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Tax ({invoice.tax_rate}%)
                  </span>
                  <span>
                    {invoice.currency}{" "}
                    {taxAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </>
            )}

            {invoice.notes && (
              <>
                <Separator />
                <p className="text-xs text-muted-foreground italic">
                  {invoice.notes}
                </p>
              </>
            )}

            {/* Pay Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handlePay}
              disabled={initiatePayment.isPending}
            >
              {initiatePayment.isPending ? (
                "Redirecting to Paystack..."
              ) : (
                <>
                  Pay {invoice.currency}{" "}
                  {total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  via Paystack
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {/* Security Note */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>
                Secured by Paystack · Card &amp; Mobile Money accepted
              </span>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Powered by{" "}
          <span className="font-semibold text-primary">InvoicePay</span>
        </p>
      </div>
    </div>
  );
}
