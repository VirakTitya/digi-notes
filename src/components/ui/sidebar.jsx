
import * as React from "react"
import { cn } from "@/lib/utils"

const SidebarProvider = ({ children, ...props }) => (
  <div className="flex min-h-screen" {...props}>
    {children}
  </div>
)

const SidebarInset = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 flex flex-col", className)}
    {...props}
  />
))
SidebarInset.displayName = "SidebarInset"

const SidebarTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn("p-2 rounded-md hover:bg-gray-100", className)}
    {...props}
  >
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
))
SidebarTrigger.displayName = "SidebarTrigger"

export { SidebarProvider, SidebarInset, SidebarTrigger }
