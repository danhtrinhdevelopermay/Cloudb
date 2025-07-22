import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { X, Send } from "lucide-react";

export function PetAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Implement AI assistant functionality
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Pet Avatar */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:from-blue-500 hover:via-purple-600 hover:to-pink-600 ${
          !isOpen ? "animate-bounce" : ""
        }`}
        size="icon"
      >
        <div className="text-2xl">🐾</div>
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-xl shadow-xl border border-gray-200 animate-in slide-in-from-bottom-2 duration-300">
          <div className="p-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🐾</span>
                <span className="font-medium">CloudPet Assistant</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 hover:bg-white/20 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-4 h-64 overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">🐾</span>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm text-gray-800">
                    Hi there! 👋 I'm your CloudPet assistant. I can help you organize files, 
                    find documents, or answer questions about CloudBox!
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">🐾</span>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm text-gray-800">
                    Try asking me things like:
                    <br />• "Find my documents"
                    <br />• "How do I share files?"
                    <br />• "Show me recent uploads"
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Ask me anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:from-blue-500 hover:via-purple-600 hover:to-pink-600"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
