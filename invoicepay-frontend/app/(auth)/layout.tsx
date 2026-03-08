import { ThemeToggle } from "@/components/theme-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background py-20 flex items-center justify-center min-h-screen p-4 relative overflow-hidden ">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* radial glow effect */}
      <div className="absolute top-0 right-0 w-150 h-150 -translate-y-1/2 translate-x-1/4 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-100 h-100 translate-y-1/4 -translate-x-1/4 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      {children}
    </div>
  );
}
