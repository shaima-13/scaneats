"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { Camera, Keyboard } from "lucide-react";

interface ScannerProps {
    onScan: (barcode: string) => void;
}

export default function Scanner({ onScan }: ScannerProps) {
    const [isManual, setIsManual] = useState(false);
    const [manualCode, setManualCode] = useState("");
    const [debugLog, setDebugLog] = useState<string>("Initializing...");
    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsRef = useRef<IScannerControls | null>(null);
    const hasScannedRef = useRef(false);
    const onScanRef = useRef(onScan);

    useEffect(() => {
        onScanRef.current = onScan;
    }, [onScan]);

    useEffect(() => {
        if (isManual) return;
        hasScannedRef.current = false;
        setDebugLog("Component mounted, initiating ZXing...");

        const codeReader = new BrowserMultiFormatReader();

        const startScanning = async () => {
            if (!videoRef.current) return;
            try {
                setDebugLog("Requesting stream (environment)...");

                // Some browsers (iOS Safari) do not provide device IDs until permission is granted via constraints.
                // Requesting standard constraints allows the browser to natively prompt the user for permission.
                controlsRef.current = await codeReader.decodeFromConstraints(
                    {
                        audio: false,
                        video: {
                            facingMode: "environment"
                        }
                    },
                    videoRef.current,
                    (result, error) => {
                        if (result && !hasScannedRef.current) {
                            console.log("Scanned successfully:", result.getText());
                            hasScannedRef.current = true;
                            if (controlsRef.current) {
                                controlsRef.current.stop();
                            }
                            onScanRef.current(result.getText());
                        }
                        if (error && error.name !== 'NotFoundException') {
                            console.debug("Scan error:", error);
                        }
                    }
                );
                setDebugLog("Camera started successfully.");
            } catch (err: any) {
                console.error("Camera access failed:", err);
                setDebugLog(`Error: ${err?.name || 'Unknown'} - ${err?.message || String(err)}`);
            }
        };

        startScanning();

        return () => {
            console.log("Scanner component unmounting, stopping ZXing...", !!controlsRef.current);
            if (controlsRef.current) {
                controlsRef.current.stop();
            }
        };
    }, [isManual]);

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualCode.trim() && !hasScannedRef.current) {
            hasScannedRef.current = true;
            onScan(manualCode.trim());
        }
    };

    return (
        <div className="glass-panel" style={{ padding: "0", overflow: "hidden" }}>
            <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)" }}>
                <button
                    onClick={() => setIsManual(false)}
                    style={{
                        flex: 1, padding: "16px", background: !isManual ? "var(--glass-border)" : "transparent",
                        border: "none", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontFamily: "inherit", fontWeight: 600
                    }}
                >
                    <Camera size={18} /> Camera Scan
                </button>
                <button
                    onClick={() => setIsManual(true)}
                    style={{
                        flex: 1, padding: "16px", background: isManual ? "var(--glass-border)" : "transparent",
                        border: "none", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontFamily: "inherit", fontWeight: 600
                    }}
                >
                    <Keyboard size={18} /> Manual Entry
                </button>
            </div>

            <div style={{ padding: "24px" }}>
                {!isManual ? (
                    <div style={{ position: "relative" }}>
                        <video
                            ref={videoRef}
                            playsInline
                            muted
                            autoPlay
                            style={{
                                width: "100%",
                                height: "300px",
                                borderRadius: "var(--radius-md)",
                                backgroundColor: "black",
                                objectFit: "cover"
                            }}
                        />
                        {/* Fake scanner reticle for UX */}
                        <div style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "250px",
                            height: "150px",
                            border: "2px dashed rgba(255,255,255,0.5)",
                            borderRadius: "12px",
                            pointerEvents: "none"
                        }}></div>

                        <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "16px" }}>
                            Point your camera clearly at a product barcode.
                        </p>
                        {debugLog && (
                            <div style={{ padding: "8px", marginTop: "12px", background: "rgba(0,0,0,0.5)", borderRadius: "8px", color: "#ff8c8c", fontSize: "0.8rem", textAlign: "center", fontFamily: "monospace", wordBreak: "break-all" }}>
                                {debugLog}
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleManualSubmit} className="animate-fade-in">
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>Enter Barcode Details</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="e.g. 5449000000996"
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value)}
                            style={{ marginBottom: "16px" }}
                            autoFocus
                        />
                        <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                            Lookup Product
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
