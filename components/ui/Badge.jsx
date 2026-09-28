import React from "react"
import { cn } from "@/lib/utils"

export const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-emerald-100 text-emerald-800",
    secondary: "bg-gray-100 text-gray-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Badge.displayName = "Badge"