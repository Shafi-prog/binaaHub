import React from 'react';

interface RadioGroupProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

interface RadioGroupItemProps {
  value: string;
  id?: string;
  className?: string;
}

export function RadioGroup({ children, value, onValueChange, className }: RadioGroupProps) {
  return (
    <div className={className} role="radiogroup">
      {React.Children.map(children, (child, index) => 
        React.isValidElement(child) 
          ? React.cloneElement(child as any, { 
              key: index,
              checked: (child.props as any).value === value,
              onChange: () => onValueChange?.((child.props as any).value)
            })
          : child
      )}
    </div>
  );
}

export function RadioGroupItem({ value, id, className }: RadioGroupItemProps) {
  return (
    <input
      type="radio"
      value={value}
      id={id}
      className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 ${className}`}
    />
  );
}
