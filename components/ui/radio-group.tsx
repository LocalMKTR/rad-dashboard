"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  name?: string
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, defaultValue, value, onValueChange, name, ...props }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || "")

    React.useEffect(() => {
      if (value !== undefined && value !== selectedValue) {
        setSelectedValue(value)
      }
    }, [value, selectedValue])

    // Use useMemo to create the context value and the handleChange function together
    const contextValue = React.useMemo(() => {
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setSelectedValue(newValue)
        onValueChange?.(newValue)
      }

      return {
        name,
        value: selectedValue,
        onChange: handleChange,
      }
    }, [name, selectedValue, onValueChange])

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <div ref={ref} className={cn("grid gap-2", className)} {...props} />
      </RadioGroupContext.Provider>
    )
  },
)
RadioGroup.displayName = "RadioGroup"

interface RadioGroupItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string
}

const RadioGroupContext = React.createContext<{
  name?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}>({})

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, id, value, ...props }, ref) => {
    const { name, value: groupValue, onChange } = React.useContext(RadioGroupContext)
    const itemId = id || `radio-${value}`

    return (
      <div className="flex items-center space-x-2">
        <input
          type="radio"
          id={itemId}
          ref={ref}
          name={name}
          value={value}
          checked={value === groupValue}
          onChange={onChange}
          className={cn(
            "h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
      </div>
    )
  },
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }

