"use client";

import { useState } from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { registerUser } from "@/lib/redux/slices/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

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
    path: ["confirm_password"],
  });

type RegisterFormValues = z.infer<typeof RegisterSchema>;

export default function SignupPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const { confirm_password, ...payload } = values;
      await dispatch(registerUser(payload)).unwrap();
      toast.success("Account created!", {
        description: "Welcome to InvoicePay.",
      });
    } catch (error: any) {
      toast.error("Registration failed", {
        description: error || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 w-full relative overflow-hidden">
      {/* background effects */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/[0.06] blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-primary/[0.04] blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative w-full max-w-xl">
        <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-8 md:p-10 shadow-xl shadow-black/[0.04] dark:shadow-black/20">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <span className="ff-display text-[17px] font-bold text-primary-foreground leading-none">
                  IP
                </span>
              </div>
              <span className="ff-display text-xl font-bold text-foreground tracking-tight">
                InvoicePay
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Create your account to get started
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-[13px] font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="h-11 rounded-lg bg-background border-border/60 focus-visible:border-primary/50"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Business Name */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="business_name"
                  className="text-[13px] font-medium"
                >
                  Business Name
                </Label>
                <span className="text-[10px] text-muted-foreground/60 bg-muted/60 px-1.5 py-0.5 rounded-md font-medium tracking-wide">
                  OPTIONAL
                </span>
              </div>
              <Input
                id="business_name"
                type="text"
                placeholder="Acme Inc."
                className="h-11 rounded-lg bg-background border-border/60 focus-visible:border-primary/50"
                {...register("business_name")}
              />
              {errors.business_name && (
                <p className="text-xs text-destructive">
                  {errors.business_name.message}
                </p>
              )}
            </div>

            <div className="border-t border-border/40" />

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-[13px] font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-11 rounded-lg bg-background border-border/60 focus-visible:border-primary/50"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-[13px] font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-11 rounded-lg bg-background border-border/60 pr-10 focus-visible:border-primary/50"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors duration-150"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="confirm_password"
                className="text-[13px] font-medium"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-11 rounded-lg bg-background border-border/60 pr-10 focus-visible:border-primary/50"
                  {...register("confirm_password")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors duration-150"
                  tabIndex={-1}
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-xs text-destructive">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="h-11 w-full rounded-lg mt-1 gap-2 shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? (
                "Creating account..."
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            {/* Footer link */}
            <p className="mt-4 text-center text-[13px] text-muted-foreground/70">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline underline-offset-2"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>

        {/* Bottom trust signals */}
        <div className="flex items-center justify-center gap-6 mt-6">
          {["No credit card required", "14-day free trial", "Cancel anytime"].map(
            (t) => (
              <div
                key={t}
                className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground/40"
              >
                <Check
                  size={11}
                  className="text-primary/50"
                  strokeWidth={3}
                />
                {t}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}