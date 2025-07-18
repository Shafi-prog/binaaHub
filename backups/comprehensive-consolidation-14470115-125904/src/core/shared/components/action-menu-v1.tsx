import React from 'react';
import { Button } from '@/core/shared/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

interface ActionMenuProps {
  actions: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }[];
}

export const ActionMenu = ({ actions }: ActionMenuProps) => {
  return (
    <div className="relative">
      <Button variant="ghost" size="sm">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {/* Add dropdown menu implementation here */}
    </div>
  );
};





