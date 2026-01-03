import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'md', ...props }, ref) => {
        const variants = {
            default: "bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 dark:from-[#06B6D4] dark:to-[#22D3EE] dark:hover:from-[#0891B2] dark:hover:to-[#06B6D4] dark:shadow-none dark:border dark:border-[#22D3EE]/20",
            outline: "border border-slate-300 dark:border-[#1E293B] bg-transparent hover:border-primary-500 dark:hover:border-[#22D3EE] hover:text-primary-600 dark:hover:text-[#22D3EE] hover:bg-primary-50 dark:hover:bg-[#1A2332] text-slate-700 dark:text-[#94A3B8]",
            ghost: "hover:bg-primary-50 dark:hover:bg-[#1A2332] hover:text-primary-600 dark:hover:text-[#22D3EE] text-slate-700 dark:text-[#94A3B8]",
            danger: "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 dark:from-[#FB7185] dark:to-[#F43F5E] dark:hover:from-[#F43F5E] dark:hover:to-[#E11D48] dark:shadow-none dark:border dark:border-[#FB7185]/20",
        }

        const sizes = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 py-2",
            lg: "h-12 px-8 text-lg",
        }

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
