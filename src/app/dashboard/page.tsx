"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import Scanner from "@/components/Scanner";
import { User, Activity, AlertTriangle, LogOut } from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();
    const { hasCompletedOnboarding, isDiabetic, allergies, resetProfile } = useUserStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!hasCompletedOnboarding) {
            router.push("/onboarding");
        }
    }, [hasCompletedOnboarding, router]);

    const handleScan = (barcode: string) => {
        // Navigate to results page with the scanned barcode
        router.push(`/result/${barcode}`);
    };

    const handleSignOut = () => {
        resetProfile();
        router.push("/");
    };

    if (!mounted || !hasCompletedOnboarding) return null;

    return (
        <div className="container" style={{ padding: "40px 20px" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                <div>
                    <h1 style={{ fontSize: "2rem" }}>Dashboard</h1>
                    <p style={{ color: "var(--text-muted)" }}>Scan products to check their safety.</p>
                </div>
                <button onClick={handleSignOut} className="btn btn-secondary" style={{ padding: "8px 16px", fontSize: "0.9rem" }}>
                    <LogOut size={16} style={{ marginRight: "8px" }} /> Reset Profile
                </button>
            </header>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px", maxWidth: "800px", margin: "0 auto" }}>

                {/* Profile Summary Card */}
                <div className="glass-panel animate-slide-up" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>
                        <User size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Active Health Profile</h2>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
                        <div style={{ flex: 1, minWidth: "200px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--text-muted)" }}>
                                <Activity size={16} /> Diabetic Tracking
                            </div>
                            <div style={{ fontWeight: 600, color: isDiabetic ? "var(--caution)" : "var(--safe)" }}>
                                {isDiabetic ? "Enabled - Monitoring Sugars" : "Disabled"}
                            </div>
                        </div>

                        <div style={{ flex: 2, minWidth: "200px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--text-muted)" }}>
                                <AlertTriangle size={16} /> Active Allergies
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                {allergies.length > 0 ? (
                                    allergies.map(a => (
                                        <span key={a} style={{ background: "var(--danger-bg)", color: "var(--danger)", padding: "4px 12px", borderRadius: "100px", fontSize: "0.85rem", fontWeight: 600 }}>
                                            {a}
                                        </span>
                                    ))
                                ) : (
                                    <span style={{ color: "var(--safe)", fontWeight: 600 }}>No allergies selected</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scanner Component */}
                <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                    <h2 style={{ fontSize: "1.25rem", marginBottom: "16px" }}>Scan Product</h2>
                    <Scanner onScan={handleScan} />
                </div>

            </div>
        </div>
    );
}
