import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import MessageInput from "@/components/Messages/MessageInput";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Mic, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getMessages, testApiConnection } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Test API connection first
    testApiConnection().then(result => {
      console.log("API connection test result:", result);
      if (result.success) {
        fetchMessages();
      } else {
        setError("Cannot connect to the API server. Please try again later.");
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    console.log("Fetching messages for user:", user?.phoneNumber);
    console.log("User object:", user);
    setLoading(true);
    setError(null);
    try {
      const response = await getMessages();
      console.log("Messages API response:", response);
      
      if (response.success) {
        console.log("Raw messages from API:", response.messages);
        if (response.messages && response.messages.length > 0) {
          setMessages(response.messages);
        } else {
          setMessages([]);
          toast({
            title: "No Messages",
            description: "You don't have any messages yet. Send a message via WhatsApp to start tracking your health.",
            variant: "default",
          });
        }
      } else {
        console.error("Error in messages response:", response.error);
        setError(response.error || "Failed to fetch messages");
        toast({
          title: "Error",
          description: response.error || "Failed to fetch messages",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to connect to the server");
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (content: string, channel: string) => {
    toast({
      title: "Message Sent",
      description: "Please send your actual message via WhatsApp for tracking.",
    });
  };

  const formatMessageTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageContent = (message: Message) => {
    if (message.category === 'exercise' && message.processed_data?.exercise) {
      const { duration, type, distance } = message.processed_data.exercise;
      let content = `Exercise: ${type}`;
      
      if (duration > 0) {
        content += ` for ${duration} minutes`;
      }
      
      if (distance) {
        content += ` (${distance})`;
      }
      
      return content;
    } else if (message.category === 'food' && message.processed_data?.food) {
      const { description } = message.processed_data.food;
      return `Food: ${description}`;
    }
    
    return message.content;
  };

  return (
    <div className="min-h-screen bg-background pt-6 pb-24 md:pb-6 md:pt-24">
      <div className="container px-4 md:px-6">
        {loading ? (
          <div className="h-[80vh] flex items-center justify-center">
            <div className="relative h-16 w-16">
              <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-gray-200"></div>
              <div className="absolute top-0 left-0 h-full w-full rounded-full border-4 border-t-transparent border-primary animate-spin"></div>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <div className="mr-4 bg-destructive text-destructive-foreground p-3 rounded-full">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                <p className="text-muted-foreground">
                  {error}
                </p>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center">
              <p className="text-muted-foreground mb-4">
                {error === "No phone number available. Please log in again." 
                  ? "Please log out and log in again to fix this issue."
                  : "Please try again later or contact support if the issue persists."}
              </p>
              <Button onClick={fetchMessages} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <div className="mr-4 bg-primary text-white p-3 rounded-full">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                <p className="text-muted-foreground">
                  View your WhatsApp health tracking message history
                </p>
              </div>
            </div>

            <div className="glass-card rounded-2xl mb-6 overflow-hidden">
              <div className="border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="font-medium">HealthBuddie Assistant</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {user?.phoneNumber}
                </span>
              </div>
              
              <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Messages Yet</h3>
                    <p className="text-muted-foreground max-w-xs mt-2">
                      Send a WhatsApp message to your Twilio number to start tracking your health.
                    </p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "flex",
                          message.type === "incoming" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[75%] rounded-2xl px-4 py-2 flex flex-col",
                            message.type === "incoming"
                              ? "bg-primary text-primary-foreground rounded-tr-none"
                              : "bg-secondary text-secondary-foreground rounded-tl-none"
                          )}
                        >
                          <div className="flex items-center mb-1">
                            {message.type === "incoming" && message.channel === "voice" && (
                              <Mic className="h-3 w-3 mr-1" />
                            )}
                            {message.type === "incoming" && message.processed && (
                              <Check className="h-3 w-3 mr-1" />
                            )}
                            <span className="text-xs opacity-70">
                              {message.type !== "outgoing" && message.channel}
                            </span>
                            <span className="text-xs opacity-70 ml-auto">
                              {formatMessageTime(message.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm">{formatMessageContent(message)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <MessageInput onSendMessage={handleSendMessage} />
            </div>
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
};

export default Messages;