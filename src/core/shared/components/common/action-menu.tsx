"use client";

import React, { useState, useRef, useEffect } from 'react';

interface ActionMenuItem {
  id: string;
  label: string;
  icon?: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger' | 'success';
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  trigger?: React.ReactNode;
  className?: string;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  items,
  trigger,
  className = "",
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'top-full left-0 mt-1';
      case 'bottom-right':
        return 'top-full right-0 mt-1';
      case 'top-left':
        return 'bottom-full left-0 mb-1';
      case 'top-right':
        return 'bottom-full right-0 mb-1';
      default:
        return 'top-full right-0 mt-1';
    }
  };

  const getItemVariantClasses = (variant: ActionMenuItem['variant']) => {
    switch (variant) {
      case 'danger':
        return 'text-red-600 hover:bg-red-50';
      case 'success':
        return 'text-green-600 hover:bg-green-50';
      default:
        return 'text-gray-700 hover:bg-gray-100';
    }
  };

  const handleItemClick = (item: ActionMenuItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {trigger || (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
          </svg>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={`absolute z-50 bg-white border border-gray-200 rounded-md shadow-lg min-w-48 ${getPositionClasses()}`}
        >
          <div className="py-1">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                  item.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : getItemVariantClasses(item.variant)
                }`}
              >
                <div className="flex items-center">
                  {item.icon && (
                    <span className="mr-3 text-lg">{item.icon}</span>
                  )}
                  {item.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Default export for convenience
export default ActionMenu;

// Named export for component libraries
export { ActionMenu };

// Export types
export type { ActionMenuItem, ActionMenuProps };
