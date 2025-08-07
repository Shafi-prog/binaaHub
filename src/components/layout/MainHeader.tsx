"use client";
import React from "react";
import { useAuth } from "@/core/shared/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function MainHeader() {
  const { user, signOut, isLoading } = useAuth();

  return (
    <header className="w-full bg-white shadow flex items-center justify-between px-6 py-3 mb-4">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl text-indigo-700">بنا هب</span>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-700 font-medium">{user.name}</span>
            <Button
              variant="outline"
              className="flex items-center gap-1 text-red-600 border-red-200"
              onClick={signOut}
              disabled={isLoading}
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </Button>
          </>
        ) : null}
      </div>
    </header>
  );
}
