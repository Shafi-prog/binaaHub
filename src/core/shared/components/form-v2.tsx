// @ts-nocheck
import { forwardRef } from "react";
import { cn } from "@/domains/shared/utils";

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ className, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn("space-y-6", className)}
        {...props}
      />
    );
  }
);

Form.displayName = "Form";

export { Form };


