import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, ScanLine, ClipboardList, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">QR Attendance System</h1>
          <p className="text-xl opacity-90">Modern student attendance tracking with QR codes</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {/* Generate QR Codes */}
          <Card className="text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader>
              <QrCode className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Generate QR Codes</CardTitle>
              <CardDescription>
                Register new students and generate their unique QR codes for attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/generate">
                <Button className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300">
                  Start Registration
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Scan QR Codes */}
          <Card className="text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader>
              <ScanLine className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Scan QR Codes</CardTitle>
              <CardDescription>
                Scan student QR codes to mark attendance quickly and efficiently
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/scan">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                  Start Scanning
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* View Attendance */}
          <Card className="text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader>
              <ClipboardList className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>View Attendance</CardTitle>
              <CardDescription>
                View detailed attendance records and generate reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/attendance">
                <Button variant="secondary" className="w-full transition-all duration-300">
                  View Records
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose QR Attendance?</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Quick & Easy</h3>
              <p className="text-sm text-muted-foreground">Generate QR codes instantly for students</p>
            </div>
            
            <div className="flex flex-col items-center p-6">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <ScanLine className="h-8 w-8 text-success" />
              </div>
              <h3 className="font-semibold mb-2">Fast Scanning</h3>
              <p className="text-sm text-muted-foreground">Mark attendance in seconds with camera scan</p>
            </div>
            
            <div className="flex flex-col items-center p-6">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mb-4">
                <ClipboardList className="h-8 w-8 text-warning" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Reports</h3>
              <p className="text-sm text-muted-foreground">View attendance data instantly</p>
            </div>
            
            <div className="flex flex-col items-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Student Management</h3>
              <p className="text-sm text-muted-foreground">Organize students by class and roll number</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;