"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DollarSign,
  Users,
  CreditCard,
  Activity,
  Search,
  MoreVertical,
  Plus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Table } from "@/components/ui/table";
import { DashboardTable } from "@/components/table";

export default function DashboardPage() {
  // Sample data for the chart
  const revenueData = [
    { month: "Jan", revenue: 4000, profit: 2400 },
    { month: "Feb", revenue: 3000, profit: 1398 },
    { month: "Mar", revenue: 2000, profit: 9800 },
    { month: "Apr", revenue: 2780, profit: 3908 },
    { month: "May", revenue: 1890, profit: 4800 },
    { month: "Jun", revenue: 2390, profit: 3800 },
    { month: "Jul", revenue: 3490, profit: 4300 },
  ];

  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1% from last month",
      icon: DollarSign,
      color: "var(--primary)",
    },
    {
      title: "Subscriptions",
      value: "+2350",
      change: "+180.1% from last month",
      icon: Users,
      color: "var(--primary)",
    },
    {
      title: "Sales",
      value: "+12,234",
      change: "+19% from last month",
      icon: CreditCard,
      color: "var(--primary)",
    },
    {
      title: "Active Now",
      value: "+573",
      change: "+201 since last hour",
      icon: Activity,
      color: "var(--primary)",
    },
  ];

  return (
    <div className="flex-1 w-full space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between w-full py-5">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, John!
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="gap-2 h-10 px-5 shadow-sm shadow-primary/15">
            <Plus className="h-4 w-4" />
            Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 py-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.title}
              className="relative overflow-hidden border-border/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md group"
            >

              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[13px] font-medium text-muted-foreground/70">
                  {stat.title}
                </CardTitle>

                <div className="p-2 rounded-xl bg-primary/10 border border-primary/15 group-hover:border-primary/30 transition-colors duration-200">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>

              <CardContent>
                <div
                  className="text-2xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>

                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/*Table  */}
      <div className="py-10">
        <div className="flex flex-row items-center justify-between w-full py-5">
          <h4 className="text-md font-bold pb-5"> Recent Invoices</h4>
          <Button variant="outline" size="sm" className="ml-auto mb-2">
            view all
          </Button>
        </div>
        <DashboardTable />
      </div>

      {/* Chart and Recent Sales */}
      <div className="grid gap-4 ">
        {/* Revenue Chart */}
        <Card className="col-span-4 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[15px]">Revenue Overview</CardTitle>
            <CardDescription className="pb-10">
              Monthly revenue and profit for the current year
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--primary)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-2)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.5rem",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--primary)"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="var(--chart-2)"
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
