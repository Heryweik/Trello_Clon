'use client'

import { useFormStatus } from "react-dom"

import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

interface FormSubmitProps {
    children?: React.ReactNode
    disabled?: boolean
    className?: string
    variant?: 'default' | 'secondary' | 'primary' | 'destructive' | 'link' | 'outline' | 'ghost'
}

export const FormSubmit = ({ children, disabled, className, variant = 'primary' }: FormSubmitProps) => {

    const { pending } = useFormStatus()

    return (
        <Button
            disabled={disabled || pending}
            className={cn(className)}
            variant={variant}
            type="submit"
            size="sm"
        >
            {children}
        </Button>
    )
}