import { KeyboardEventHandler, forwardRef } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { FormErrors } from "./form-errors";
import { useFormStatus } from "react-dom";

interface FormTextareaProps {
    id: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    errors?: Record<string, string[] | undefined>;
    className?: string;
    onBlur?: () => void;
    onClick?: () => void;
    onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
    defaultValue?: string;
}

// Se usa el forwardRef para poder pasar la referencia de un componente a otro
export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({ id, label, placeholder, required, disabled, errors, className, onBlur, onClick, onKeyDown, defaultValue }, ref) => {

    const {pending} = useFormStatus()

    return (
        <div className="space-y-2 w-full">
            <div className="space-y-1 w-full">
                {label ? (
                    <Label
                        htmlFor={id}
                        className="text-xs font-semibold text-neutral-700"
                    >
                        {label}
                    </Label>
                ) : null}
                <Textarea
                    onKeyDown={onKeyDown}
                    ref={ref}
                    onBlur={onBlur}
                    onClick={onClick}
                    id={id}
                    name={id}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled || pending}
                    defaultValue={defaultValue}
                    className={cn(
                        "resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm",
                        className
                    )}
                    aria-describedby={`${id}-error`}
                />
            </div>
            <FormErrors errors={errors} id={id} />
        </div>
    )
})

FormTextarea.displayName = 'FormTextarea'
