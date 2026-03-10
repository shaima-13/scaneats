"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore, ALERGENS_LIST } from "@/lib/store/userStore";
import { Check, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const { isDiabetic, setIsDiabetic, allergies, toggleAllergy, setHasCompletedOnboarding } = useUserStore();

    const handleComplete = () => {
        setHasCompletedOnboarding(true);
        router.push("/dashboard");
    };

    return (
        <div className="container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div className="glass-panel animate-fade-in" style={{ maxWidth: "500px", width: "100%" }}>

                {/* Progress Tracker */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "32px", justifyContent: "center" }}>
                    <div style={{ height: "4px", flex: 1, backgroundColor: step >= 1 ? "var(--primary)" : "var(--bg-card)", borderRadius: "2px", transition: "all 0.3s" }} />
                    <div style={{ height: "4px", flex: 1, backgroundColor: step >= 2 ? "var(--primary)" : "var(--bg-card)", borderRadius: "2px", transition: "all 0.3s" }} />
                </div>

                {step === 1 && (
                    <div className="animate-slide-up">
                        <h2 style={{ fontSize: "2rem", marginBottom: "16px", textAlign: "center" }}>Health Profile</h2>
                        <p style={{ color: "var(--text-muted)", marginBottom: "32px", textAlign: "center" }}>
                            Are you monitoring your sugar intake for diabetes? We'll tailor the ingredient warnings for you.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
                            <button
                                className="btn btn-secondary"
                                style={{ justifyContent: "flex-start", padding: "20px", border: isDiabetic ? "2px solid var(--primary)" : "2px solid transparent" }}
                                onClick={() => setIsDiabetic(true)}
                            >
                                <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid var(--text-muted)", marginRight: "16px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: isDiabetic ? "var(--primary)" : "transparent", borderColor: isDiabetic ? "var(--primary)" : "var(--text-muted)" }}>
                                    {isDiabetic && <Check size={16} color="#fff" />}
                                </div>
                                <div style={{ textAlign: "left" }}>
                                    <div style={{ fontWeight: 600 }}>Yes, I track my sugar</div>
                                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>Alert me about high sugar and hidden carbs</div>
                                </div>
                            </button>

                            <button
                                className="btn btn-secondary"
                                style={{ justifyContent: "flex-start", padding: "20px", border: !isDiabetic ? "2px solid var(--primary)" : "2px solid transparent" }}
                                onClick={() => setIsDiabetic(false)}
                            >
                                <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid var(--text-muted)", marginRight: "16px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: !isDiabetic ? "var(--primary)" : "transparent", borderColor: !isDiabetic ? "var(--primary)" : "var(--text-muted)" }}>
                                    {!isDiabetic && <Check size={16} color="#fff" />}
                                </div>
                                <div style={{ textAlign: "left" }}>
                                    <div style={{ fontWeight: 600 }}>No, I don't</div>
                                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>Standard nutritional information is fine</div>
                                </div>
                            </button>
                        </div>

                        <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setStep(2)}>
                            Continue <ArrowRight size={18} style={{ marginLeft: "8px" }} />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-slide-up">
                        <h2 style={{ fontSize: "2rem", marginBottom: "16px", textAlign: "center" }}>Dietary Allergies</h2>
                        <p style={{ color: "var(--text-muted)", marginBottom: "24px", textAlign: "center" }}>
                            Select any ingredients you are allergic or sensitive to. You can always change this later.
                        </p>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "32px", maxHeight: "40vh", overflowY: "auto", paddingRight: "8px" }}>
                            {ALERGENS_LIST.map((allergen) => {
                                const isSelected = allergies.includes(allergen);
                                return (
                                    <button
                                        key={allergen}
                                        className="btn btn-secondary"
                                        style={{
                                            padding: "16px 12px",
                                            justifyContent: "center",
                                            backgroundColor: isSelected ? "var(--primary-bg)" : "var(--bg-card)",
                                            border: isSelected ? "1px solid var(--primary)" : "1px solid var(--border-color)",
                                            color: isSelected ? "var(--primary)" : "var(--text-main)",
                                        }}
                                        onClick={() => toggleAllergy(allergen)}
                                    >
                                        {allergen}
                                    </button>
                                );
                            })}
                        </div>

                        <div style={{ display: "flex", gap: "16px" }}>
                            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setStep(1)}>
                                Back
                            </button>
                            <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleComplete}>
                                Complete Profile
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
