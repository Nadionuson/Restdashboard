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
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
}) {
  const base =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    default:
      "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary shadow-sm hover:shadow-md",
    outline:
      "border border-border text-foreground bg-background hover:bg-muted focus:ring-ring",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive shadow-sm hover:shadow-md",
    ghost:
      "text-foreground hover:bg-muted focus:ring-ring",
    link:
      "text-primary underline-offset-4 hover:underline focus:ring-ring",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm rounded-md",
    md: "h-10 px-4 text-sm rounded-lg",
    lg: "h-12 px-6 text-base rounded-lg",
    icon: "h-10 w-10 rounded-lg",
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
