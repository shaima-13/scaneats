"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { fetchProductByBarcode, ProductData } from "@/lib/api/openFoodFacts";
import { analyzeProduct, AnalysisResult } from "@/lib/rules/engine";
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, Info, Beaker } from "lucide-react";

export default function ResultPage() {
    const params = useParams();
    const router = useRouter();
    const barcode = params.barcode as string;
    const userProfile = useUserStore();

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<ProductData | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

    useEffect(() => {
        if (!userProfile.hasCompletedOnboarding) {
            router.push("/onboarding");
            return;
        }

        async function loadData() {
            setLoading(true);
            const data = await fetchProductByBarcode(barcode);
            if (data) {
                setProduct(data);
                const res = analyzeProduct(data, userProfile);
                setAnalysis(res);
            }
            setLoading(false);
        }
        loadData();
    }, [barcode, userProfile, router]);

    const getStatusIcon = (status?: string) => {
        if (status === 'Safe') return <CheckCircle size={64} color="var(--safe)" />;
        if (status === 'Caution') return <AlertTriangle size={64} color="var(--caution)" />;
        if (status === 'Danger') return <XCircle size={64} color="var(--danger)" />;
        return <Info size={64} color="var(--text-muted)" />;
    };

    const getStatusColor = (status?: string) => {
        if (status === 'Safe') return "var(--safe)";
        if (status === 'Caution') return "var(--caution)";
        if (status === 'Danger') return "var(--danger)";
        return "var(--text-main)";
    };

    const getStatusBg = (status?: string) => {
        if (status === 'Safe') return "var(--safe-bg)";
        if (status === 'Caution') return "var(--caution-bg)";
        if (status === 'Danger') return "var(--danger-bg)";
        return "var(--bg-card)";
    };

    if (loading) {
        return (
            <div className="container" style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <div className="spinner" style={{ width: "48px", height: "48px" }}></div>
                <p style={{ marginTop: "16px", color: "var(--text-muted)" }}>Analyzing product data...</p>
            </div>
        );
    }

    if (!product || !analysis) {
        return (
            <div className="container" style={{ padding: "40px 20px", textAlign: "center" }}>
                <XCircle size={48} color="var(--danger)" style={{ marginBottom: "16px" }} />
                <h1>Product Not Found</h1>
                <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>We couldn't find data for barcode: {barcode}</p>
                <button className="btn btn-primary" onClick={() => router.push("/dashboard")}>
                    <ArrowLeft size={16} style={{ marginRight: "8px" }} /> Back to Dashboard
                </button>
            </div>
        );
    }

    const p = product.product;
    const isFallback = product.status_verbose === "product found locally";

    return (
        <div className="container" style={{ padding: "40px 20px" }}>
            <button
                className="btn btn-outline"
                style={{ marginBottom: "24px", border: "none", padding: "8px 0" }}
                onClick={() => router.push("/dashboard")}
            >
                <ArrowLeft size={18} style={{ marginRight: "8px" }} /> Back
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px", maxWidth: "800px", margin: "0 auto" }}>

                {/* Top Status Card */}
                <div className="glass-panel animate-slide-up" style={{ textAlign: "center", backgroundColor: getStatusBg(analysis.status), borderColor: getStatusColor(analysis.status) }}>
                    <div style={{ marginBottom: "16px" }}>{getStatusIcon(analysis.status)}</div>
                    <h1 style={{ fontSize: "2.5rem", color: getStatusColor(analysis.status), marginBottom: "8px" }}>
                        {analysis.status}
                    </h1>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>{p.product_name || "Unknown Product"}</h2>
                    <p style={{ color: "var(--text-muted)" }}>{p.brands || "Unknown Brand"}</p>
                </div>

                {/* Warnings Card */}
                {analysis.warnings.length > 0 && (
                    <div className="glass-panel animate-slide-up" style={{ animationDelay: "0.1s", borderLeft: `4px solid ${getStatusColor(analysis.status)}` }}>
                        <h3 style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                            <AlertTriangle size={20} color={getStatusColor(analysis.status)} /> Safety Alerts
                        </h3>
                        <ul style={{ listStylePosition: "inside", padding: 0 }}>
                            {analysis.warnings.map((w, i) => (
                                <li key={i} style={{ marginBottom: "8px", color: "var(--text-main)", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                                    <XCircle size={16} color="var(--danger)" style={{ marginTop: "4px", flexShrink: 0 }} />
                                    <span>{w}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Nutrition Info */}
                <div className="glass-panel animate-slide-up" style={{ animationDelay: "0.2s" }}>
                    <h3 style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                        <Beaker size={20} color="var(--primary)" /> Nutritional Breakdown (per 100g)
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div style={{ padding: "16px", backgroundColor: "var(--bg-card)", borderRadius: "var(--radius-md)" }}>
                            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "4px" }}>Total Sugars</div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: analysis.sugarPer100g > 10 ? "var(--caution)" : "var(--safe)" }}>
                                {`${analysis.sugarPer100g.toFixed(1)}g`}
                            </div>
                        </div>
                        <div style={{ padding: "16px", backgroundColor: "var(--bg-card)", borderRadius: "var(--radius-md)" }}>
                            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "4px" }}>Total Carbohydrates</div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: analysis.carbsPer100g > 30 ? "var(--caution)" : "var(--safe)" }}>
                                {`${analysis.carbsPer100g.toFixed(1)}g`}
                            </div>
                        </div>
                    </div>

                    {p.ingredients_text && (
                        <div style={{ marginTop: "24px" }}>
                            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "8px" }}>Ingredients List</div>
                            <p style={{ fontSize: "0.9rem", lineHeight: "1.6", color: "var(--text-main)" }}>
                                {p.ingredients_text}
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div >
    );
}
