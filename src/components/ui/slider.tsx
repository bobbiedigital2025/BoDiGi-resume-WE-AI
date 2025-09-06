import * as React from "react"
import { cn } from "../../lib/utils"

const Slider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number[]
    onValueChange?: (value: number[]) => void
    max?: number
    min?: number
    step?: number
    disabled?: boolean
  }
>(({ className, value = [0], onValueChange, max = 100, min = 0, step = 1, disabled = false, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(value)
  const currentValue = value ?? internalValue

  const handleChange = (newValue: number[]) => {
    if (onValueChange) {
      onValueChange(newValue)
    } else {
      setInternalValue(newValue)
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-100">
        <div
          className="absolute h-full bg-blue-600"
          style={{ width: `${((currentValue[0] - min) / (max - min)) * 100}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue[0]}
        onChange={(e) => handleChange([parseFloat(e.target.value)])}
        disabled={disabled}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  )
})
Slider.displayName = "Slider"

export { Slider }
