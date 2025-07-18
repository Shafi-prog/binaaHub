// @ts-nocheck
"use client";
import * as React from "react";
import { cn } from "@/core/shared/utils";

interface EnhancedLoadingProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  logoSrc?: string;
}

export function EnhancedLoading({
  title = "Loading...",
  subtitle,
  showLogo = false,
  fullScreen = false,
  size = "md",
  className,
  logoSrc = "/logo.png",
  ...props
}: EnhancedLoadingProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
  };

  const containerClasses = fullScreen 
    ? "fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center"
    : "flex items-center justify-center p-8";

  return (
    <div className={cn(containerClasses, className)} {...props}>
      <div className="text-center space-y-4 max-w-md mx-auto">
        {showLogo && (
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
          </div>
        )}
        
        {/* Enhanced Spinner */}
        <div className="flex justify-center">
          <div className="relative">
            <div className={cn(
              "animate-spin rounded-full border-4 border-gray-200 border-t-blue-600",
              sizeClasses[size]
            )}>
            </div>
            <div className={cn(
              "absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20",
              sizeClasses[size]
            )}>
            </div>
          </div>
        </div>

        {/* Title */}
        {title && (
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {title}
          </h2>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}

        {/* Progress Dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </div>
  );
}

// Also export as default for convenience
export default EnhancedLoading;
