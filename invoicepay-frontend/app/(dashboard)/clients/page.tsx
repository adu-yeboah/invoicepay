"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Building2,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

// Sample client data
const clientsData = [
  {
    id: 1,
    name: "Emma Thompson",
    email: "emma.thompson@email.com",
    company: "Thompson Designs",
    phone: "+1 234 567 8901",
    address: "123 Design St, Creative City, CA 90210",
    status: "active",
    totalInvoiced: 12500,
    totalPaid: 10000,
  },
  {
    id: 2,
    name: "James Wilson",
    email: "james.wilson@email.com",
    company: "Wilson Consulting",
    phone: "+1 234 567 8902",
    address: "456 Business Ave, Commerce City, NY 10001",
    status: "active",
    totalInvoiced: 8750,
    totalPaid: 8750,
  },
  {
    id: 3,
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    company: "Chen Technologies",
    phone: "+1 234 567 8903",
    address: "789 Tech Blvd, Innovation Valley, WA 98001",
    status: "active",
    totalInvoiced: 15600,
    totalPaid: 12000,
  },
  {
    id: 4,
    name: "Michael Brown",
    email: "michael.brown@email.com",
    company: "Brown & Associates",
    phone: "+1 234 567 8904",
    address: "321 Executive Dr, Corporate Park, IL 60601",
    status: "inactive",
    totalInvoiced: 5400,
    totalPaid: 5400,
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    company: "Anderson Marketing",
    phone: "+1 234 567 8905",
    address: "654 Media Lane, Advertising Town, TX 75001",
    status: "active",
    totalInvoiced: 9200,
    totalPaid: 7800,
  },
];

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients] = useState(clientsData);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-8 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
          <p className="text-muted-foreground">
            Manage your clients and their information
          </p>
        </div>
        <Link href="/dashboard/clients/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <Card className="bg-primary/10">
        <CardContent className="pt-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="bg-primary/10">
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
          <CardDescription>
            {filteredClients.length} client{filteredClients.length !== 1 ? "s" : ""}{" "}
            found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead className="hidden md:table-cell">Company</TableHead>
                <TableHead className="hidden lg:table-cell">Phone</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
                <TableHead className="text-right">Total Invoiced</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No clients found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={`/clients/${client.id}.png`} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                            {getInitials(client.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="font-medium text-sm leading-none">
                            <Link
                              href={`/clients/${client.id}`}
                              className="hover:text-primary transition-colors"
                            >
                              {client.name}
                            </Link>
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        {client.company}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {client.phone}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          client.status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            client.status === "active"
                              ? "bg-green-500"
                              : "bg-gray-500"
                          }`}
                        />
                        {client.status.charAt(0).toUpperCase() +
                          client.status.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <p className="font-medium text-sm">
                        ${client.totalInvoiced.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${client.totalPaid.toLocaleString()} paid
                      </p>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="ml-auto bg-background border px-3 py-2 rounded-md min-w-min flex flex-col gap-1">
                          {/* <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator /> */}
                          <DropdownMenuItem asChild className="flex gap-1 items-c4">
                            <Link
                              href={`/clients/${client.id}`}
                              className="cursor-pointer"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex gap-1 items-c4">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive flex gap-1 items-c4">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
