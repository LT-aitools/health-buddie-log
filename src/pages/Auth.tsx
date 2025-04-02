import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkle, MessageSquare, PartyPopper, Star, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get the redirect path from location state, or default to "/"
  const from = (location.state as any)?.from?.pathname || "/";

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from);
    }
  }, [isAuthenticated, navigate, from]);

  const validatePhoneNumber = (number: string): boolean => {
    // Simple validation to ensure the number is not empty and has reasonable length
    const cleanedNumber = number.replace(/\D/g, "");
    return cleanedNumber.length >= 10 && cleanedNumber.length <= 15;
  };

  const handleLogin = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your phone number to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number with country code.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Clean up the phone number - remove spaces, dashes, etc.
      const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");
      
      // Make sure it's a full phone number with country code
      const formattedNumber = cleanedPhoneNumber.startsWith("+") 
        ? cleanedPhoneNumber 
        : `+${cleanedPhoneNumber}`;
      
      console.log('Attempting login with formatted number:', formattedNumber);
      
      await login(formattedNumber);
      
      toast({
        title: "Successfully Signed In",
        description: "You are now connected to HealthBuddie. You can send messages from any device!",
      });
      
      // Navigate to the page they were trying to access, or to the dashboard
      navigate(from);
    } catch (err: any) {
      console.error('Login error:', err);
      toast({
        title: "Login Failed",
        description: err.message || "There was a problem logging in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Strip all non-numeric characters except for leading +
    let phoneDigits = value.replace(/[^\d+]/g, "");
    
    // If it doesn't start with +, assume it's a local number and add +
    if (!phoneDigits.startsWith("+")) {
      phoneDigits = `+${phoneDigits}`;
    }
    
    return phoneDigits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedNumber);
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
                Sign In with Your Phone
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                >
                  <Star className="w-5 h-5 text-yellow-400" />
                </motion.div>
              </CardTitle>
              <CardDescription>
                Enter the same phone number you use with WhatsApp to see your health data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    className="focus:ring-purple-500 focus:border-purple-500"
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the full phone number including country code (e.g., +1 for US)
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" 
                onClick={handleLogin}
                disabled={isLoading || !phoneNumber}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <PartyPopper className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                New user? After signing in, send a health update via WhatsApp to get started.
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;