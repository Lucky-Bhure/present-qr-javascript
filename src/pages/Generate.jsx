import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QRGenerator } from "@/components/QRGenerator";
import { Loader2, UserPlus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Generate = () => {
  const [formData, setFormData] = useState({
    name: "",
    roll_no: "",
    class: "",
  });
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("students")
        .insert([formData])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Error",
            description: "Roll number already exists!",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      setStudent(data);
      toast({
        title: "Success",
        description: "Student registered successfully!",
      });

      // Reset form
      setFormData({
        name: "",
        roll_no: "",
        class: "",
      });
    } catch (error) {
      console.error("Error registering student:", error);
      toast({
        title: "Error",
        description: "Failed to register student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewRegistration = () => {
    setStudent(null);
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
            <h1 className="text-3xl font-bold">Generate QR Codes</h1>
          </div>
          <p className="text-lg opacity-90">Register new students and generate their QR codes</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!student ? (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Student Registration
                </CardTitle>
                <CardDescription>
                  Enter student details to generate a unique QR code for attendance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Student Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="roll_no">Roll Number *</Label>
                      <Input
                        id="roll_no"
                        name="roll_no"
                        type="text"
                        placeholder="Enter roll number"
                        value={formData.roll_no}
                        onChange={handleInputChange}
                        required
                        className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="class">Class *</Label>
                    <Input
                      id="class"
                      name="class"
                      type="text"
                      placeholder="Enter class (e.g., 10-A, CS-101)"
                      value={formData.class}
                      onChange={handleInputChange}
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Register Student & Generate QR
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-success">Registration Successful!</CardTitle>
                  <CardDescription>
                    QR code generated for the student. You can download it below.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <div className="flex justify-center">
                <QRGenerator student={student} />
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={handleNewRegistration}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Register Another Student
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generate;