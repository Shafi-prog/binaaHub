'use client';

interface BadgeProps {
  children: React.ReactNode;
}

export default function Badge({ children }: BadgeProps) {
  return <span className="bg-gray-200 rounded px-2 py-1 text-xs">{children}</span>;
}
