const fs = require('fs');
const path = require('path');

console.log('Fixing remaining TypeScript errors...');

// 1. Fix UI component imports to use relative paths instead of @/lib/utils
function fixUIComponentImports() {
  console.log('1. Fixing UI component imports...');
  
  const uiComponents = [
    'alert.tsx', 'avatar.tsx', 'badge.tsx', 'checkbox.tsx', 
    'label.tsx', 'progress.tsx', 'select.tsx', 'tabs.tsx', 'textarea.tsx'
  ];
  
  uiComponents.forEach(component => {
    const filePath = path.join(__dirname, '..', 'src', 'shared', 'components', 'ui', component);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      // Replace @/lib/utils with relative path
      content = content.replace("import { cn } from '@/lib/utils';", "import { cn } from '../../../lib/utils';");
      fs.writeFileSync(filePath, content);
      console.log(`Fixed imports in ${component}`);
    }
  });
}

// 2. Fix StatCard component to include trend props
function fixStatCardComponent() {
  console.log('2. Fixing StatCard component...');
  
  const statCardPath = path.join(__dirname, '..', 'src', 'shared', 'components', 'ui', 'stat-card.tsx');
  const statCardContent = `import React from 'react';
import { cn } from '../../../lib/utils';

export interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  trend, 
  trendDirection = 'neutral',
  className 
}) => {
  return (
    <div className={cn("bg-white p-6 rounded-lg shadow", className)}>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {trend && (
          <p className={cn(
            "ml-2 text-sm font-medium",
            trendDirection === 'up' && "text-green-600",
            trendDirection === 'down' && "text-red-600",
            trendDirection === 'neutral' && "text-gray-500"
          )}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
};`;
  
  fs.writeFileSync(statCardPath, statCardContent);
  console.log('Fixed StatCard component with trend props');
}

// 3. Fix Input component to include label prop
function fixInputComponent() {
  console.log('3. Fixing Input component...');
  
  const inputPath = path.join(__dirname, '..', 'src', 'shared', 'components', 'ui', 'input.tsx');
  const inputContent = `import React from 'react';
import { cn } from '../../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";`;
  
  fs.writeFileSync(inputPath, inputContent);
  console.log('Fixed Input component with label prop');
}

// 4. Fix Select component to include label prop and proper onChange
function fixSelectComponent() {
  console.log('4. Fixing Select component...');
  
  const selectPath = path.join(__dirname, '..', 'src', 'shared', 'components', 'ui', 'select.tsx');
  const selectContent = `import React from 'react';
import { cn } from '../../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <select
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          onChange={handleChange}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = "Select";`;
  
  fs.writeFileSync(selectPath, selectContent);
  console.log('Fixed Select component with label prop and proper onChange');
}

// 5. Add missing Badge and Alert variants
function fixBadgeAndAlertVariants() {
  console.log('5. Fixing Badge and Alert variants...');
  
  // Fix Badge component
  const badgePath = path.join(__dirname, '..', 'src', 'shared', 'components', 'ui', 'badge.tsx');
  const badgeContent = `import React from 'react';
import { cn } from '../../../lib/utils';

export interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'warning';
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', className, children }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === 'default' && "bg-primary text-primary-foreground",
        variant === 'secondary' && "bg-secondary text-secondary-foreground",
        variant === 'destructive' && "bg-destructive text-destructive-foreground",
        variant === 'outline' && "border border-input bg-background text-foreground",
        variant === 'warning' && "bg-yellow-100 text-yellow-800",
        className
      )}
    >
      {children}
    </span>
  );
};`;
  
  fs.writeFileSync(badgePath, badgeContent);
  console.log('Fixed Badge component with warning variant');
  
  // Fix Alert component
  const alertPath = path.join(__dirname, '..', 'src', 'shared', 'components', 'ui', 'alert.tsx');
  const alertContent = `import React from 'react';
import { cn } from '../../../lib/utils';

export interface AlertProps {
  variant?: 'default' | 'destructive' | 'warning';
  className?: string;
  children: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full rounded-lg border p-4",
          variant === 'default' && "bg-background text-foreground",
          variant === 'destructive' && "border-destructive/50 text-destructive dark:border-destructive",
          variant === 'warning' && "border-yellow-200 bg-yellow-50 text-yellow-800",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Alert.displayName = "Alert";`;
  
  fs.writeFileSync(alertPath, alertContent);
  console.log('Fixed Alert component with warning variant');
}

// 6. Create missing files/modules
function createMissingModules() {
  console.log('6. Creating missing modules...');
  
  // Create UserDashboard component
  const userDashboardDir = path.join(__dirname, '..', 'src', 'domains', 'users', 'components');
  if (!fs.existsSync(userDashboardDir)) {
    fs.mkdirSync(userDashboardDir, { recursive: true });
  }
  
  const userDashboardPath = path.join(userDashboardDir, 'UserDashboard.tsx');
  const userDashboardContent = `import React from 'react';

export default function UserDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
}`;
  
  fs.writeFileSync(userDashboardPath, userDashboardContent);
  console.log('Created UserDashboard component');
  
  // Create CategoryNav component
  const categoryNavPath = path.join(__dirname, '..', 'src', 'domains', 'marketplace', 'storefront', 'CategoryNav.tsx');
  const categoryNavContent = `import React from 'react';

export const CategoryNav: React.FC = () => {
  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8 overflow-x-auto py-4">
          <a href="#" className="text-gray-700 hover:text-gray-900 whitespace-nowrap">All Categories</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 whitespace-nowrap">Electronics</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 whitespace-nowrap">Fashion</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 whitespace-nowrap">Home & Garden</a>
        </div>
      </div>
    </nav>
  );
};`;
  
  fs.writeFileSync(categoryNavPath, categoryNavContent);
  console.log('Created CategoryNav component');
  
  // Create MultiStoreCart hook
  const multiStoreCartPath = path.join(__dirname, '..', 'src', 'domains', 'marketplace', 'components', 'checkout', 'MultiStoreCart.tsx');
  const multiStoreCartContent = `import { useState } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  storeId: string;
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  const addItem = (item: CartItem) => {
    setItems(prev => [...prev, item]);
  };
  
  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    total
  };
};`;
  
  fs.writeFileSync(multiStoreCartPath, multiStoreCartContent);
  console.log('Created MultiStoreCart hook');
}

// 7. Fix React import in error-handling.tsx
function fixReactImport() {
  console.log('7. Fixing React import...');
  
  const errorHandlingPath = path.join(__dirname, '..', 'src', 'shared', 'error', 'error-handling.tsx');
  if (fs.existsSync(errorHandlingPath)) {
    let content = fs.readFileSync(errorHandlingPath, 'utf8');
    
    // Check if React import exists at the top
    if (!content.includes("import React from 'react';")) {
      // Add React import at the beginning
      content = "import React from 'react';\n" + content;
      fs.writeFileSync(errorHandlingPath, content);
      console.log('Added React import to error-handling.tsx');
    }
  }
}

// 8. Fix CSRF hooks import
function fixCSRFImports() {
  console.log('8. Fixing CSRF imports...');
  
  const csrfPath = path.join(__dirname, '..', 'src', 'lib', 'csrf.ts');
  if (fs.existsSync(csrfPath)) {
    let content = fs.readFileSync(csrfPath, 'utf8');
    
    // Add React import at the top if not present
    if (!content.includes("import React") && !content.includes("import { useState, useEffect }")) {
      content = "import { useState, useEffect } from 'react';\n" + content;
      fs.writeFileSync(csrfPath, content);
      console.log('Added React hooks import to csrf.ts');
    }
  }
}

// Run all fixes
try {
  fixUIComponentImports();
  fixStatCardComponent();
  fixInputComponent();
  fixSelectComponent();
  fixBadgeAndAlertVariants();
  createMissingModules();
  fixReactImport();
  fixCSRFImports();
  
  console.log('All fixes completed successfully!');
} catch (error) {
  console.error('Error during fixes:', error);
}
