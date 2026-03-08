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

export default function page() {
  return (
    <>
      <Card className="relative z-10 w-full max-w-md rounded-xl border border-border/50 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60 p-3 shadow-xl">
        <CardHeader className="space-y-1 pt-10">
          <CardTitle className="text-2xl font-bold ">
            <span className="text-primary">Invoice</span> Pay
          </CardTitle>
          <CardDescription className="text-base">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-4 flex flex-col">
          <form className="gap-5 flex flex-col">
            <div className="gap-2 flex flex-col">
              <Label htmlFor="email" className="text-sm font-medium">
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
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-10"
              />
            </div>

            <Button type="submit" className="w-full h-10 mt-2">
              Sign In
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
