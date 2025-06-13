import React from 'react';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  (props, ref) => (
    <textarea ref={ref} className="border rounded p-2 w-full" {...props} />
  )
);
Textarea.displayName = 'Textarea';
