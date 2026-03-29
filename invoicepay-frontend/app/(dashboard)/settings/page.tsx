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
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [showSecretKey, setShowSecretKey] = useState(false);

  return (
    <div className="flex-1 flex-col flex w-full gap-8 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground pb-2">
          Manage your account and preferences
        </p>
      </div>

      {/* Business Profile Section */}
      <Card className="bg-primary/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>
                Update your business information and logo
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* Logo Upload */}
          <div className="flex flex-col gap-3">
            <Label>Business Logo</Label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-lg border-2 border-dashed border-border bg-muted/20 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                <div className="text-center">
                  <Upload className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 2MB
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Upload your logo</p>
                <p className="text-xs text-muted-foreground">
                  Click to upload your business logo (PNG, JPG up to 2MB)
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Form Fields */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                defaultValue="Samuel Adu Yeboah"
                placeholder="Enter your full name"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                defaultValue="Adu Studio"
                placeholder="Enter your business name"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                defaultValue="+233 50 927 2549"
                placeholder="+233 XX XXX XXXX"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="samuel@adustudio.gh"
                placeholder="your@email.com"
              />
            </div>

            <div className="flex flex-col gap-3 md:col-span-2">
              <Label htmlFor="address">Business Address</Label>
              <Input
                id="address"
                defaultValue="Tema, Greater Accra, Ghana"
                placeholder="Enter your business address"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Setup Section */}
      <Card className="bg-primary/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Payment Setup</CardTitle>
              <CardDescription>Configure your payment integration</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Paystack Integration */}
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="font-semibold mb-1">Paystack Integration</h4>
              <p className="text-sm text-muted-foreground">
                Connect your Paystack account to accept payments
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="secretKey">Secret Key</Label>
              <div className="relative">
                <Input
                  id="secretKey"
                  type={showSecretKey ? "text" : "password"}
                  defaultValue="sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showSecretKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Found in your Paystack Dashboard → Settings → API Keys
              </p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/40 border">
              <div>
                <p className="font-medium text-sm">Test Mode</p>
                <p className="text-xs text-muted-foreground">
                  Use Paystack test environment
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card  className="bg-primary/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium text-sm">Email Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Receive email updates about your invoices
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium text-sm">Payment Alerts</p>
                <p className="text-xs text-muted-foreground">
                  Get notified when payments are received
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium text-sm">Invoice Reminders</p>
                <p className="text-xs text-muted-foreground">
                  Automated reminders for unpaid invoices
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium text-sm">Marketing Emails</p>
                <p className="text-xs text-muted-foreground">
                  Receive tips and product updates
                </p>
              </div>
              <Switch />
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone Section */}
      <Card className="border-destructive/50 bg-primary/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <div>
              <p className="font-medium text-sm">Delete Account</p>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <div>
              <p className="font-medium text-sm">Export Data</p>
              <p className="text-xs text-muted-foreground">
                Download all your data in JSON format
              </p>
            </div>
            <Button variant="outline" size="sm">
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
