import React from "react"
import { cn } from "@/lib/utils"

export const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] hover:-translate-y-0.5",
    secondary: "bg-white text-emerald-700 border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50",
    outline: "border-2 border-gray-200 bg-transparent hover:bg-gray-50 hover:border-gray-300 text-gray-700",
    ghost: "hover:bg-emerald-50 hover:text-emerald-700",
    danger: "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02]",
  }

  const sizes = {
    default: "h-11 px-6 py-2 text-sm",
    sm: "h-9 px-4 py-1.5 text-xs",
    lg: "h-13 px-8 py-3 text-base",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant] || variants.primary,
        sizes[size] || sizes.default,
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"