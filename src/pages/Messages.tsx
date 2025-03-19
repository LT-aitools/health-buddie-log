import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import MessageInput from "@/components/Messages/MessageInput";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Mic, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getMessages } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await getMessages();
      if (response.success) {
        // Add system responses to the messages
        const messagesWithResponses = addSystemResponses(response.messages);
        setMessages(messagesWithResponses);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch messages",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to add system responses based on incoming messages
  const addSystemResponses = (incomingMessages: Message[]) => {
    const messagesWithResponses: Message[] = [];
    
    incomingMessages.forEach((message) => {
      // Add the original message
      messagesWithResponses.push(message);
      
      // Generate a response message
      const responseMessage: Message = {
        id: `response-${message.id}`,
        content: generateResponseContent(message),
        timestamp: new Date(new Date(message.timestamp).getTime() + 60000), // 1 minute after original
        type: "outgoing",
        channel: message.channel,
      };
      
      messagesWithResponses.push(responseMessage);
    });
    
    // Sort by timestamp, newest first
    return messagesWithResponses.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  // Helper function to generate response content based on message
  const generateResponseContent = (message: Message) => {
    if (message.category === 'exercise') {
      const duration = message.processed_data?.exercise?.duration;
      const type = message.processed_data?.exercise?.type;
      
      if (duration && type) {
        return `Your ${duration}-minute ${type} session has been logged. Great job!`;
      } else if (duration) {
        return `Your ${duration}-minute workout has been logged. Keep it up!`;
      } else if (type) {
        return `Your ${type} session has been logged. Way to go!`;
      } else {
        return `Your exercise has been logged. Keep up the good work!`;
      }
    } else if (message.category === 'food') {
      const description = message.processed_data?.food?.description;
      
      if (description) {
        return `Your meal "${description}" has been logged. Nutritious choice!`;
      } else {
        return `Your food intake has been recorded. Thanks for keeping track!`;
      }
    } else if (message.content.toLowerCase().includes('status')) {
      return `Generating your weekly health report. Check the Reports tab for details.`;
    } else {
      return `Your health update has been recorded. Thanks!`;
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
                          <p className="text-sm">{message.content}</p>
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