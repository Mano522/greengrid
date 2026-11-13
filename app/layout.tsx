import type { Metadata } from "next";
import "./globals.css";
import { RoleProvider } from "@/components/RoleContext";
import { AuthProvider } from "@/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "India Green Grid — Renewable Energy Decision-Support Platform",
  description:
    "Empowering citizens, DISCOMs and policymakers for a cleaner, renewable and sustainable India. Powered by official 2026 CEA, MNRE & CCEA data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f3f6f4] text-slate-900 min-h-screen font-sans selection:bg-emerald-500 selection:text-white">
        <RoleProvider>
          <AuthProvider>
            <AuthGuard>{children}</AuthGuard>
          </AuthProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
