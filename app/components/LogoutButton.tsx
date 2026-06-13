"use client";
import React from "react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm text-slate-100 transition hover:bg-slate-800"
    >
      Logout
    </button>
  );
}
