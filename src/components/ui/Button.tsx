import * as React from "react"
import { cn } from "@/src/lib/utils"

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' | 'secondary', size?: 'default' | 'sm' | 'lg' | 'icon' }>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          {
            "bg-blue-500 text-white hover:bg-blue-600 shadow-[0_4px_0_0_rgba(37,99,235,1)] hover:shadow-[0_2px_0_0_rgba(37,99,235,1)] hover:translate-y-[2px]": variant === "default",
            "bg-red-500 text-white hover:bg-red-600 shadow-[0_4px_0_0_rgba(220,38,38,1)] hover:shadow-[0_2px_0_0_rgba(220,38,38,1)] hover:translate-y-[2px]": variant === "secondary",
            "border-2 border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-[0_4px_0_0_rgba(226,232,240,1)] hover:shadow-[0_2px_0_0_rgba(226,232,240,1)] hover:translate-y-[2px]": variant === "outline",
            "hover:bg-slate-100 hover:text-slate-900": variant === "ghost",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-14 rounded-2xl px-8 text-lg": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
