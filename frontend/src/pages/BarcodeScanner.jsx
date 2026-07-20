import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ScanLine } from "lucide-react";
import "../styles/barcode.css";

export default function BarcodeScanner() {

    const navigate = useNavigate();
    const scannerRef = useRef(null);

    useEffect(() => {

        const scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;

        scanner.start(
            {
                facingMode: "environment"
            },
            {
                fps: 10,
                qrbox: {
                    width: 420,
                    height: 140
                },
                aspectRatio: 1.777,
            },

            (decodedText) => {

                scanner.stop().then(() => {

                    navigate("/inventory/add", {
                        state: {
                            barcode: decodedText
                        }
                    });

                });

            },

            () => {}

        );

        return () => {

            if (
                scannerRef.current &&
                scannerRef.current.isScanning
            ) {

                scannerRef.current.stop().catch(() => {});

            }

        };

    }, []);

    return (

        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">

            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-4xl">

                <div className="flex items-center justify-between mb-8">

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-black"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>

                    <h1 className="text-3xl font-bold flex items-center gap-2">

                        <ScanLine className="text-green-600"/>

                        Scan Product Barcode

                    </h1>

                    <div></div>

                </div>

                <p className="text-gray-500 text-center mb-8">

                    Hold the barcode inside the guide.

                    The scanner will automatically detect it.

                </p>

                <div className="relative rounded-3xl overflow-hidden shadow-2xl">

                    <div
                        id="reader"
                        className="w-full h-[500px]"
                    />

                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">

                        <div className="scan-box">

                            <div className="corner top-left"></div>
                            <div className="corner top-right"></div>
                            <div className="corner bottom-left"></div>
                            <div className="corner bottom-right"></div>

                            <div className="scan-line"></div>

                        </div>

                    </div>
                </div>

                <div className="flex gap-4 mt-6">

                    <span className="w-40 flex items-center text-green-600 font-medium">

                        ● Camera Active

                    </span>

                    <button

                        onClick={() => navigate(-1)}

                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold"

                    >

                        Cancel

                    </button>

                    <button
                        type="button"
                        onClick={() => {

                            navigate("/inventory/add");

                        }}
                        className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold"
                    >
                        ⌨️ Enter Barcode Manually
                    </button>

                </div>

            </div>

        </div>

    );

}