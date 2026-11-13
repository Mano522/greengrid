"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Leaf,
  Mail,
  Lock,
  User,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Sun,
  Zap,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/components/RoleContext";

export default function LoginPage() {
  const router = useRouter();
  const {
    loginWithEmail,
    registerWithEmail,
    resetPassword,
  } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<UserRole>("citizen");
  const [organization, setOrganization] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);

  const getDestination = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");
      if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
        return redirect;
      }
    }
    return "/";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    if (mode === "register") {
      if (!displayName.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (password.length < 6) {
        setError("Password should be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    try {
      setLoading(true);
      if (mode === "login") {
        await loginWithEmail(trimmedEmail, password);
        setSuccessMessage("Authenticated successfully! Loading dashboard...");
        setTimeout(() => {
          router.push(getDestination());
        }, 500);
      } else {
        await registerWithEmail(trimmedEmail, password, displayName.trim(), role, organization.trim());
        setSuccessMessage("Account created successfully! Loading dashboard...");
        setTimeout(() => {
          router.push(getDestination());
        }, 500);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      const errorCode = err?.code;
      let msg = err?.message || "Authentication failed. Please verify credentials.";
      if (
        errorCode === "auth/user-not-found" ||
        errorCode === "auth/wrong-password" ||
        errorCode === "auth/invalid-credential"
      ) {
        msg = "Invalid email or password. Please check your credentials.";
      } else if (errorCode === "auth/email-already-in-use") {
        msg = "An account with this email already exists. Please sign in.";
      } else if (errorCode === "auth/weak-password") {
        msg = "Password is too weak. Please use at least 6 characters.";
      } else if (errorCode === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotMessage("Please enter your email address.");
      return;
    }
    try {
      setForgotLoading(true);
      await resetPassword(forgotEmail);
      setForgotMessage("Password reset instructions sent! Check your inbox.");
      setTimeout(() => {
        setForgotModalOpen(false);
        setForgotMessage(null);
      }, 2500);
    } catch (err: any) {
      setForgotMessage(err?.message || "Could not process password reset.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center py-8 px-4 sm:px-6">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden">
        {/* Left Column: Platform Branding & Security Notice */}
        <div className="lg:col-span-5 bg-[#073326] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

          {/* Wind Turbine & Solar Watermark */}
          <div className="absolute bottom-0 right-0 left-0 opacity-20 pointer-events-none">
            <svg
              viewBox="0 0 200 100"
              className="w-full h-auto text-emerald-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <line x1="45" y1="95" x2="45" y2="35" stroke="currentColor" strokeWidth="2" />
              <circle cx="45" cy="35" r="2.5" fill="currentColor" />
              <line x1="45" y1="35" x2="30" y2="15" stroke="currentColor" strokeWidth="1.5" />
              <line x1="45" y1="35" x2="60" y2="20" stroke="currentColor" strokeWidth="1.5" />
              <line x1="45" y1="35" x2="45" y2="55" stroke="currentColor" strokeWidth="1.5" />
              <polygon
                points="80,95 115,85 140,92 105,105"
                fill="rgba(16, 185, 129, 0.2)"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
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
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-900/60 border border-emerald-400/30 text-emerald-300 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Official 2026 Energy Baseline
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight mb-3">
              Powering India&apos;s 500 GW Clean Energy Mission
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed mb-6">
              Sign in with your verified credentials to access DISCOM RPO tracking, PM Surya Ghar subsidy modeling, and real-time national energy telemetry.
            </p>

            <div className="space-y-3 text-xs text-emerald-100/90 mb-6">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#55d985] shrink-0" />
                <span>PM Surya Ghar: ₹78,000 Direct DBT Subsidy</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#55d985] shrink-0" />
                <span>Statutory RPO Compliance Trajectory (29.91% - 43.33%)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#55d985] shrink-0" />
                <span>GEC Phase-III: ₹1.86 Lakh Cr Evacuation Insights</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-400/30 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-300 mb-1">
                <ShieldAlert className="w-4 h-4 text-[#55d985]" />
                <span>Mandatory Authentication</span>
              </div>
              <p className="text-[11px] text-emerald-100/70 leading-relaxed">
                Direct or guest access is strictly disabled. All grid operators, citizens, and policymakers must authenticate via verified credentials.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-emerald-800/60 flex items-center justify-between text-[11px] text-emerald-300/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Secure Encrypted Portal
            </span>
            <span>v1.0 • 2026</span>
          </div>
        </div>

        {/* Right Column: Interactive Login / Register Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === "login"
                  ? "bg-white text-[#073326] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === "register"
                  ? "bg-white text-[#073326] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Ramesh Chandra"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                    />
                  </div>
                </div>

                {/* Role Selection for Registration */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Your Role / Purpose <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole("citizen")}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        role === "citizen"
                          ? "border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <Sun className={`w-4 h-4 mb-1 ${role === "citizen" ? "text-emerald-700" : "text-slate-500"}`} />
                      <div className="text-[11px] font-bold text-slate-800 leading-tight">Citizen</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">Rooftop Solar</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("discom")}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        role === "discom"
                          ? "border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <Zap className={`w-4 h-4 mb-1 ${role === "discom" ? "text-emerald-700" : "text-slate-500"}`} />
                      <div className="text-[11px] font-bold text-slate-800 leading-tight">DISCOM</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">RPO Compliance</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("policymaker")}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        role === "policymaker"
                          ? "border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <Building2 className={`w-4 h-4 mb-1 ${role === "policymaker" ? "text-emerald-700" : "text-slate-500"}`} />
                      <div className="text-[11px] font-bold text-slate-800 leading-tight">Policymaker</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">Grid & Mix</div>
                    </button>
                  </div>
                </div>

                {role !== "citizen" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Organization / Entity Name
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder={role === "discom" ? "e.g. Tata Power Delhi Distribution (TPDDL)" : "e.g. Central Electricity Authority (CEA)"}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotModalOpen(true);
                    }}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#073326] hover:bg-[#05271d] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#55d985]" />
              <span>{loading ? "Authenticating..." : mode === "login" ? "Sign In to Dashboard" : "Create My Account"}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </form>

          {/* Direct Login Warning Banner */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Login is mandatory. Direct and guest logins are disabled.</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Reset Your Password
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Enter your registered email address and we&apos;ll send you instructions to reset your account password.
            </p>

            {forgotMessage && (
              <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                {forgotMessage}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-4 py-2 rounded-xl bg-[#073326] text-white text-xs font-bold hover:bg-[#05271d] disabled:opacity-60"
                >
                  {forgotLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
