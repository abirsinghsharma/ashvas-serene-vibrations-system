
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Volume2, Mic, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MantraSession {
  id: string;
  name: string;
  duration: number;
  type: 'preset' | 'custom';
}

const CalmingTools = () => {
  const [currentSession, setCurrentSession] = useState<MantraSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const presetMantras: MantraSession[] = [
    { id: '1', name: 'Deep Breathing', duration: 300, type: 'preset' },
    { id: '2', name: 'Body Scan Meditation', duration: 600, type: 'preset' },
    { id: '3', name: 'Mindfulness Bell', duration: 180, type: 'preset' },
    { id: '4', name: 'Ocean Waves', duration: 900, type: 'preset' }
  ];

  const [customMantras, setCustomMantras] = useState<MantraSession[]>([
    { id: 'c1', name: 'My Personal Mantra', duration: 240, type: 'custom' }
  ]);

  const startSession = (session: MantraSession) => {
    setCurrentSession(session);
    setIsPlaying(true);
    setProgress(0);
    
    toast({
      title: "Session Started",
      description: `Playing "${session.name}"`
    });

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPlaying(false);
          toast({
            title: "Session Complete",
            description: "Calming session finished"
          });
          return 100;
        }
        return prev + (100 / session.duration) * 2; // Update every 2 seconds
      });
    }, 2000);
  };

  const pauseSession = () => {
    setIsPlaying(false);
    toast({
      title: "Session Paused",
      description: "You can resume anytime"
    });
  };

  const stopSession = () => {
    setCurrentSession(null);
    setIsPlaying(false);
    setProgress(0);
    toast({
      title: "Session Stopped",
      description: "Session ended"
    });
  };

  const startRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording Started",
      description: "Speak your personal mantra or calming message"
    });

    // Simulate recording for 10 seconds
    setTimeout(() => {
      setIsRecording(false);
      const newMantra: MantraSession = {
        id: `c${Date.now()}`,
        name: `Recording ${new Date().toLocaleString()}`,
        duration: 60,
        type: 'custom'
      };
      setCustomMantras([...customMantras, newMantra]);
      toast({
        title: "Recording Saved",
        description: "Your personal mantra has been saved"
      });
    }, 10000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Calming Tools</h1>
          <p className="text-lg text-green-700">Find your inner peace</p>
        </div>

        {/* Current Session */}
        {currentSession && (
          <Card className="border-2 border-green-300">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">{currentSession.name}</CardTitle>
                  <CardDescription>
                    Duration: {formatTime(currentSession.duration)}
                  </CardDescription>
                </div>
                <Badge variant="default">Now Playing</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={progress} className="w-full" />
              <div className="flex justify-center space-x-4">
                {isPlaying ? (
                  <Button onClick={pauseSession} size="lg">
                    <Pause className="mr-2 h-5 w-5" />
                    Pause
                  </Button>
                ) : (
                  <Button onClick={() => startSession(currentSession)} size="lg">
                    <Play className="mr-2 h-5 w-5" />
                    Resume
                  </Button>
                )}
                <Button onClick={stopSession} variant="outline" size="lg">
                  <Square className="mr-2 h-5 w-5" />
                  Stop
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preset Mantras */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Volume2 className="mr-2 h-5 w-5" />
              Guided Sessions
            </CardTitle>
            <CardDescription>Pre-recorded calming sessions and mantras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {presetMantras.map((mantra) => (
                <Card key={mantra.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{mantra.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {formatTime(mantra.duration)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => startSession(mantra)} 
                      className="w-full"
                      disabled={currentSession?.id === mantra.id && isPlaying}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Play
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom Recordings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mic className="mr-2 h-5 w-5" />
              Personal Recordings
            </CardTitle>
            <CardDescription>Your custom mantras and calming messages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={startRecording} 
                disabled={isRecording}
                variant={isRecording ? "destructive" : "default"}
              >
                <Mic className="mr-2 h-4 w-4" />
                {isRecording ? "Recording..." : "Record New Mantra"}
              </Button>
              
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload Audio File
              </Button>
            </div>

            {isRecording && (
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700">
                  Recording in progress... Speak clearly into your device microphone.
                </p>
                <Progress value={50} className="mt-2" />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customMantras.map((mantra) => (
                <Card key={mantra.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{mantra.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {formatTime(mantra.duration)} • Custom
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => startSession(mantra)} 
                      className="w-full"
                      disabled={currentSession?.id === mantra.id && isPlaying}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Play
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Breathing Exercise */}
        <Card>
          <CardHeader>
            <CardTitle>Guided Breathing Exercise</CardTitle>
            <CardDescription>Follow the visual guide for deep breathing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse flex items-center justify-center">
                <span className="text-white font-semibold">Breathe</span>
              </div>
              <p className="text-muted-foreground">
                Inhale for 4 seconds, hold for 4 seconds, exhale for 6 seconds
              </p>
              <Button className="mt-4">
                Start Breathing Exercise
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalmingTools;
