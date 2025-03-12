
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { PhoneIcon, MessageSquare } from "lucide-react";
import { User } from "@/lib/types";

const Auth = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"phone" | "verification">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendVerification = () => {
    // In a real app, this would call an API to send a verification code
    // For this demo, we'll simulate it
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setStep("verification");
      
      toast({
        title: "Verification Code Sent",
        description: `A verification code has been sent to ${phoneNumber}. For this demo, use "123456".`,
      });
    }, 1500);
  };

  const handleVerifyCode = () => {
    // In a real app, this would call an API to verify the code
    // For this demo, we'll simulate it with a hardcoded code
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (verificationCode === "123456") {
        // Create a mock user and store in localStorage
        const user: User = {
          id: `user-${Date.now()}`,
          phoneNumber,
          createdAt: new Date(),
          lastActive: new Date(),
          verified: true
        };
        
        localStorage.setItem("healthBuddieUser", JSON.stringify(user));
        
        toast({
          title: "Successfully Signed In",
          description: "You are now connected to HealthBuddie. You can send messages from any device!",
        });
        
        navigate("/messages");
      } else {
        toast({
          title: "Invalid Code",
          description: "The verification code you entered is incorrect. Please try again.",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  const formatIsraeliPhoneNumber = (value: string) => {
    // Strip all non-numeric characters
    const phoneDigits = value.replace(/\D/g, "");
    
    // Format as 05X-XXX-XXXX for Israeli numbers
    if (phoneDigits.length <= 3) {
      return phoneDigits;
    } else if (phoneDigits.length <= 6) {
      return `${phoneDigits.slice(0, 3)}-${phoneDigits.slice(3)}`;
    } else {
      return `${phoneDigits.slice(0, 3)}-${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatIsraeliPhoneNumber(e.target.value);
    setPhoneNumber(formattedNumber);
  };

  // Check if the Israeli phone number is valid
  const isValidIsraeliPhone = (phone: string) => {
    // Simple validation for Israeli mobile numbers starting with 05
    const digitsOnly = phone.replace(/\D/g, "");
    return digitsOnly.length >= 9 && digitsOnly.length <= 10 && digitsOnly.startsWith("05");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto bg-primary text-white h-16 w-16 flex items-center justify-center rounded-full mb-4">
            <MessageSquare className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">HealthBuddie</h1>
          <p className="text-muted-foreground mt-2">Your personal health tracking assistant</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>{step === "phone" ? "Sign Up / Sign In" : "Verify Phone Number"}</CardTitle>
            <CardDescription>
              {step === "phone" 
                ? "Enter your phone number to get started" 
                : "Enter the verification code sent to your phone"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "phone" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex">
                    <div className="bg-secondary flex items-center justify-center px-3 rounded-l-md border-y border-l border-input">
                      <span className="text-sm text-muted-foreground">+972</span>
                    </div>
                    <Input
                      id="phone"
                      className="rounded-l-none"
                      placeholder="05X-XXX-XXXX"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We'll send a verification code to this Israeli number
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                  />
                  <p className="text-sm text-muted-foreground">
                    For this demo, use the code "123456"
                  </p>
                </div>
                <p className="text-sm text-primary">Code sent to: +972 {phoneNumber}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              className="w-full" 
              onClick={step === "phone" ? handleSendVerification : handleVerifyCode}
              disabled={isLoading || (step === "phone" ? !isValidIsraeliPhone(phoneNumber) : verificationCode.length !== 6)}
            >
              {isLoading 
                ? "Processing..." 
                : step === "phone" 
                  ? "Continue" 
                  : "Verify & Sign In"
              }
            </Button>
            
            {step === "verification" && (
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => setStep("phone")}
              >
                Change Phone Number
              </Button>
            )}
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              By continuing, you agree to receive SMS messages from HealthBuddie
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
