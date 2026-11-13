"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRole, UserRole } from "./RoleContext";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Bell,
  ChevronDown,
  Sparkles,
  X,
  LogIn,
  LogOut,
  Shield,
  Building,
} from "lucide-react";
import { LiveWeatherTelemetry } from "./LiveWeatherTelemetry";

export function TopHeader() {
  const { role, setRole } = useRole();
  const { user, userProfile, isDemoMode, logout } = useAuth();
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return "IG";
  };

  return (
    <div className="w-full flex items-center justify-end gap-3 py-3 px-4 sm:px-6 border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-30">
      {/* Live Weather-API Renewable Output, Battery Sizing & CPCB Air Quality Telemetry */}
      <LiveWeatherTelemetry />

      {/* Role Switcher matching Reference Image */}
      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
        <span>Role:</span>
        <div className="relative">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 shadow-sm transition-all cursor-pointer">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-4 appearance-none"
            >
              <option value="citizen">Citizen</option>
              <option value="discom">DISCOM</option>
              <option value="policymaker">Policymaker</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none -ml-3" />
          </div>
        </div>
      </div>

      {/* Bell Notification Icon */}
      <button
        onClick={() => setShowNotificationModal(true)}
        className="relative p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-emerald-700 transition-colors shadow-sm"
        title="View Grid & Policy Alerts"
      >
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
      </button>

      {/* User Authentication Pill / Menu */}
      {user ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 shadow-sm transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-[#073326] text-[#55d985] text-[10px] font-bold flex items-center justify-center shrink-0">
              {getInitials(user.displayName, user.email)}
            </div>
            <div className="text-left hidden md:block">
              <span className="text-xs font-bold text-slate-800 block leading-tight max-w-[120px] truncate">
                {user.displayName || user.email?.split("@")[0]}
              </span>
              <span className="text-[10px] font-medium text-emerald-700 block leading-none capitalize">
                {userProfile?.role || role} {isDemoMode && "• Demo"}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User Dropdown Menu */}
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in">
              <div className="px-4 py-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {user.displayName || "Energy Advocate"}
                </span>
                <span className="text-[11px] text-slate-500 block truncate">
                  {user.email}
                </span>
                {userProfile?.organization && (
                  <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    <Building className="w-3 h-3 text-slate-400" />
                    {userProfile.organization}
                  </span>
                )}
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Shield className="w-2.5 h-2.5 text-emerald-600" />
                    {role.toUpperCase()}
                  </span>
                  {isDemoMode && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Sandbox
                    </span>
                  )}
                </div>
              </div>

              <div className="px-2 py-1">
                <Link
                  href="/solar-calculator"
                  onClick={() => setUserDropdownOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                >
                  Rooftop Solar Subsidy
                </Link>
                <Link
                  href="/rpo-tracker"
                  onClick={() => setUserDropdownOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                >
                  RPO Compliance Tracker
                </Link>
                <Link
                  href="/jobs"
                  onClick={() => setUserDropdownOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                >
                  Green Jobs Portal
                </Link>
              </div>

              <div className="pt-1 mt-1 border-t border-slate-100 px-2">
                <button
                  onClick={async () => {
                    setUserDropdownOpen(false);
                    await logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-semibold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#073326] text-white text-xs font-bold hover:bg-[#05271d] shadow-sm transition-all hover:shadow"
        >
          <LogIn className="w-3.5 h-3.5 text-[#55d985]" />
          <span>Sign In</span>
        </Link>
      )}

      {/* Notification / Citations Drawer Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Grid Baseline & Policy Notifications
                </h3>
              </div>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="font-bold text-emerald-800 block mb-0.5">
                  Cabinet Approval: GEC Phase-III
                </span>
                <p className="text-emerald-700 leading-relaxed">
                  ₹1,86,405 Crore sanctioned for 135 GW RE evacuation and 50 GWh BESS battery capacity.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-0.5">
                  Statutory RPO Mandate: 29.91%
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Active statutory compliance target for FY 2024-25 scaling to 43.33% by 2030 under MoP gazette.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-0.5">
                  PM Surya Ghar Operational Slabs
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Direct financial subsidy capped at ₹78,000 for 3 kW and above (₹30k/kW for first 2 kW, ₹18k 3rd kW).
                </p>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowNotificationModal(false)}
                className="px-4 py-2 rounded-xl bg-[#073326] text-white font-bold text-xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
