"use client"

import type React from "react"

import { Button as UIButton, type ButtonProps } from "@/components/ui/button"
import { forwardRef } from "react"

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, CustomButtonProps>(({ children, ...props }, ref) => {
  return (
    <UIButton ref={ref} {...props}>
      {children}
    </UIButton>
  )
})

Button.displayName = "Button"

export { Button }
