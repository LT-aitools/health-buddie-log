
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Sparkle, MessageSquare, PartyPopper, Star } from "lucide-react";
import { User } from "@/lib/types";
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const gradientBg = {
    backgroundImage: "linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-10 left-10 w-32 h-32 rounded-full bg-purple-200 opacity-40 blur-xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-16 w-48 h-48 rounded-full bg-pink-200 opacity-50 blur-xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-blue-200 opacity-40 blur-xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <motion.div 
        className="w-full max-w-md z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <div className="mx-auto flex items-center justify-center mb-4">
            <div className="relative">
              <div className="bg-primary text-white h-16 w-16 flex items-center justify-center rounded-full">
                <MessageSquare className="h-8 w-8" />
              </div>
              <motion.div 
                className="absolute -top-2 -right-2 bg-purple-500 text-white h-8 w-8 flex items-center justify-center rounded-full"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <Sparkle className="h-5 w-5" />
              </motion.div>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent" style={gradientBg}>HealthBuddie</h1>
          <p className="text-muted-foreground mt-2">Your personal health tracking assistant</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="w-full border-2 border-purple-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                {step === "phone" ? "Sign Up / Sign In" : "Verify Phone Number"}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                >
                  <Star className="w-5 h-5 text-yellow-400" />
                </motion.div>
              </CardTitle>
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
                        className="rounded-l-none focus:ring-purple-500 focus:border-purple-500"
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
                      className="focus:ring-purple-500 focus:border-purple-500 text-center text-xl tracking-widest"
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
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" 
                onClick={step === "phone" ? handleSendVerification : handleVerifyCode}
                disabled={isLoading || (step === "phone" ? !isValidIsraeliPhone(phoneNumber) : verificationCode.length !== 6)}
              >
                {isLoading 
                  ? "Processing..." 
                  : step === "phone" 
                    ? "Continue" 
                    : "Verify & Sign In"
                }
                {!isLoading && step === "verification" && (
                  <PartyPopper className="ml-2 h-4 w-4" />
                )}
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
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;
