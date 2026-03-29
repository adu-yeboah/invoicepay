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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  DollarSign,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample client data (in a real app, this would come from an API)
const clientsData: Record<
  string,
  {
    id: number;
    name: string;
    email: string;
    company: string;
    phone: string;
    address: string;
    status: "active" | "inactive";
    totalInvoiced: number;
    totalPaid: number;
    taxId?: string;
    website?: string;
    createdAt: string;
    notes?: string;
  }
> = {
  "1": {
    id: 1,
    name: "Emma Thompson",
    email: "emma.thompson@email.com",
    company: "Thompson Designs",
    phone: "+1 234 567 8901",
    address: "123 Design St, Creative City, CA 90210",
    status: "active",
    totalInvoiced: 12500,
    totalPaid: 10000,
    taxId: "TX-123456",
    website: "https://thompsondesigns.com",
    createdAt: "2024-01-15",
    notes:
      "Preferred client, always pays on time. Specializes in web design projects.",
  },
  "2": {
    id: 2,
    name: "James Wilson",
    email: "james.wilson@email.com",
    company: "Wilson Consulting",
    phone: "+1 234 567 8902",
    address: "456 Business Ave, Commerce City, NY 10001",
    status: "active",
    totalInvoiced: 8750,
    totalPaid: 8750,
    createdAt: "2024-02-20",
    notes: "Business consulting services.",
  },
  "3": {
    id: 3,
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    company: "Chen Technologies",
    phone: "+1 234 567 8903",
    address: "789 Tech Blvd, Innovation Valley, WA 98001",
    status: "active",
    totalInvoiced: 15600,
    totalPaid: 12000,
    createdAt: "2024-03-10",
    notes: "Technology consulting and implementation.",
  },
};

// Sample invoice data for this client
const clientInvoices = [
  {
    id: "INV-001",
    date: "2024-06-15",
    description: "Web Design Project",
    amount: 3500,
    status: "paid",
  },
  {
    id: "INV-002",
    date: "2024-07-20",
    description: "Consulting Services",
    amount: 2000,
    status: "paid",
  },
  {
    id: "INV-003",
    date: "2024-08-10",
    description: "UI/UX Design",
    amount: 4500,
    status: "pending",
  },
  {
    id: "INV-004",
    date: "2024-09-05",
    description: "Development Work",
    amount: 2500,
    status: "overdue",
  },
];

export default function ClientDetailsPage() {
  const params = useParams();
  const clientId = params.id as string;
  const client = clientsData[clientId];

  if (!client) {
    return (
      <div className="flex-1 w-full gap-8 p-4 md:p-8 pt-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Client Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The client you're looking for doesn't exist.
          </p>
          <Link href="/dashboard/clients">
            <Button>Back to Clients</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const outstandingBalance = client.totalInvoiced - client.totalPaid;

  return (
    <div className="flex-1 w-full  flex flex-col gap-8 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/clients">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Client
            </Button>
          </div>
        </div>

        <div className="flex items-start gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`/clients/${client.id}.png`} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
              {getInitials(client.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight">
                {client.name}
              </h2>
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  client.status === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    client.status === "active" ? "bg-green-500" : "bg-gray-500"
                  }`}
                />
                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
              </div>
            </div>
            <p className="text-muted-foreground">{client.company}</p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Client since {new Date(client.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Invoiced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <p className="text-2xl font-bold">
                {client.totalInvoiced.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <p className="text-2xl font-bold text-green-600">
                {client.totalPaid.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Outstanding Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign
                className={`h-5 w-5 ${
                  outstandingBalance > 0 ? "text-orange-600" : "text-muted-foreground"
                }`}
              />
              <p
                className={`text-2xl font-bold ${
                  outstandingBalance > 0 ? "text-orange-600" : ""
                }`}
              >
                {outstandingBalance.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information */}
        <Card className="bg-primary/10">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              How to reach {client.name.split(" ")[0]}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{client.email}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{client.phone}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Company</p>
                <p className="text-sm text-muted-foreground">{client.company}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-muted-foreground">{client.address}</p>
              </div>
            </div>

            {client.website && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Website</p>
                    <a
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {client.website}
                    </a>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        {client.notes && (
          <Card className="bg-primary/10">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Additional information about this client</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{client.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Invoices */}
      <Card className="bg-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>
                Latest invoices for this client
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.description}</TableCell>
                  <TableCell className="text-right">
                    ${invoice.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : invoice.status === "pending"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
