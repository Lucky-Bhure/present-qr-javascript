import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const QRGenerator = ({ student }) => {
  const canvasRef = useRef(null);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    generateQRCode();
  }, [student]);

  const generateQRCode = async () => {
    if (!canvasRef.current) return;

    try {
      // Generate QR code with just the student ID
      await QRCode.toCanvas(canvasRef.current, student.id, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      // Also generate data URL for download
      const dataUrl = await QRCode.toDataURL(student.id, {
        width: 512,
        margin: 2,
      });
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    }
  };

  const downloadQRCode = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.download = `${student.name}_${student.roll_no}_QR.png`;
    link.href = qrDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded",
      description: "QR code downloaded successfully!",
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-card rounded-lg border shadow-lg">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <canvas ref={canvasRef} className="border rounded" />
      </div>
      
      <div className="text-center">
        <h3 className="font-semibold text-lg">{student.name}</h3>
        <p className="text-muted-foreground">Roll No: {student.roll_no}</p>
        <p className="text-muted-foreground">Class: {student.class}</p>
      </div>

      <Button 
        onClick={downloadQRCode} 
        disabled={!qrDataUrl}
        className="w-full bg-success hover:bg-success/90 text-success-foreground"
      >
        <Download className="mr-2 h-4 w-4" />
        Download QR Code
      </Button>
    </div>
  );
};