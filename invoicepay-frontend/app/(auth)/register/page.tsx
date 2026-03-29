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
import { registerUser } from "@/lib/redux/slices/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

//
//  Schema
//

const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, "Full name is required")
      .max(255, "Name is too long"),
    business_name: z
      .string()
      .max(255, "Business name is too long")
      .optional()
      .or(z.literal("")),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"], // shows the error under confirm_password field
  });

type RegisterFormValues = z.infer<typeof RegisterSchema>;

//
//  Page
//

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      business_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    // Strip confirm_password — the API doesn't need it
    const { confirm_password, ...payload } = values;
    dispatch(registerUser(payload));
  };

  return (
    <>
      <Card className="relative z-10 w-full max-w-md rounded-xl border border-border/50 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60 p-3 shadow-xl">
        <CardHeader className="space-y-1 pt-10">
          <CardTitle className="text-2xl font-bold">
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
          {/* Server-level error */}
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="gap-5 flex flex-col">
            {/* Full Name */}
            <div className="gap-2 flex flex-col">
              <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="h-10"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Business Name */}
            <div className="gap-2 flex flex-col">
              <Label htmlFor="business_name" className="text-sm font-medium text-muted-foreground">
                Business Name{" "}
                <span className="text-muted-foreground/50">(optional)</span>
              </Label>
              <Input
                id="business_name"
                type="text"
                placeholder="Acme Inc."
                className="h-10"
                {...register("business_name")}
              />
              {errors.business_name && (
                <p className="text-xs text-destructive">
                  {errors.business_name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="gap-2 flex flex-col">
              <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
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
              <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
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

            {/* Confirm Password */}
            <div className="gap-2 flex flex-col">
              <Label htmlFor="confirm_password" className="text-sm font-medium text-muted-foreground">
                Confirm Password
              </Label>
              <Input
                id="confirm_password"
                type="password"
                placeholder="••••••••"
                className="h-10"
                {...register("confirm_password")}
              />
              {errors.confirm_password && (
                <p className="text-xs text-destructive">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10 mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </a>
          </div>
        </CardContent>
      </Card>
    </>
  );
}