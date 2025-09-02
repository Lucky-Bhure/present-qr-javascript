import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRScanner } from "@/components/QRScanner";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Camera, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Scan = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [recentAttendance, setRecentAttendance] = useState([]);

  const handleScanSuccess = async (studentId) => {
    try {
      // First, get student details
      const { data: student, error: studentError } = await supabase
        .from("students")
        .select("name, roll_no, class")
        .eq("id", studentId)
        .single();

      if (studentError) {
        toast({
          title: "Error",
          description: "Student not found in database",
          variant: "destructive",
        });
        return;
      }

      // Check if attendance already marked today
      const today = new Date().toISOString().split("T")[0];
      const { data: existingAttendance } = await supabase
        .from("attendance")
        .select("id")
        .eq("student_id", studentId)
        .eq("date", today)
        .single();

      if (existingAttendance) {
        toast({
          title: "Already Marked",
          description: `Attendance already marked for ${student.name} today`,
          variant: "warning",
        });
        return;
      }

      // Mark attendance
      const { error: attendanceError } = await supabase
        .from("attendance")
        .insert([
          {
            student_id: studentId,
            date: today,
            timestamp: new Date().toISOString(),
            status: "present",
          },
        ]);

      if (attendanceError) {
        throw attendanceError;
      }

      // Add to recent attendance
      const newRecord = {
        student,
        timestamp: new Date().toISOString(),
      };

      setRecentAttendance(prev => [newRecord, ...prev.slice(0, 4)]);

      toast({
        title: "Attendance Marked",
        description: `Present: ${student.name} (${student.roll_no})`,
        variant: "success",
      });

    } catch (error) {
      console.error("Error marking attendance:", error);
      toast({
        title: "Error",
        description: "Failed to mark attendance. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleScanError = (error) => {
    console.error("Scan error:", error);
    if (!error.includes("NotFoundException")) {
      toast({
        title: "Scan Error",
        description: error,
        variant: "destructive",
      });
    }
  };

  const startScanning = () => {
    setIsScanning(true);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-4">
            <Link to="/" className="mr-4">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Scan QR Codes</h1>
          </div>
          <p className="text-lg opacity-90">Scan student QR codes to mark attendance</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-2">
          {/* Scanner Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="mr-2 h-5 w-5" />
                QR Code Scanner
              </CardTitle>
              <CardDescription>
                Position the QR code within the scanner frame to mark attendance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isScanning ? (
                <div className="text-center py-8">
                  <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    Click the button below to start scanning QR codes
                  </p>
                  <Button 
                    onClick={startScanning}
                    className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Start Scanner
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <QRScanner 
                    onScanSuccess={handleScanSuccess}
                    onScanError={handleScanError}
                  />
                  <Button 
                    onClick={stopScanning}
                    variant="outline"
                    className="w-full"
                  >
                    Stop Scanner
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Attendance */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-success" />
                Recent Attendance
              </CardTitle>
              <CardDescription>
                Recently scanned students for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentAttendance.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No attendance marked yet today
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAttendance.map((record, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20"
                    >
                      <div>
                        <p className="font-medium">{record.student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.student.roll_no} - {record.student.class}
                        </p>
                      </div>
                      <div className="text-right">
                        <CheckCircle className="h-5 w-5 text-success mb-1" />
                        <p className="text-xs text-muted-foreground">
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>Scanning Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-1">Start Scanner</h3>
                <p className="text-sm text-muted-foreground">Click the start scanner button to activate camera</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-1">Position QR Code</h3>
                <p className="text-sm text-muted-foreground">Place student QR code within the scanner frame</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-success font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-1">Attendance Marked</h3>
                <p className="text-sm text-muted-foreground">System automatically marks attendance when QR is detected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Scan;