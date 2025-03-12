import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import MessageInput from "@/components/Messages/MessageInput";
import { mockMessages } from "@/lib/mock-data";
import { Message, MessageChannel, MessageType } from "@/lib/types";
import { generateResponse, messageToHealthLog, processHealthMessage } from "@/lib/health-processor";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Mic, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (content: string, channel: MessageChannel) => {
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      timestamp: new Date(),
      type: "incoming",
      channel,
      processed: false,
    };

    setMessages((prev) => [...prev, newUserMessage]);

    setTimeout(() => {
      if (channel === "voice") {
        const { confidence } = processHealthMessage(content);
        newUserMessage.confidence = confidence;

        if (confidence < 0.85) {
          setTimeout(() => {
            const lowConfidenceResponse: Message = {
              id: `system-${Date.now()}`,
              content: "I'm not entirely sure I understood that correctly. Could you please send it as a text message instead?",
              timestamp: new Date(),
              type: "outgoing",
              channel,
            };
            setMessages((prev) => [...prev, lowConfidenceResponse]);
            
            toast({
              title: "Low Confidence Transcription",
              description: "The system couldn't transcribe your message with high confidence. Please try sending it as text.",
              variant: "default",
            });
          }, 1000);
          return;
        }
      }

      if (content.trim().toLowerCase() === "status") {
        const statusResponse: Message = {
          id: `system-${Date.now()}`,
          content: "Generating your weekly health report. A PDF will be sent to you shortly.",
          timestamp: new Date(),
          type: "outgoing",
          channel,
        };
        
        setMessages((prev) => [...prev, statusResponse]);
        
        toast({
          title: "Report Requested",
          description: "Your weekly health report is being generated.",
          variant: "default",
        });
        return;
      }

      const healthLog = messageToHealthLog(newUserMessage);
      const responseContent = generateResponse(healthLog);
      
      newUserMessage.processed = true;
      
      const responseMessage: Message = {
        id: `system-${Date.now()}`,
        content: responseContent,
        timestamp: new Date(),
        type: "outgoing",
        channel,
      };
      
      setMessages((prev) => [...prev.map(m => m.id === newUserMessage.id ? newUserMessage : m), responseMessage]);
      
      if (healthLog) {
        toast({
          title: `${healthLog.category === 'exercise' ? 'Exercise' : 'Food'} Logged`,
          description: "Your health update has been successfully recorded.",
          variant: "default",
        });
      }
    }, 1000);
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
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
                  Send health updates and get insights through natural conversation
                </p>
              </div>
            </div>

            <div className="glass-card rounded-2xl mb-6 overflow-hidden">
              <div className="border-b border-border p-4 flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="font-medium">HealthBuddie Assistant</span>
              </div>
              
              <div className="h-[400px] overflow-y-auto p-4 space-y-4">
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
                            {message.channel !== "outgoing" && message.channel}
                          </span>
                          <span className="text-xs opacity-70 ml-auto">
                            {formatMessageTime(new Date(message.timestamp))}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                        {message.confidence && (
                          <span className={cn(
                            "text-xs mt-1",
                            message.confidence < 0.85 ? "text-red-300" : "opacity-70"
                          )}>
                            Confidence: {(message.confidence * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
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
