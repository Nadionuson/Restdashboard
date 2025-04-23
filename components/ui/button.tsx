import * as React from "react";
import clsx from "clsx";

export function Button({
  children,
  onClick,
  className = "",
  variant = "default",
  size = "md" as const,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "secondary" | "destructive" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    default:
      "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
    outline:
      "border border-border text-foreground bg-transparent hover:bg-muted focus:ring-ring",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary ",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/80 focus:ring-destructive",
      glass:
    "bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 hover:shadow-lg focus:ring-white dark:text-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
    icon: "p-2",
  };

  return (
    <button
      onClick={onClick}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
