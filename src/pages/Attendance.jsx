import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CalendarDays, Users, RefreshCw, Download, ArrowLeft, Search } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select(`
          id,
          timestamp,
          status,
          students (
            name,
            roll_no,
            class
          )
        `)
        .eq("date", selectedDate)
        .order("timestamp", { ascending: false });

      if (error) {
        throw error;
      }

      const formattedData = data.map(record => ({
        id: record.id,
        timestamp: record.timestamp,
        status: record.status,
        student: {
          name: record.students?.name || "Unknown",
          roll_no: record.students?.roll_no || "N/A",
          class: record.students?.class || "N/A",
        },
      }));

      setAttendanceRecords(formattedData);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast({
        title: "Error",
        description: "Failed to fetch attendance records",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAttendance();
    toast({
      title: "Refreshed",
      description: "Attendance records updated",
    });
  };

  const exportToCSV = () => {
    if (attendanceRecords.length === 0) {
      toast({
        title: "No Data",
        description: "No attendance records to export",
        variant: "warning",
      });
      return;
    }

    const headers = ["Student Name", "Roll Number", "Class", "Time", "Status"];
    const csvContent = [
      headers.join(","),
      ...attendanceRecords.map(record => [
        `"${record.student.name}"`,
        record.student.roll_no,
        `"${record.student.class}"`,
        new Date(record.timestamp).toLocaleTimeString(),
        record.status
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance_${selectedDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Exported",
      description: "Attendance data exported to CSV",
    });
  };

  const filteredRecords = attendanceRecords.filter(record =>
    record.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.student.roll_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.student.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "present":
        return "default"; // Will use success color from our design system
      case "absent":
        return "destructive";
      case "late":
        return "secondary";
      default:
        return "outline";
    }
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
            <h1 className="text-3xl font-bold">Attendance Records</h1>
          </div>
          <p className="text-lg opacity-90">View and manage student attendance data</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Present</p>
                  <p className="text-2xl font-bold">{filteredRecords.filter(r => r.status === "present").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CalendarDays className="h-8 w-8 text-warning" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Selected Date</p>
                  <p className="text-2xl font-bold">{new Date(selectedDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <RefreshCw className="h-8 w-8 text-success" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-lg font-bold">{new Date().toLocaleTimeString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Filters & Actions</CardTitle>
            <CardDescription>
              Filter attendance records and export data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-1">
                <Label htmlFor="date">Select Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="flex-1">
                <Label htmlFor="search">Search Students</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search by name, roll number, or class..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                
                <Button 
                  onClick={exportToCSV}
                  className="bg-success hover:bg-success/90 text-success-foreground"
                  disabled={filteredRecords.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Attendance List</CardTitle>
            <CardDescription>
              {filteredRecords.length} records found for {new Date(selectedDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading attendance records...</span>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">No attendance records found</p>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? "Try adjusting your search criteria" 
                    : "No students have marked attendance for this date"
                  }
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{record.student.name}</TableCell>
                        <TableCell>{record.student.roll_no}</TableCell>
                        <TableCell>{record.student.class}</TableCell>
                        <TableCell>{new Date(record.timestamp).toLocaleTimeString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={getStatusBadgeVariant(record.status)}
                            className={record.status === "present" ? "bg-success text-success-foreground" : ""}
                          >
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Attendance;