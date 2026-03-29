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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { loginUser } from "@/lib/redux/slices/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schema 

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

//  Page

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues) => {
    dispatch(loginUser(values));
  };

  return (
    <>
      <Card className="relative z-10 w-full max-w-md rounded-xl border border-border/50 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60 p-3 shadow-xl">
        <CardHeader className="space-y-1 pt-10">
          <CardTitle className="text-2xl font-bold">
            <span className="text-primary">Invoice</span> Pay
          </CardTitle>
          <CardDescription className="text-base">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-4 flex flex-col">
          {/* Redux-level error (e.g. wrong credentials from server) */}
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="gap-5 flex flex-col">
            {/* Email */}
            <div className="gap-2 flex flex-col">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-10"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="gap-2 flex flex-col">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-10"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10 mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground mt-4">
            Don&apos;t have an account?{" "}
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