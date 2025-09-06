import * as React from "react"
import { cn } from "../../lib/utils"

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    value?: string
    onValueChange?: (value: string) => void
    children?: React.ReactNode
  }
>(({ className, value, onValueChange, children, ...props }, ref) => {
  return (
    <SelectContext.Provider value={{ value: value || "", onValueChange: onValueChange || (() => {}) }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
})
Select.displayName = "Select"

const SelectContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
}>({
  value: "",
  onValueChange: () => {}
})

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { value } = React.useContext(SelectContext)

  return (
    <>
      <button
        ref={ref}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        {children}
        <svg
          className="h-4 w-4 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <SelectContent isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    placeholder?: string
  }
>(({ className, placeholder, ...props }, ref) => {
  const { value } = React.useContext(SelectContext)
  
  return (
    <span
      ref={ref}
      className={cn(value ? "" : "text-gray-500", className)}
      {...props}
    >
      {value || placeholder}
    </span>
  )
})
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isOpen: boolean
    onClose: () => void
  }
>(({ className, children, isOpen, onClose, ...props }, ref) => {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={ref}
        className={cn(
          "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  )
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string
  }
>(({ className, children, value, ...props }, ref) => {
  const { onValueChange } = React.useContext(SelectContext)

  return (
    <div
      ref={ref}
      className={cn(
        "relative cursor-pointer select-none py-2 px-3 hover:bg-gray-100 focus:bg-gray-100",
        className
      )}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </div>
  )
})
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
