
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Thermometer, Activity, Zap, Phone, MessageSquare, Play, Pause } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface HealthData {
  heartRate: number;
  bodyTemp: number;
  bloodPressure: { systolic: number; diastolic: number };
  stressLevel: number;
}

const Dashboard = () => {
  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: 72,
    bodyTemp: 98.6,
    bloodPressure: { systolic: 120, diastolic: 80 },
    stressLevel: 30
  });
  
  const [isPlayingMantra, setIsPlayingMantra] = useState(false);
  const [vibrationActive, setVibrationActive] = useState(false);

  // Simulate real-time health data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthData(prev => ({
        heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 4)),
        bodyTemp: Math.max(97, Math.min(100, prev.bodyTemp + (Math.random() - 0.5) * 0.2)),
        bloodPressure: {
          systolic: Math.max(110, Math.min(140, prev.bloodPressure.systolic + (Math.random() - 0.5) * 6)),
          diastolic: Math.max(70, Math.min(90, prev.bloodPressure.diastolic + (Math.random() - 0.5) * 4))
        },
        stressLevel: Math.max(0, Math.min(100, prev.stressLevel + (Math.random() - 0.5) * 10))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Auto-trigger calming features based on stress level
  useEffect(() => {
    if (healthData.stressLevel > 70) {
      triggerCalmingResponse();
    }
  }, [healthData.stressLevel]);

  const triggerCalmingResponse = () => {
    setVibrationActive(true);
    toast({
      title: "Stress Level High",
      description: "Activating calming vibrations and mantra",
    });
    
    // Simulate vibration for 5 seconds
    setTimeout(() => setVibrationActive(false), 5000);
  };

  const sendSOSAlert = () => {
    toast({
      title: "SOS Alert Sent",
      description: "Emergency contacts have been notified",
      variant: "destructive"
    });
  };

  const toggleMantra = () => {
    setIsPlayingMantra(!isPlayingMantra);
    toast({
      title: isPlayingMantra ? "Mantra Stopped" : "Mantra Started",
      description: isPlayingMantra ? "Calming session ended" : "Playing calming mantra"
    });
  };

  const getStressLevelColor = (level: number) => {
    if (level < 30) return "bg-green-500";
    if (level < 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStressLevelText = (level: number) => {
    if (level < 30) return "Low";
    if (level < 60) return "Moderate";
    return "High";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">Ashvas</h1>
          <p className="text-xl text-indigo-700">Your breath of calm</p>
        </div>

        {/* Health Monitoring Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(healthData.heartRate)} BPM</div>
              <p className="text-xs text-muted-foreground">Normal range: 60-100</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Body Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthData.bodyTemp.toFixed(1)}°F</div>
              <p className="text-xs text-muted-foreground">Normal: 98.6°F</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(healthData.bloodPressure.systolic)}/{Math.round(healthData.bloodPressure.diastolic)}
              </div>
              <p className="text-xs text-muted-foreground">mmHg</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stress Level</CardTitle>
              <Zap className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold">{Math.round(healthData.stressLevel)}%</div>
                <Badge className={getStressLevelColor(healthData.stressLevel)}>
                  {getStressLevelText(healthData.stressLevel)}
                </Badge>
              </div>
              <Progress value={healthData.stressLevel} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Calming Features */}
          <Card>
            <CardHeader>
              <CardTitle>Calming Tools</CardTitle>
              <CardDescription>Manage your stress with guided relaxation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={toggleMantra} 
                className="w-full"
                variant={isPlayingMantra ? "destructive" : "default"}
              >
                {isPlayingMantra ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlayingMantra ? "Stop Mantra" : "Play Calming Mantra"}
              </Button>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Calming Vibrations</span>
                <Badge variant={vibrationActive ? "default" : "secondary"}>
                  {vibrationActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* SOS Features */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency SOS</CardTitle>
              <CardDescription>Quick access to emergency contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={sendSOSAlert} variant="destructive" className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                Send SOS Alert
              </Button>
              
              <Button variant="outline" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Emergency Message
              </Button>
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>Get personalized wellness advice</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Chat with Assistant
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Based on your current stress level, I recommend taking 5 deep breaths.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Device Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Wireless Connected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Health Monitoring Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${vibrationActive ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm">Vibration System</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
