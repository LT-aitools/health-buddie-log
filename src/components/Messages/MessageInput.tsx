
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Mic, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageChannel } from "@/lib/types";

interface MessageInputProps {
  onSendMessage: (content: string, channel: MessageChannel) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [channel, setChannel] = useState<MessageChannel>("whatsapp");
  const [twilioEnabled, setTwilioEnabled] = useState(false);
  
  useEffect(() => {
    // Check if Twilio is set up
    const twilioAccount = localStorage.getItem("twilioAccount");
    if (twilioAccount) {
      try {
        const parsed = JSON.parse(twilioAccount);
        setTwilioEnabled(parsed.isSetup === true);
      } catch (e) {
        console.error("Error parsing Twilio account:", e);
      }
    }
  }, []);

  const handleSend = () => {
    if (message.trim() === "") return;
    
    onSendMessage(message, channel);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    // In a real app, this would activate the microphone and use Whisper
    // For this demo, we'll just toggle a state
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Simulate starting recording
      setTimeout(() => {
        setIsRecording(false);
        setMessage("I went for a run for 25 minutes today");
        
        // Focus the input after setting the message
        setTimeout(() => {
          document.getElementById("message-input")?.focus();
        }, 100);
      }, 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 items-center mb-4">
        <span className="text-sm text-muted-foreground">Simulated channel:</span>
        <div className="flex bg-secondary rounded-full p-1">
          <button
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-all",
              channel === "whatsapp"
                ? "bg-primary text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setChannel("whatsapp")}
          >
            WhatsApp
          </button>
          <button
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-all",
              channel === "imessage"
                ? "bg-primary text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setChannel("imessage")}
          >
            iMessage
          </button>
          {twilioEnabled && (
            <>
              <button
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all",
                  channel === "sms"
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setChannel("sms")}
              >
                Twilio SMS
              </button>
              <button
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all",
                  channel === "twilio-whatsapp"
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setChannel("twilio-whatsapp")}
              >
                Twilio WhatsApp
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="relative">
        <Textarea
          id="message-input"
          placeholder="Type your health update..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pr-24 min-h-24 resize-none"
        />
        <div className="absolute bottom-3 right-3 flex space-x-2">
          <Button
            size="icon"
            variant="outline"
            className={cn(
              "rounded-full transition-all",
              isRecording ? "bg-red-500 text-white hover:bg-red-600" : ""
            )}
            onClick={toggleRecording}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button 
            size="icon"
            className="rounded-full"
            onClick={handleSend}
            disabled={message.trim() === ""}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        <p>Try sending messages like:</p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>"I went for a 30 minute run this morning"</li>
          <li>"Had a salad with grilled chicken for lunch"</li>
          <li>"status" - to request a weekly report</li>
        </ul>
        {!twilioEnabled && (
          <div className="mt-3 p-2 bg-secondary rounded-md">
            <p>Want to use real SMS or WhatsApp? <a href="/twilio-setup" className="text-primary underline">Set up Twilio integration</a></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
