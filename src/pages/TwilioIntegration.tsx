
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { PhoneIcon, MessageSquare, AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { TwilioAccount } from "@/lib/types";

const TwilioIntegration = () => {
  const [accountInfo, setAccountInfo] = useState<TwilioAccount>(() => {
    const savedInfo = localStorage.getItem("twilioAccount");
    return savedInfo ? JSON.parse(savedInfo) : {
      accountSid: "",
      authToken: "",
      phoneNumber: "",
      isSetup: false
    };
  });
  
  const [isTokenVisible, setIsTokenVisible] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://your-backend-url.com/twilio-webhook");
  
  const handleSave = () => {
    if (!accountInfo.accountSid || !accountInfo.authToken || !accountInfo.phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would validate these credentials with Twilio
    // For now, we'll just save them to localStorage
    const updatedInfo = { ...accountInfo, isSetup: true };
    localStorage.setItem("twilioAccount", JSON.stringify(updatedInfo));
    setAccountInfo(updatedInfo);
    
    toast({
      title: "Twilio Integration Saved",
      description: "Your Twilio account has been connected successfully",
    });
  };
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `${label} has been copied to your clipboard`,
      });
    });
  };

  return (
    <div className="min-h-screen bg-background pt-6 pb-24 md:pb-6 md:pt-24">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <div className="mr-4 bg-primary text-white p-3 rounded-full">
              <PhoneIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Twilio Integration</h1>
              <p className="text-muted-foreground">
                Connect HealthBuddie to SMS and WhatsApp for real-time health tracking
              </p>
            </div>
          </div>

          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="whatsapp" disabled={!accountInfo.isSetup}>WhatsApp</TabsTrigger>
              <TabsTrigger value="sms" disabled={!accountInfo.isSetup}>SMS</TabsTrigger>
            </TabsList>
            
            <TabsContent value="setup">
              <Card>
                <CardHeader>
                  <CardTitle>Connect Your Twilio Account</CardTitle>
                  <CardDescription>
                    Enter your Twilio credentials to enable SMS and WhatsApp messaging
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-sid">Account SID</Label>
                    <Input 
                      id="account-sid" 
                      placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                      value={accountInfo.accountSid}
                      onChange={(e) => setAccountInfo({...accountInfo, accountSid: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="auth-token">Auth Token</Label>
                    <div className="relative">
                      <Input 
                        id="auth-token" 
                        type={isTokenVisible ? "text" : "password"}
                        placeholder="Your Twilio Auth Token" 
                        value={accountInfo.authToken}
                        onChange={(e) => setAccountInfo({...accountInfo, authToken: e.target.value})}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setIsTokenVisible(!isTokenVisible)}
                      >
                        {isTokenVisible ? "Hide" : "Show"}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone-number">Twilio Phone Number</Label>
                    <Input 
                      id="phone-number" 
                      placeholder="+1234567890" 
                      value={accountInfo.phoneNumber}
                      onChange={(e) => setAccountInfo({...accountInfo, phoneNumber: e.target.value})}
                    />
                    <p className="text-sm text-muted-foreground">
                      Must be a Twilio phone number with SMS and/or WhatsApp capabilities
                    </p>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md mt-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800 dark:text-amber-300">Important Note</h4>
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                          This is a demonstration app. In a production environment, you should never 
                          store Twilio credentials in the browser. Use a secure backend service instead.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSave}>Save Twilio Configuration</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="whatsapp">
              <Card>
                <CardHeader>
                  <CardTitle>WhatsApp Integration</CardTitle>
                  <CardDescription>
                    Set up HealthBuddie for WhatsApp messaging
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {accountInfo.isSetup ? (
                    <>
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                          <span>WhatsApp account connected</span>
                        </div>
                        <Button variant="outline" size="sm">Test Connection</Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Your WhatsApp Number</Label>
                        <div className="flex items-center">
                          <Input value={accountInfo.phoneNumber} readOnly />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="ml-2"
                            onClick={() => copyToClipboard(accountInfo.phoneNumber, "WhatsApp number")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-6">
                        <Label className="text-base">Instructions for Users</Label>
                        <div className="bg-secondary p-4 rounded-md space-y-4">
                          <p className="text-sm">
                            To use HealthBuddie with WhatsApp, your users need to:
                          </p>
                          <ol className="list-decimal text-sm ml-5 space-y-2">
                            <li>Save the number {accountInfo.phoneNumber} to their contacts as "HealthBuddie"</li>
                            <li>Open WhatsApp and message "join" to HealthBuddie</li>
                            <li>Start tracking their health by sending messages like:
                              <ul className="list-disc ml-5 mt-1 space-y-1">
                                <li>"I ran for 30 minutes today"</li>
                                <li>"Had a salad for lunch"</li>
                                <li>"status" - to request a weekly report</li>
                              </ul>
                            </li>
                          </ol>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Setup Required</h3>
                      <p className="text-muted-foreground mb-4">
                        Please complete the Twilio account setup first
                      </p>
                      <Button variant="outline" onClick={() => document.querySelector('[data-value="setup"]')?.click()}>
                        Go to Setup
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sms">
              <Card>
                <CardHeader>
                  <CardTitle>SMS Integration</CardTitle>
                  <CardDescription>
                    Set up HealthBuddie for SMS text messaging
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {accountInfo.isSetup ? (
                    <>
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                          <span>SMS messaging enabled</span>
                        </div>
                        <Button variant="outline" size="sm">Test SMS</Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Your SMS Number</Label>
                        <div className="flex items-center">
                          <Input value={accountInfo.phoneNumber} readOnly />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="ml-2"
                            onClick={() => copyToClipboard(accountInfo.phoneNumber, "SMS number")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="auto-reply">Auto-Reply</Label>
                          <Switch id="auto-reply" defaultChecked />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Automatically respond to SMS messages with health insights
                        </p>
                      </div>
                      
                      <div className="space-y-2 mt-6">
                        <Label className="text-base">Instructions for Users</Label>
                        <div className="bg-secondary p-4 rounded-md space-y-4">
                          <p className="text-sm">
                            To use HealthBuddie with SMS, your users need to:
                          </p>
                          <ol className="list-decimal text-sm ml-5 space-y-2">
                            <li>Text {accountInfo.phoneNumber} with their health updates</li>
                            <li>Start tracking their health by sending messages like:
                              <ul className="list-disc ml-5 mt-1 space-y-1">
                                <li>"I ran for 30 minutes today"</li>
                                <li>"Had a salad for lunch"</li>
                                <li>"status" - to request a weekly report</li>
                              </ul>
                            </li>
                          </ol>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Setup Required</h3>
                      <p className="text-muted-foreground mb-4">
                        Please complete the Twilio account setup first
                      </p>
                      <Button variant="outline" onClick={() => document.querySelector('[data-value="setup"]')?.click()}>
                        Go to Setup
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {accountInfo.isSetup && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Webhook Configuration</CardTitle>
                  <CardDescription>
                    For full functionality, you'll need to set up a backend service and configure Twilio webhooks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <div className="flex items-center">
                      <Input 
                        id="webhook-url" 
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="ml-2"
                        onClick={() => copyToClipboard(webhookUrl, "Webhook URL")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You'll need to use this URL in your Twilio console to receive incoming messages
                    </p>
                  </div>
                  
                  <div className="bg-secondary p-4 rounded-md mt-4">
                    <h4 className="font-medium mb-2">Webhook Setup Instructions</h4>
                    <ol className="list-decimal ml-5 space-y-2 text-sm">
                      <li>Log in to your <a href="https://www.twilio.com/console" target="_blank" rel="noopener noreferrer" className="text-primary underline">Twilio Console</a></li>
                      <li>Go to Phone Numbers → Active Numbers</li>
                      <li>Click on your Twilio phone number</li>
                      <li>Under "Messaging", set the webhook URL to receive incoming messages</li>
                      <li>Set the HTTP Method to POST</li>
                      <li>Save your changes</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default TwilioIntegration;
