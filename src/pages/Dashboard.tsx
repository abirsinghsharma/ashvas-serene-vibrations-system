import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Thermometer, Activity, Zap, Phone, MessageSquare, Play, Pause, AlertTriangle, Vibrate } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface HealthData {
  heartRate: number;
  bodyTemp: number;
  bloodPressure: { systolic: number; diastolic: number };
  stressLevel: number;
}

interface HealthAlert {
  id: string;
  type: 'heartRate' | 'bodyTemp' | 'bloodPressure' | 'stressLevel';
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
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
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<HealthAlert | null>(null);

  // Health thresholds
  const healthThresholds = {
    heartRate: { min: 60, max: 100, critical: 120 },
    bodyTemp: { min: 97.0, max: 99.5, critical: 101.0 },
    bloodPressure: { 
      systolic: { max: 140, critical: 160 },
      diastolic: { max: 90, critical: 100 }
    },
    stressLevel: { moderate: 50, high: 70, critical: 85 }
  };

  // Simulate continuous smartwatch data monitoring
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setHealthData(prev => {
        const newData = {
          heartRate: Math.max(50, Math.min(150, prev.heartRate + (Math.random() - 0.5) * 8)),
          bodyTemp: Math.max(96, Math.min(102, prev.bodyTemp + (Math.random() - 0.5) * 0.3)),
          bloodPressure: {
            systolic: Math.max(90, Math.min(180, prev.bloodPressure.systolic + (Math.random() - 0.5) * 10)),
            diastolic: Math.max(60, Math.min(110, prev.bloodPressure.diastolic + (Math.random() - 0.5) * 6))
          },
          stressLevel: Math.max(0, Math.min(100, prev.stressLevel + (Math.random() - 0.5) * 15))
        };

        // Check for alerts after data update
        checkHealthAlerts(newData);
        return newData;
      });
    }, 2000); // Update every 2 seconds for real-time monitoring

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const checkHealthAlerts = (data: HealthData) => {
    const newAlerts: HealthAlert[] = [];

    // Heart Rate Monitoring
    if (data.heartRate > healthThresholds.heartRate.critical) {
      newAlerts.push({
        id: `hr-${Date.now()}`,
        type: 'heartRate',
        message: `Critical heart rate detected: ${Math.round(data.heartRate)} BPM`,
        severity: 'high',
        timestamp: new Date()
      });
      triggerEmergencyResponse('Critical heart rate detected');
    } else if (data.heartRate > healthThresholds.heartRate.max || data.heartRate < healthThresholds.heartRate.min) {
      newAlerts.push({
        id: `hr-${Date.now()}`,
        type: 'heartRate',
        message: `Abnormal heart rate: ${Math.round(data.heartRate)} BPM`,
        severity: 'medium',
        timestamp: new Date()
      });
      triggerCalmingResponse('Heart rate abnormality detected');
    }

    // Body Temperature Monitoring
    if (data.bodyTemp > healthThresholds.bodyTemp.critical) {
      newAlerts.push({
        id: `temp-${Date.now()}`,
        type: 'bodyTemp',
        message: `High fever detected: ${data.bodyTemp.toFixed(1)}°F`,
        severity: 'high',
        timestamp: new Date()
      });
      triggerEmergencyResponse('High fever detected');
    } else if (data.bodyTemp > healthThresholds.bodyTemp.max || data.bodyTemp < healthThresholds.bodyTemp.min) {
      newAlerts.push({
        id: `temp-${Date.now()}`,
        type: 'bodyTemp',
        message: `Abnormal body temperature: ${data.bodyTemp.toFixed(1)}°F`,
        severity: 'medium',
        timestamp: new Date()
      });
      triggerCalmingResponse('Temperature abnormality detected');
    }

    // Blood Pressure Monitoring
    if (data.bloodPressure.systolic > healthThresholds.bloodPressure.systolic.critical || 
        data.bloodPressure.diastolic > healthThresholds.bloodPressure.diastolic.critical) {
      newAlerts.push({
        id: `bp-${Date.now()}`,
        type: 'bloodPressure',
        message: `Critical blood pressure: ${Math.round(data.bloodPressure.systolic)}/${Math.round(data.bloodPressure.diastolic)}`,
        severity: 'high',
        timestamp: new Date()
      });
      triggerEmergencyResponse('Critical blood pressure detected');
    } else if (data.bloodPressure.systolic > healthThresholds.bloodPressure.systolic.max || 
               data.bloodPressure.diastolic > healthThresholds.bloodPressure.diastolic.max) {
      newAlerts.push({
        id: `bp-${Date.now()}`,
        type: 'bloodPressure',
        message: `Elevated blood pressure: ${Math.round(data.bloodPressure.systolic)}/${Math.round(data.bloodPressure.diastolic)}`,
        severity: 'medium',
        timestamp: new Date()
      });
      triggerCalmingResponse('Blood pressure elevation detected');
    }

    // Stress Level Monitoring
    if (data.stressLevel > healthThresholds.stressLevel.critical) {
      newAlerts.push({
        id: `stress-${Date.now()}`,
        type: 'stressLevel',
        message: `Critical stress level: ${Math.round(data.stressLevel)}%`,
        severity: 'high',
        timestamp: new Date()
      });
      triggerEmergencyResponse('Critical stress level detected');
    } else if (data.stressLevel > healthThresholds.stressLevel.high) {
      newAlerts.push({
        id: `stress-${Date.now()}`,
        type: 'stressLevel',
        message: `High stress level: ${Math.round(data.stressLevel)}%`,
        severity: 'medium',
        timestamp: new Date()
      });
      triggerCalmingResponse('High stress level detected');
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 10)); // Keep last 10 alerts
      setCurrentAlert(newAlerts[0]);
      setShowCheckInDialog(true);
    }
  };

  const triggerCalmingResponse = (reason: string) => {
    setVibrationActive(true);
    toast({
      title: "Calming Response Activated",
      description: reason,
    });
    
    // Auto-start calming mantra
    if (!isPlayingMantra) {
      setIsPlayingMantra(true);
    }
    
    // Vibration for 10 seconds
    setTimeout(() => setVibrationActive(false), 10000);
  };

  const triggerEmergencyResponse = (reason: string) => {
    setVibrationActive(true);
    toast({
      title: "Emergency Alert",
      description: `${reason} - Emergency contacts notified`,
      variant: "destructive"
    });
    
    // Auto-send SOS
    setTimeout(() => {
      toast({
        title: "SOS Alert Sent",
        description: "Emergency contacts have been notified automatically",
        variant: "destructive"
      });
    }, 1000);
    
    // Strong vibration for 15 seconds
    setTimeout(() => setVibrationActive(false), 15000);
  };

  const handleCheckInResponse = (isOkay: boolean) => {
    setShowCheckInDialog(false);
    if (isOkay) {
      toast({
        title: "Check-in Confirmed",
        description: "Thank you for confirming you're okay"
      });
    } else {
      triggerEmergencyResponse("User indicated they need help");
    }
    setCurrentAlert(null);
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    toast({
      title: isMonitoring ? "Monitoring Paused" : "Monitoring Resumed",
      description: isMonitoring ? "Health monitoring has been paused" : "Continuous health monitoring resumed"
    });
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

        {/* Check-in Dialog */}
        {showCheckInDialog && currentAlert && (
          <Alert className="border-2 border-red-500 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-4">
                <p className="font-semibold">{currentAlert.message}</p>
                <p>Are you feeling okay? Please respond:</p>
                <div className="flex space-x-4">
                  <Button onClick={() => handleCheckInResponse(true)} variant="outline">
                    I'm Okay
                  </Button>
                  <Button onClick={() => handleCheckInResponse(false)} variant="destructive">
                    I Need Help
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Monitoring Status */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Smartwatch Monitoring</CardTitle>
                <CardDescription>Continuous health data from your connected device</CardDescription>
              </div>
              <Button onClick={toggleMonitoring} variant={isMonitoring ? "destructive" : "default"}>
                {isMonitoring ? "Pause Monitoring" : "Resume Monitoring"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
              <span className="text-sm">{isMonitoring ? "Monitoring Active" : "Monitoring Paused"}</span>
              {vibrationActive && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <Vibrate className="h-4 w-4 animate-bounce" />
                  <span className="text-sm">Vibration Active</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        {alerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Health Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {alerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg ${
                    alert.severity === 'high' ? 'bg-red-100 border-red-300' :
                    alert.severity === 'medium' ? 'bg-yellow-100 border-yellow-300' :
                    'bg-blue-100 border-blue-300'
                  } border`}>
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <span className="text-xs text-gray-500">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Health Monitoring Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className={healthData.heartRate > healthThresholds.heartRate.max || healthData.heartRate < healthThresholds.heartRate.min ? 'border-red-500' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(healthData.heartRate)} BPM</div>
              <p className="text-xs text-muted-foreground">Normal: 60-100 BPM</p>
              {(healthData.heartRate > healthThresholds.heartRate.max || healthData.heartRate < healthThresholds.heartRate.min) && (
                <Badge variant="destructive" className="mt-1">Alert</Badge>
              )}
            </CardContent>
          </Card>

          <Card className={healthData.bodyTemp > healthThresholds.bodyTemp.max || healthData.bodyTemp < healthThresholds.bodyTemp.min ? 'border-red-500' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Body Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthData.bodyTemp.toFixed(1)}°F</div>
              <p className="text-xs text-muted-foreground">Normal: 97-99.5°F</p>
              {(healthData.bodyTemp > healthThresholds.bodyTemp.max || healthData.bodyTemp < healthThresholds.bodyTemp.min) && (
                <Badge variant="destructive" className="mt-1">Alert</Badge>
              )}
            </CardContent>
          </Card>

          <Card className={healthData.bloodPressure.systolic > healthThresholds.bloodPressure.systolic.max || healthData.bloodPressure.diastolic > healthThresholds.bloodPressure.diastolic.max ? 'border-red-500' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(healthData.bloodPressure.systolic)}/{Math.round(healthData.bloodPressure.diastolic)}
              </div>
              <p className="text-xs text-muted-foreground">mmHg</p>
              {(healthData.bloodPressure.systolic > healthThresholds.bloodPressure.systolic.max || healthData.bloodPressure.diastolic > healthThresholds.bloodPressure.diastolic.max) && (
                <Badge variant="destructive" className="mt-1">Alert</Badge>
              )}
            </CardContent>
          </Card>

          <Card className={healthData.stressLevel > healthThresholds.stressLevel.high ? 'border-red-500' : ''}>
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
              {healthData.stressLevel > healthThresholds.stressLevel.high && (
                <Badge variant="destructive" className="mt-1">Alert</Badge>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        <Card>
          <CardHeader>
            <CardTitle>Device Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Smartwatch Connected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm">Health Monitoring {isMonitoring ? 'Active' : 'Paused'}</span>
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
