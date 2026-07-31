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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  CreditCard,
  Bell,
  AlertTriangle,
  Upload,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [showSecretKey, setShowSecretKey] = useState(false);

  return (
    <div className="flex-1 flex-col flex w-full gap-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* ── Business Profile ── */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-5">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/15">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-[15px]">Business Profile</CardTitle>
              <CardDescription>
                Update your business information and logo
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* Logo Upload */}
          <div className="flex flex-col gap-3">
            <Label className="text-[13px] font-medium">Business Logo</Label>
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 flex items-center justify-center cursor-pointer transition-colors duration-200 group">
                <div className="text-center">
                  <Upload className="h-5 w-5 mx-auto mb-1 text-muted-foreground/60 group-hover:text-primary/60 transition-colors duration-200" />
                  <p className="text-[10px] text-muted-foreground/50 leading-tight">
                    PNG, JPG
                    <br />
                    up to 2MB
                  </p>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Upload your logo</p>
                <p className="text-xs text-muted-foreground/70">
                  Appears on all your invoices. Recommended: 200×200px with a
                  transparent background.
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-border/40" />

          {/* Form Fields */}
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { id: "fullName", label: "Full Name", value: "Samuel Adu Yeboah", placeholder: "Enter your full name" },
              { id: "businessName", label: "Business Name", value: "Adu Studio", placeholder: "Enter your business name" },
              { id: "phone", label: "Phone", value: "+233 50 927 2549", placeholder: "+233 XX XXX XXXX" },
              { id: "email", label: "Email", value: "samuel@adustudio.gh", placeholder: "your@email.com", type: "email" },
            ].map((field) => (
              <div key={field.id} className="flex flex-col gap-2">
                <Label
                  htmlFor={field.id}
                  className="text-[13px] font-medium"
                >
                  {field.label}
                </Label>
                <Input
                  id={field.id}
                  type={field.type || "text"}
                  defaultValue={field.value}
                  placeholder={field.placeholder}
                  className="h-10"
                />
              </div>
            ))}

            <div className="flex flex-col gap-2 md:col-span-2">
              <Label
                htmlFor="address"
                className="text-[13px] font-medium"
              >
                Business Address
              </Label>
              <Input
                id="address"
                defaultValue="Tema, Greater Accra, Ghana"
                placeholder="Enter your business address"
                className="h-10"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button className="gap-2 h-10 px-5 shadow-sm shadow-primary/15">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Payment Setup ── */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-5">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/15">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-[15px]">Payment Setup</CardTitle>
              <CardDescription>
                Configure your payment integration
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">Paystack Integration</h4>
              <p className="text-sm text-muted-foreground/70">
                Connect your Paystack account to accept card and mobile money
                payments
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="secretKey"
                className="text-[13px] font-medium"
              >
                Secret Key
              </Label>
              <div className="relative">
                <Input
                  id="secretKey"
                  type={showSecretKey ? "text" : "password"}
                  defaultValue="sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="pr-10 font-mono text-[13px] h-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors duration-200"
                >
                  {showSecretKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground/60">
                Found in your Paystack Dashboard → Settings → API Keys &amp;
                Webhooks
              </p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border/40">
              <div className="space-y-0.5">
                <p className="font-medium text-sm">Test Mode</p>
                <p className="text-xs text-muted-foreground/70">
                  Use Paystack&apos;s test environment for development
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button className="gap-2 h-10 px-5 shadow-sm shadow-primary/15">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Notifications ── */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-5">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/15">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-[15px]">Notifications</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          {[
            {
              title: "Email Notifications",
              desc: "Receive email updates about your invoices and account",
              checked: true,
            },
            {
              title: "Payment Alerts",
              desc: "Get notified instantly when payments are received",
              checked: true,
            },
            {
              title: "Invoice Reminders",
              desc: "Automated reminders for unpaid invoices",
              checked: false,
            },
            {
              title: "Marketing Emails",
              desc: "Receive tips, product updates, and promotions",
              checked: false,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-border/70 transition-colors duration-200 group"
            >
              <div className="space-y-0.5 pr-4">
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground/70">{item.desc}</p>
              </div>
              <Switch defaultChecked={item.checked} className="shrink-0" />
            </div>
          ))}

          <div className="flex justify-end pt-3">
            <Button className="gap-2 h-10 px-5 shadow-sm shadow-primary/15">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Danger Zone ── */}
      <Card className="border-destructive/25 shadow-sm">
        <CardHeader className="pb-5">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/15">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-[15px] text-destructive">
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/[0.03]">
            <div className="space-y-0.5 pr-4">
              <p className="font-medium text-sm">Delete Account</p>
              <p className="text-xs text-muted-foreground/70">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="destructive" size="sm" className="shrink-0 h-9">
              Delete Account
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-border/70 transition-colors duration-200">
            <div className="space-y-0.5 pr-4">
              <p className="font-medium text-sm">Export Data</p>
              <p className="text-xs text-muted-foreground/70">
                Download all your invoices, clients, and settings in JSON
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 h-9 gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
