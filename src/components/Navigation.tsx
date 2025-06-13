
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Users, Palette, MessageSquare, Settings, LogOut } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

const Navigation = ({ currentPage, onPageChange, onLogout }: NavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Heart },
    { id: 'sos', label: 'SOS Contacts', icon: Users },
    { id: 'calming', label: 'Calming Tools', icon: Palette },
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
  ];

  return (
    <Card className="fixed bottom-0 left-0 right-0 md:relative md:w-64 md:h-screen bg-white/95 backdrop-blur-sm border-t md:border-r md:border-t-0 z-50">
      <div className="p-4">
        {/* Logo - only show on desktop */}
        <div className="hidden md:block text-center mb-6">
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-indigo-900">Ashvas</h2>
          <p className="text-sm text-indigo-600">Your breath of calm</p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          <div className="flex md:flex-col gap-2 md:gap-2 overflow-x-auto md:overflow-x-visible">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  className={`flex-shrink-0 md:w-full md:justify-start ${
                    currentPage === item.id 
                      ? "bg-indigo-600 text-white" 
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                  onClick={() => onPageChange(item.id)}
                >
                  <Icon className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Logout Button - only on desktop */}
        <div className="hidden md:block mt-8">
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Navigation;
