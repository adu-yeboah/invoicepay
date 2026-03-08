"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <>
      {/* card */}
      <Card className="relative z-10 w-full max-w-md rounded-xl border border-border/50 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60 p-3 shadow-xl">
        <CardHeader className="space-y-1 pt-10">
          <CardTitle className="text-2xl font-bold ">
            <span className="text-primary">Invoice</span> Pay
          </CardTitle>
          <CardTitle className="text-2xl font-bold pt-6">
            Create your account
          </CardTitle>
          <CardDescription className="text-sm">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-4 flex flex-col">
          <form className="gap-5 flex flex-col">
            <div className="gap-2 flex flex-col">
              <Label htmlFor="email" className="text-sm font-medium  text-muted-foreground">
                FUll Name
              </Label>
              <Input
                id="full_name"
                type="text"
                placeholder="John Doe"
                className="h-10"
              />
            </div>

            <div className="gap-2 flex flex-col">
              <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                Business Name
              </Label>
              <Input
                id="business-name"
                type="text"
                placeholder="Acme Inc."
                className="h-10"
              />
            </div>

            <div className="gap-2 flex flex-col">
              <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-10"
              />
            </div>

            <div className="gap-2 flex flex-col">
              <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-10"
              />
            </div>

              <div className="gap-2 flex flex-col">
              <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                className="h-10"
              />
            </div>

            <Button type="submit" className="w-full h-10 mt-2">
              Create Account
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </a>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
