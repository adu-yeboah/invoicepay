"use client";

import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Link2,
  Mail,
  Check,
  Download,
} from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

// Sample invoice data
const invoicesData: Record<
  string,
  {
    id: string;
    client: string;
    email: string;
    phone?: string;
    title?: string;
    from: string;
    fromEmail: string;
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
    }>;
    issueDate: string;
    dueDate: string;
    taxRate: number;
    status: "sent" | "paid" | "overdue" | "draft";
  }
> = {
  "INV-2025-011": {
    id: "INV-2025-011",
    client: "Abena Frimpong",
    email: "abena@example.com",
    phone: "+233 XX XXX XXXX",
    title: "Website Design Package",
    from: "Adu Studio",
    fromEmail: "samuel@adustudio.gh",
    issueDate: "2025-02-22",
    dueDate: "2025-03-10",
    taxRate: 0,
    status: "sent",
    items: [
      { description: "Homepage Design", quantity: 1, unitPrice: 500 },
      { description: "Mobile Responsive", quantity: 1, unitPrice: 200 },
      { description: "SEO Setup", quantity: 1, unitPrice: 100 },
    ],
  },
};

export default function InvoiceDetailsPage() {
  const params = useParams();
  const invoiceId = params.id as string;
  const invoice = invoicesData[invoiceId];

  if (!invoice) {
    return (
      <div className="flex-1 flex-col flex w-full gap-8 p-4 md:p-8 pt-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Invoice Not Found</h2>
          <Link href="/dashboard/invoices">
            <Button>Back to Invoices</Button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const taxAmount = subtotal * (invoice.taxRate / 100);
  const total = subtotal + taxAmount;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "sent":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case "overdue":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-8 p-4 md:p-8 pt-6">

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {invoice.id}
            </h2>

            <div
              className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                invoice.status
              )}`}
            >
              {invoice.status}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* INVOICE */}
          <Card className="bg-card border-none">

            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-2xl">
                  Invoice
                </CardTitle>

                <p className="text-sm text-muted-foreground mt-1">
                  {invoice.from}
                </p>

                <p className="text-xs text-muted-foreground">
                  {invoice.fromEmail}
                </p>
              </div>

              <div className="text-right text-sm">
                <p>
                  <span className="text-muted-foreground">
                    Issued:
                  </span>{" "}
                  {new Date(invoice.issueDate).toLocaleDateString()}
                </p>

                <p>
                  <span className="text-muted-foreground">
                    Due:
                  </span>{" "}
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">

              {/* CLIENT */}
              <div className="grid md:grid-cols-2 gap-8">

                <div>
                  <h4 className="font-semibold mb-2">
                    Billed To
                  </h4>

                  <p className="font-medium">{invoice.client}</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.email}
                  </p>

                  {invoice.phone && (
                    <p className="text-sm text-muted-foreground">
                      {invoice.phone}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    From
                  </h4>

                  <p className="font-medium">{invoice.from}</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.fromEmail}
                  </p>
                </div>

              </div>

              <Separator />

              {/* ITEMS */}
              <div>

                <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground mb-2">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                <div className="space-y-2">
                  {invoice.items.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 items-center py-2 border-b"
                    >
                      <div className="col-span-6">
                        {item.description}
                      </div>

                      <div className="col-span-2 text-center">
                        {item.quantity}
                      </div>

                      <div className="col-span-2 text-right">
                        GHS {item.unitPrice.toFixed(2)}
                      </div>

                      <div className="col-span-2 text-right font-medium">
                        GHS {(item.quantity * item.unitPrice).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </CardContent>
          </Card>

        </div>

        {/* RIGHT SUMMARY */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-6 h-fit">

          <Card className="bg-card border-none">

            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>GHS {subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Tax ({invoice.taxRate}%)</span>
                <span>GHS {taxAmount.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>GHS {total.toFixed(2)}</span>
              </div>

              <Separator />

              {/* ACTIONS */}
              <div className="flex flex-col gap-3 pt-2">

                <Button variant="outline">
                  <Link2 className="h-4 w-4 mr-2" />
                  Copy Payment Link
                </Button>

                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Reminder
                </Button>

                <Button variant="outline">
                  <Check className="h-4 w-4 mr-2" />
                  Mark as Paid
                </Button>

                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>

                <Link
                  href={`/dashboard/invoices/${invoice.id}/pay`}
                >
                  <Button className="w-full mt-2">
                    Pay Now
                  </Button>
                </Link>

              </div>

            </CardContent>

          </Card>

        </div>

      </div>

    </div>
  );
}
