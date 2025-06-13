
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your wellness AI assistant. I can help you with stress management, breathing exercises, and health insights based on your data. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');

  const quickSuggestions = [
    "How can I reduce my stress level?",
    "Guide me through a breathing exercise",
    "Analyze my health data",
    "What should I do when stressed?",
    "Help me sleep better"
  ];

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputMessage('');
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('stress') || input.includes('stressed')) {
      return "I understand you're feeling stressed. Based on your current stress level, I recommend trying our 4-7-8 breathing technique: Inhale for 4 seconds, hold for 7 seconds, and exhale for 8 seconds. You can also activate the calming vibrations or listen to a guided meditation. Would you like me to start a breathing exercise for you?";
    }
    
    if (input.includes('breathing') || input.includes('breathe')) {
      return "Great choice! Breathing exercises are very effective for reducing stress. Try this simple technique: Place one hand on your chest and one on your belly. Breathe in slowly through your nose, feeling your belly rise more than your chest. Exhale slowly through your mouth. Repeat 5-10 times. Should I activate the guided breathing exercise on your device?";
    }
    
    if (input.includes('sleep') || input.includes('tired')) {
      return "For better sleep, I recommend establishing a bedtime routine. Try dimming lights 1 hour before bed, avoiding screens, and using our calming mantras. Your recent stress levels suggest meditation before sleep would be beneficial. Would you like me to schedule a sleep meditation for tonight?";
    }
    
    if (input.includes('health') || input.includes('data')) {
      return "Based on your recent health data: Your heart rate has been slightly elevated, and your stress levels peaked at 85% today around 3 PM. I recommend more frequent breathing breaks and staying hydrated. Your blood pressure is within normal range. Would you like personalized recommendations based on your patterns?";
    }
    
    return "I'm here to help with your wellness journey. I can provide guidance on stress management, breathing exercises, interpreting your health data, and emergency situations. Feel free to ask me anything about your wellbeing or say 'help' for more options.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage(inputMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">AI Assistant</h1>
          <p className="text-lg text-purple-700">Your personal wellness companion</p>
        </div>

        {/* Chat Interface */}
        <Card className="h-96">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="mr-2 h-5 w-5" />
              Wellness Chat
            </CardTitle>
            <CardDescription>Ask me anything about your health and wellness</CardDescription>
          </CardHeader>
          <CardContent className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className="flex items-start space-x-2">
                      {message.sender === 'ai' && <Bot className="h-4 w-4 mt-0.5" />}
                      {message.sender === 'user' && <User className="h-4 w-4 mt-0.5" />}
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={() => sendMessage(inputMessage)}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Questions</CardTitle>
            <CardDescription>Tap any suggestion to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage(suggestion)}
                  className="text-left"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Health Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Current Health Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">Stress Pattern</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Your stress levels tend to peak in the afternoon. Consider scheduling breathing breaks at 2 PM and 4 PM.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900">Heart Rate Trend</h4>
                <p className="text-sm text-green-700 mt-1">
                  Your resting heart rate has improved by 3 BPM this week. Great progress!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAssistant;
