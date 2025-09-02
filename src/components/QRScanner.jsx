import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export const QRScanner = ({ onScanSuccess, onScanError }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scannerId = "qr-scanner-container";

    scannerRef.current = new Html5QrcodeScanner(
      scannerId,
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250,
        },
        aspectRatio: 1.0,
      },
      false
    );

    scannerRef.current.render(
      (decodedText) => {
        // Validate that the scanned text is a valid UUID (student ID)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(decodedText)) {
          onScanSuccess(decodedText);
        } else {
          onScanError("Invalid QR code format");
        }
      },
      (error) => {
        // Only log actual errors, not scanning states
        if (error.includes("NotFoundException")) {
          return; // Ignore "No QR code found" messages
        }
        onScanError(error);
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div className="w-full">
      <div id="qr-scanner-container" className="w-full rounded-lg overflow-hidden" />
    </div>
  );
};