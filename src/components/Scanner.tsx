"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Camera, Keyboard } from "lucide-react";

interface ScannerProps {
    onScan: (barcode: string) => void;
}

export default function Scanner({ onScan }: ScannerProps) {
    const [isManual, setIsManual] = useState(false);
    const [manualCode, setManualCode] = useState("");
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const onScanRef = useRef(onScan);

    useEffect(() => {
        onScanRef.current = onScan;
    }, [onScan]);

    useEffect(() => {
        if (isManual) return;

        let isMounted = true;

        // Delay to prevent React 18 strict mode double-invocations
        const timeoutId = setTimeout(() => {
            if (!isMounted) return;

            // Ensure the container exists before initializing
            const el = document.getElementById("qr-reader");
            if (!el) return;

            scannerRef.current = new Html5QrcodeScanner(
                "qr-reader",
                {
                    fps: 20, // Increased FPS for faster sampling on mobile
                    qrbox: { width: 350, height: 150 }, // Wider horizontal box for 1D barcodes
                    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
                    rememberLastUsedCamera: true,
                    videoConstraints: {
                        facingMode: "environment", // Force rear camera
                        width: { min: 640, ideal: 1920, max: 1920 }, // High resolution priority
                        height: { min: 480, ideal: 1080, max: 1080 }
                    },
                    formatsToSupport: [
                        Html5QrcodeSupportedFormats.EAN_13,
                        Html5QrcodeSupportedFormats.EAN_8,
                        Html5QrcodeSupportedFormats.UPC_A,
                        Html5QrcodeSupportedFormats.UPC_E,
                        Html5QrcodeSupportedFormats.CODE_128,
                        Html5QrcodeSupportedFormats.CODE_39,
                        Html5QrcodeSupportedFormats.QR_CODE
                    ]
                },
                /* verbose= */ false
            );

            scannerRef.current.render(
                (decodedText) => {
                    // Let the React unmount cleanup handle stopping the hardware.
                    // Doing it prematurely here crashes html5-qrcode.
                    if (scannerRef.current) {
                        try {
                            scannerRef.current.pause(true);
                        } catch (e) {
                            console.error("Pause catch err:", e);
                        }
                    }
                    onScanRef.current(decodedText);
                },
                (error) => {
                    // Ignore frequent scanning errors
                }
            );
        }, 50);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
            if (scannerRef.current) {
                try {
                    scannerRef.current.clear().catch(e => console.error("Cleanup clear err:", e));
                } catch (e) {
                    console.error("Cleanup clear catch err:", e);
                }
                scannerRef.current = null;
            }
        };
    }, [isManual]);

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualCode.trim()) {
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
                    <div>
                        <div id="qr-reader" style={{ width: "100%", borderRadius: "var(--radius-md)", overflow: "hidden" }}></div>
                        <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "16px" }}>
                            Point your camera at a product barcode (EAN/UPC).
                        </p>
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

            <style>{`
        /* Overriding html5-qrcode default ugly styles */
        #qr-reader {
          border: 2px dashed var(--border-color) !important;
          background: var(--bg-card);
        }
        #qr-reader__scan_region {
          background: black;
        }
        #qr-reader__dashboard_section_csr span {
          color: var(--text-main) !important;
          font-family: inherit !important;
        }
        #qr-reader button {
          background: var(--primary) !important;
          color: white !important;
          border: none !important;
          padding: 8px 16px !important;
          border-radius: var(--radius-md) !important;
          cursor: pointer !important;
          font-family: inherit !important;
          font-weight: 500 !important;
          margin-top: 12px;
        }
        #qr-reader select {
          background: var(--bg-main) !important;
          color: white !important;
          border: 1px solid var(--border-color) !important;
          padding: 8px !important;
          border-radius: var(--radius-md) !important;
          font-family: inherit !important;
          margin-bottom: 8px;
        }
        #qr-reader__has_camera a {
          color: var(--primary) !important;
        }
      `}</style>
        </div>
    );
}
