"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BarChart3,
  Sun,
  Briefcase,
  Coins,
  FileText,
  Menu,
  X,
  Leaf,
  LogIn,
  UserCheck,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, userProfile, isDemoMode, logout } = useAuth();

  const navLinks = [
    { label: "Dashboard", href: "/", icon: Home },
    { label: "RPO Tracker", href: "/rpo-tracker", icon: BarChart3 },
    { label: "Solar Calculator", href: "/solar-calculator", icon: Sun },
    { label: "Green Jobs", href: "/jobs", icon: Briefcase },
    { label: "Green Finance", href: "/green-finance", icon: Coins },
    { label: "Policy & Insights", href: "/audits", icon: FileText },
    {
      label: user ? "Account" : "Sign In",
      href: "/login",
      icon: user ? UserCheck : LogIn,
    },
  ];

  const content = (
    <div className="flex flex-col justify-between h-full py-6 px-4 bg-[#073326] text-white">
      {/* Brand Header & Links */}
      <div>
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-2 mb-8 group"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 fill-emerald-400 text-emerald-400" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block leading-tight">
              India
            </span>
            <span className="font-bold text-sm tracking-tight text-emerald-400 block leading-tight">
              Green Grid
            </span>
          </div>
        </Link>

        {/* Navigation links matching Reference Image 1 */}
        <nav className="space-y-1.5">
          {navLinks.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#55d985] text-[#073326] shadow-sm font-bold"
                    : "text-emerald-100/80 hover:text-white hover:bg-emerald-900/40"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#073326]" : "text-emerald-300"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Account Info or Sign In Quick Action */}
      <div className="space-y-4">
        {user ? (
          <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/20 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                {userProfile?.role || "Active Session"}
              </span>
              <button
                onClick={() => logout()}
                className="text-emerald-400/70 hover:text-rose-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="font-bold text-white text-xs truncate">
              {user.displayName || user.email?.split("@")[0]}
            </div>
            <div className="text-[10px] text-emerald-200/60 truncate mt-0.5">
              {user.email}
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/20 text-xs">
            <span className="font-bold text-emerald-300 text-xs block mb-1">
              Join the Green Grid
            </span>
            <p className="text-[11px] text-emerald-100/70 leading-relaxed mb-2.5">
              Save solar calculations, file DISCOM audits & apply for subsidies.
            </p>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center w-full py-2 px-3 rounded-xl bg-[#55d985] text-[#073326] font-bold text-xs hover:bg-[#4bc275] transition-colors"
            >
              Sign In / Register
            </Link>
          </div>
        )}

        {/* Wind Turbine & Solar Watermark Illustration at bottom matching Reference Image 1 */}
        <div className="relative pt-2 overflow-hidden select-none pointer-events-none opacity-35">
          <svg
            viewBox="0 0 200 120"
            className="w-full h-auto text-emerald-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {/* Rolling hill */}
            <path
              d="M -10 110 Q 50 85, 110 100 T 210 95 L 210 120 L -10 120 Z"
              fill="rgba(16, 185, 129, 0.15)"
              stroke="none"
            />
            {/* Wind Turbine 1 */}
            <line x1="45" y1="95" x2="45" y2="35" stroke="currentColor" strokeWidth="2" />
            <circle cx="45" cy="35" r="2.5" fill="currentColor" />
            <line x1="45" y1="35" x2="30" y2="15" stroke="currentColor" strokeWidth="1.5" />
            <line x1="45" y1="35" x2="60" y2="20" stroke="currentColor" strokeWidth="1.5" />
            <line x1="45" y1="35" x2="45" y2="55" stroke="currentColor" strokeWidth="1.5" />

            {/* Wind Turbine 2 (Smaller) */}
            <line x1="20" y1="102" x2="20" y2="55" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="20" cy="55" r="2" fill="currentColor" />
            <line x1="20" y1="55" x2="10" y2="40" stroke="currentColor" strokeWidth="1" />
            <line x1="20" y1="55" x2="30" y2="42" stroke="currentColor" strokeWidth="1" />
            <line x1="20" y1="55" x2="20" y2="70" stroke="currentColor" strokeWidth="1" />

            {/* Solar Panel array */}
            <polygon
              points="70,105 105,95 130,102 95,115"
              fill="rgba(16, 185, 129, 0.2)"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <line x1="88" y1="100" x2="112" y2="108" stroke="currentColor" strokeWidth="1" />
            <line x1="82" y1="110" x2="117" y2="98" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar with Hamburger */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#073326] text-white sticky top-0 z-50 shadow-md">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-400 fill-emerald-400" />
          <span className="font-extrabold text-sm text-white">India Green Grid</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg bg-emerald-900/60 text-emerald-100 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
          <div className="w-64 h-full bg-[#073326] shadow-2xl relative">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-emerald-200 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            {content}
          </div>
        </div>
      )}

      {/* Desktop Persistent Left Sidebar */}
      <aside className="hidden lg:block w-60 shrink-0 min-h-screen sticky top-0 shadow-lg">
        {content}
      </aside>
    </>
  );
}

export { Sidebar };
