import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, ArrowRightToLine } from "lucide-react";

const invoices = [
  {
    invoice: "INV001",
    client: "Acme Corp",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
    dueDate: "2026-03-10",
  },
  {
    invoice: "INV002",
    client: "TechNova Ltd",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
    dueDate: "2026-03-12",
  },
  {
    invoice: "INV003",
    client: "Green Solutions",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
    dueDate: "2026-03-15",
  },
  {
    invoice: "INV004",
    client: "Bright Media",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
    dueDate: "2026-03-18",
  },
  {
    invoice: "INV005",
    client: "Skyline Ventures",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
    dueDate: "2026-03-20",
  },
  {
    invoice: "INV006",
    client: "NextGen Systems",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
    dueDate: "2026-03-22",
  },
  {
    invoice: "INV007",
    client: "Delta Logistics",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
    dueDate: "2026-03-25",
  },
];

export function DashboardTable() {
  return (
    <Table className="bg-card border-none">
      <TableHeader className="bg-muted/50">
        <TableRow className="border-b-border/50">
          <TableHead className="w-[100px] p-4">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Due Date</TableHead>

          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.slice(0, 3).map((invoice) => (
          <TableRow key={invoice.invoice} className="border-b-border/50 hover:bg-muted/30 transition-colors">
            <TableCell className="font-medium p-4">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>

            <TableCell className="text-right">
              <ArrowRight className="inline-block text-primary cursor-pointer hover:translate-x-1 transition-transform" size={18} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
