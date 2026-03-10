"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { ShieldCheck, ScanLine, Activity } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (hasCompletedOnboarding) {
      router.push("/dashboard");
    }
  }, [hasCompletedOnboarding, router]);

  if (!mounted || hasCompletedOnboarding) return null; // Prevent hydration flash

  return (
    <div className="container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <div className="glass-panel animate-slide-up" style={{ maxWidth: "600px", padding: "48px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <div style={{ backgroundColor: "var(--safe-bg)", padding: "16px", borderRadius: "50%" }}>
            <ShieldCheck size={48} color="var(--safe)" />
          </div>
        </div>

        <h1 style={{ fontSize: "3rem", marginBottom: "16px" }}>
          Welcome to <span className="text-gradient">ScanEats</span>
        </h1>

        <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", marginBottom: "32px", lineHeight: "1.6" }}>
          Your personal food safety companion. Scan barcodes to instantly verify if a product is safe for your diabetic and allergen profile.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "40px", textAlign: "left" }}>
          <div style={{ padding: "16px", backgroundColor: "var(--bg-card)", borderRadius: "var(--radius-md)" }}>
            <Activity color="var(--primary)" size={24} style={{ marginBottom: "12px" }} />
            <h3 style={{ marginBottom: "8px" }}>Diabetic Safe</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Detects hidden sugars and high carbs to keep your levels in check.</p>
          </div>
          <div style={{ padding: "16px", backgroundColor: "var(--bg-card)", borderRadius: "var(--radius-md)" }}>
            <ScanLine color="var(--secondary)" size={24} style={{ marginBottom: "12px" }} />
            <h3 style={{ marginBottom: "8px" }}>Allergen Alerts</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Cross-checks ingredients against 14 major allergens to prevent reactions.</p>
          </div>
        </div>

        <button
          onClick={() => router.push("/onboarding")}
          className="btn btn-primary"
          style={{ width: "100%", fontSize: "1.2rem", padding: "16px 32px" }}
        >
          Get Started
        </button>

        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "24px" }}>
          *This system provides informational guidance only and is not a substitute for medical advice.
        </p>
      </div>
    </div>
  );
}
