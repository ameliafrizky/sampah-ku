import React from "react"
import { cn } from "@/lib/utils"

export const Card = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300",
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

export const CardHeader = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
})
CardHeader.displayName = "CardHeader"

export const CardTitle = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn("text-2xl font-bold tracking-tight text-gray-900", className)}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

export const CardDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  )
})
CardDescription.displayName = "CardDescription"

export const CardContent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
})
CardContent.displayName = "CardContent"

export const CardFooter = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"