<<<<<<< HEAD
import React from 'react';

export function Card({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`card ${className}`} {...props}>{children}</div>;
}

export function CardContent({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="card-content" {...props}>{children}</div>;
=======
'use client';

import { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, ...props }: CardProps) {
  return (
    <div {...props} className={`border p-4 rounded-lg shadow ${props.className ?? ''}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, ...props }: CardProps) {
  return (
    <div {...props} className={`p-4 ${props.className ?? ''}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, ...props }: CardProps) {
  return (
    <div {...props} className={`p-4 pb-2 ${props.className ?? ''}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, ...props }: CardProps) {
  return (
    <h3 {...props} className={`text-lg font-semibold ${props.className ?? ''}`}>
      {children}
    </h3>
  );
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
}
