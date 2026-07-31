"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Plus, X, FileText } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function NewInvoicePage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [invoiceTitle, setInvoiceTitle] = useState("");
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [dueDate, setDueDate] = useState("");
  const [taxRate, setTaxRate] = useState(15);
  const [notes, setNotes] = useState("");

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  const clients = [
    { id: "1", name: "Abena Frimpong", email: "abena@example.com" },
    { id: "2", name: "Kofi Mensah", email: "kofi@example.com" },
    { id: "3", name: "Ama Osei", email: "ama@example.com" },
  ];

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const updateLineItem = (
    index: number,
    field: keyof LineItem,
    value: string | number,
  ) => {
    const newItems = [...lineItems];
    newItems[index][field] = value as never;
    setLineItems(newItems);
  };

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent, draft: boolean) => {
    e.preventDefault();

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard/invoices");
    }, 1000);
  };

  return (
    <div className="flex-1 w-full mx-auto flex flex-col gap-8 p-4 md:p-8 pt-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/invoices">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              New Invoice
            </h2>
            <p className="text-muted-foreground">
              Create and send a professional invoice
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => handleSubmit(e, false)}
        className="grid gap-6 lg:grid-cols-3"
      >

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* CLIENT */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>
                Select the client receiving this invoice
              </CardDescription>
            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-6">

              <div className="flex flex-col gap-2">
                <Label>Client *</Label>

                <Select
                  value={selectedClient}
                  onValueChange={setSelectedClient}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>

                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Invoice Title</Label>

                <Input
                  value={invoiceTitle}
                  onChange={(e) => setInvoiceTitle(e.target.value)}
                  placeholder="Brand identity design"
                />
              </div>

            </CardContent>
          </Card>

          {/* DATES */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Invoice Dates</CardTitle>
            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-6">

              <div className="flex flex-col gap-2">
                <Label>Issue Date</Label>

                <Input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Due Date</Label>

                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

            </CardContent>
          </Card>

          {/* LINE ITEMS */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Line Items</CardTitle>
                <CardDescription>
                  Add products or services
                </CardDescription>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLineItem}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">

              <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground">
                <div className="col-span-5">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1"></div>
              </div>

              {lineItems.map((item, index) => (

                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 items-center"
                >

                  <div className="col-span-5">
                    <Input
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) =>
                        updateLineItem(index, "description", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateLineItem(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 1,
                        )
                      }
                      className="text-center"
                    />
                  </div>

                  <div className="col-span-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={item.unitPrice || ""}
                      onChange={(e) =>
                        updateLineItem(
                          index,
                          "unitPrice",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="text-right"
                    />
                  </div>

                  <div className="col-span-2 text-right font-medium">
                    GHS {(item.quantity * item.unitPrice).toFixed(2)}
                  </div>

                  <div className="col-span-1 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLineItem(index)}
                      disabled={lineItems.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                </div>

              ))}

            </CardContent>
          </Card>

          {/* NOTES */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>

            <CardContent>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Payment terms, bank details..."
                className="w-full min-h-[120px] rounded-md border px-3 py-2 text-sm"
              />

            </CardContent>
          </Card>

        </div>

        {/* RIGHT SIDE SUMMARY */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-6 h-fit">

          <Card className="border-border/50 shadow-sm">

            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              <div className="flex flex-col gap-2">
                <Label>Tax Rate (%)</Label>

                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={taxRate}
                  onChange={(e) =>
                    setTaxRate(parseFloat(e.target.value) || 0)
                  }
                />
              </div>

              <Separator />

              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>GHS {subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>GHS {taxAmount.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>GHS {total.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex flex-col gap-3">

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Sending..." : "Save & Send Invoice"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>

                <Link href="/dashboard/invoices">
                  <Button variant="ghost" className="w-full">
                    Cancel
                  </Button>
                </Link>

              </div>

            </CardContent>

          </Card>

        </div>

      </form>
    </div>
  );
}
