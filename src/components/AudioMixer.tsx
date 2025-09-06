import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Slider } from '../components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Mic, 
  Headphones, 
  Settings,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  RotateCcw,
  RotateCw,
  Scissors,
  Copy,
  Trash2,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Zap,
  Waves,
  Filter,
  Maximize2,
  Minimize2,
  Square,
  Circle,
  Triangle,
  Hexagon
} from 'lucide-react';

interface AudioTrack {
  id: string;
  name: string;
  type: 'master' | 'music' | 'voice' | 'sfx' | 'ambient';
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  locked: boolean;
  visible: boolean;
  color: string;
  clips: AudioClip[];
  effects: AudioEffect[];
}

interface AudioClip {
  id: string;
  trackId: string;
  name: string;
  startTime: number;
  duration: number;
  volume: number;
  fadeIn: number;
  fadeOut: number;
  offset: number;
  selected: boolean;
  waveformData?: number[];
}

interface AudioEffect {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  parameters: { [key: string]: any };
  bypass: boolean;
}

interface AudioMixerProps {
  tracks?: AudioTrack[];
  currentTime?: number;
  duration?: number;
  isPlaying?: boolean;
  onTrackChange?: (track: AudioTrack) => void;
  onClipChange?: (clip: AudioClip) => void;
  onPlayStateChange?: (playing: boolean) => void;
  onTimeChange?: (time: number) => void;
}

export default function AudioMixer({ 
  tracks = [], 
  currentTime = 0, 
  duration = 300, 
  isPlaying = false,
  onTrackChange,
  onClipChange,
  onPlayStateChange,
  onTimeChange 
}: AudioMixerProps) {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('mixer');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [timelineOffset, setTimelineOffset] = useState(0);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(1); // seconds

  const timelineRef = useRef<HTMLDivElement>(null);
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null);

  // Audio effect presets
  const audioEffects = {
    dynamics: [
      {
        id: 'compressor',
        name: 'Compressor',
        parameters: {
          threshold: -20,
          ratio: 4,
          attack: 3,
          release: 100,
          makeupGain: 0
        }
      },
      {
        id: 'limiter',
        name: 'Limiter',
        parameters: {
          threshold: -3,
          release: 50,
          lookahead: 5
        }
      },
      {
        id: 'gate',
        name: 'Noise Gate',
        parameters: {
          threshold: -40,
          ratio: 10,
          attack: 1,
          hold: 10,
          release: 100
        }
      },
      {
        id: 'expander',
        name: 'Expander',
        parameters: {
          threshold: -30,
          ratio: 2,
          attack: 3,
          release: 100
        }
      }
    ],
    eq: [
      {
        id: 'parametric-eq',
        name: 'Parametric EQ',
        parameters: {
          lowShelf: { freq: 100, gain: 0, q: 0.7 },
          lowMid: { freq: 400, gain: 0, q: 1.0 },
          mid: { freq: 1000, gain: 0, q: 1.0 },
          highMid: { freq: 3000, gain: 0, q: 1.0 },
          highShelf: { freq: 8000, gain: 0, q: 0.7 }
        }
      },
      {
        id: 'graphic-eq',
        name: 'Graphic EQ',
        parameters: {
          bands: [
            { freq: 31, gain: 0 },
            { freq: 63, gain: 0 },
            { freq: 125, gain: 0 },
            { freq: 250, gain: 0 },
            { freq: 500, gain: 0 },
            { freq: 1000, gain: 0 },
            { freq: 2000, gain: 0 },
            { freq: 4000, gain: 0 },
            { freq: 8000, gain: 0 },
            { freq: 16000, gain: 0 }
          ]
        }
      }
    ],
    modulation: [
      {
        id: 'chorus',
        name: 'Chorus',
        parameters: {
          rate: 0.5,
          depth: 50,
          feedback: 20,
          delay: 25
        }
      },
      {
        id: 'flanger',
        name: 'Flanger',
        parameters: {
          rate: 0.25,
          depth: 70,
          feedback: 40,
          delay: 5
        }
      },
      {
        id: 'phaser',
        name: 'Phaser',
        parameters: {
          rate: 0.5,
          depth: 60,
          feedback: 30,
          stages: 4
        }
      }
    ],
    timeEffects: [
      {
        id: 'reverb',
        name: 'Reverb',
        parameters: {
          roomSize: 50,
          damping: 50,
          wetLevel: 30,
          dryLevel: 70,
          predelay: 20
        }
      },
      {
        id: 'delay',
        name: 'Delay',
        parameters: {
          time: 250,
          feedback: 35,
          wetLevel: 25,
          sync: false
        }
      },
      {
        id: 'echo',
        name: 'Echo',
        parameters: {
          time: 500,
          feedback: 20,
          wetLevel: 20
        }
      }
    ],
    distortion: [
      {
        id: 'overdrive',
        name: 'Overdrive',
        parameters: {
          drive: 30,
          tone: 50,
          level: 70
        }
      },
      {
        id: 'distortion',
        name: 'Distortion',
        parameters: {
          drive: 50,
          tone: 60,
          level: 60
        }
      },
      {
        id: 'bitcrusher',
        name: 'Bit Crusher',
        parameters: {
          bits: 8,
          sampleRate: 22050,
          mix: 50
        }
      }
    ]
  };

  // Generate default tracks if none provided
  const defaultTracks: AudioTrack[] = tracks.length > 0 ? tracks : [
    {
      id: 'master',
      name: 'Master',
      type: 'master',
      volume: 80,
      pan: 0,
      muted: false,
      solo: false,
      locked: false,
      visible: true,
      color: '#ff6b6b',
      clips: [],
      effects: []
    },
    {
      id: 'music',
      name: 'Music',
      type: 'music',
      volume: 70,
      pan: 0,
      muted: false,
      solo: false,
      locked: false,
      visible: true,
      color: '#4ecdc4',
      clips: [],
      effects: []
    },
    {
      id: 'voice',
      name: 'Voice',
      type: 'voice',
      volume: 85,
      pan: 0,
      muted: false,
      solo: false,
      locked: false,
      visible: true,
      color: '#45b7d1',
      clips: []
      effects: []
    },
    {
      id: 'sfx',
      name: 'Sound Effects',
      type: 'sfx',
      volume: 60,
      pan: 0,
      muted: false,
      solo: false,
      locked: false,
      visible: true,
      color: '#f9ca24',
      clips: [],
      effects: []
    }
  ];

  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>(defaultTracks);

  const updateTrack = useCallback((trackId: string, updates: Partial<AudioTrack>) => {
    setAudioTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, ...updates } : track
    ));
  }, []);

  const addEffect = (trackId: string, effectType: string, effectId: string) => {
    const effectTemplate = Object.values(audioEffects)
      .flat()
      .find(e => e.id === effectId);

    if (!effectTemplate) return;

    const newEffect: AudioEffect = {
      id: `${effectId}-${Date.now()}`,
      name: effectTemplate.name,
      type: effectType,
      enabled: true,
      parameters: { ...effectTemplate.parameters },
      bypass: false
    };

    updateTrack(trackId, {
      effects: [...(audioTracks.find(t => t.id === trackId)?.effects || []), newEffect]
    });
  };

  const removeEffect = (trackId: string, effectId: string) => {
    const track = audioTracks.find(t => t.id === trackId);
    if (!track) return;

    updateTrack(trackId, {
      effects: track.effects.filter(e => e.id !== effectId)
    });
  };

  const updateEffect = (trackId: string, effectId: string, updates: Partial<AudioEffect>) => {
    const track = audioTracks.find(t => t.id === trackId);
    if (!track) return;

    updateTrack(trackId, {
      effects: track.effects.map(effect =>
        effect.id === effectId ? { ...effect, ...updates } : effect
      )
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const renderWaveform = (clip: AudioClip, width: number, height: number) => {
    if (!clip.waveformData) return null;

    const canvas = waveformCanvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#3b82f6';
    ctx.strokeStyle = '#1d4ed8';

    const dataPoints = clip.waveformData.length;
    const barWidth = width / dataPoints;
    const centerY = height / 2;

    clip.waveformData.forEach((amplitude, index) => {
      const x = index * barWidth;
      const barHeight = amplitude * centerY;
      
      ctx.fillRect(x, centerY - barHeight, barWidth - 1, barHeight * 2);
    });

    return canvas.toDataURL();
  };

  const renderTrackControls = (track: AudioTrack) => (
    <div className="w-60 bg-gray-800 border-r border-gray-700 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">{track.name}</h3>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => updateTrack(track.id, { visible: !track.visible })}
            className={track.visible ? 'text-green-400' : 'text-gray-500'}
          >
            {track.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => updateTrack(track.id, { locked: !track.locked })}
            className={track.locked ? 'text-red-400' : 'text-gray-500'}
          >
            {track.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      {/* Volume */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-xs">Volume</Label>
          <span className="text-xs text-gray-400">{track.volume}</span>
        </div>
        <Slider
          value={[track.volume]}
          min={0}
          max={100}
          step={1}
          onValueChange={([value]) => updateTrack(track.id, { volume: value })}
          className="my-2"
        />
      </div>

      {/* Pan */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-xs">Pan</Label>
          <span className="text-xs text-gray-400">{track.pan > 0 ? `R${track.pan}` : track.pan < 0 ? `L${Math.abs(track.pan)}` : 'C'}</span>
        </div>
        <Slider
          value={[track.pan]}
          min={-100}
          max={100}
          step={1}
          onValueChange={([value]) => updateTrack(track.id, { pan: value })}
          className="my-2"
        />
      </div>

      {/* Control Buttons */}
      <div className="flex gap-1">
        <Button
          size="sm"
          variant={track.muted ? "default" : "ghost"}
          onClick={() => updateTrack(track.id, { muted: !track.muted })}
          className={track.muted ? 'bg-red-600' : 'text-gray-400'}
        >
          <VolumeX className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant={track.solo ? "default" : "ghost"}
          onClick={() => updateTrack(track.id, { solo: !track.solo })}
          className={track.solo ? 'bg-yellow-600' : 'text-gray-400'}
        >
          <Headphones className="h-3 w-3" />
        </Button>
      </div>

      {/* Effects Chain */}
      <div className="space-y-2">
        <Label className="text-xs">Effects</Label>
        <div className="space-y-1 max-h-20 overflow-y-auto">
          {track.effects.map(effect => (
            <div key={effect.id} className="flex items-center justify-between text-xs bg-gray-700 p-1 rounded">
              <span className={effect.enabled ? 'text-white' : 'text-gray-500'}>{effect.name}</span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => updateEffect(track.id, effect.id, { enabled: !effect.enabled })}
                  className={effect.enabled ? 'text-green-400' : 'text-gray-500'}
                >
                  <Zap className="h-2 w-2" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeEffect(track.id, effect.id)}
                  className="text-red-400"
                >
                  <Trash2 className="h-2 w-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setSelectedTrack(track.id)}
          className="w-full text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Effect
        </Button>
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="flex-1 bg-gray-900 overflow-auto">
      {/* Timeline Header */}
      <div className="h-8 bg-gray-800 border-b border-gray-700 flex items-center px-4">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>Timeline</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setZoomLevel(prev => Math.max(0.1, prev - 0.1))}>
              <Minus className="h-3 w-3" />
            </Button>
            <span>{Math.round(zoomLevel * 100)}%</span>
            <Button size="sm" variant="ghost" onClick={() => setZoomLevel(prev => Math.min(5, prev + 0.1))}>
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant={snapToGrid ? "default" : "ghost"}
              onClick={() => setSnapToGrid(!snapToGrid)}
            >
              <Square className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Time Ruler */}
      <div className="h-6 bg-gray-800 border-b border-gray-700 relative">
        {Array.from({ length: Math.ceil(duration / 10) + 1 }, (_, i) => (
          <div
            key={i}
            className="absolute text-xs text-gray-400"
            style={{ left: `${(i * 10 * zoomLevel * 50)}px`, top: '2px' }}
          >
            {formatTime(i * 10)}
          </div>
        ))}
      </div>

      {/* Track Lanes */}
      <div className="space-y-1">
        {audioTracks.map(track => (
          <div
            key={track.id}
            className={`h-16 relative ${track.visible ? 'block' : 'hidden'}`}
            style={{ borderLeft: `4px solid ${track.color}` }}
          >
            {/* Track Background */}
            <div className="absolute inset-0 bg-gray-800 hover:bg-gray-700" />
            
            {/* Audio Clips */}
            {track.clips.map(clip => {
              const clipWidth = clip.duration * zoomLevel * 50;
              const clipLeft = clip.startTime * zoomLevel * 50;
              
              return (
                <div
                  key={clip.id}
                  className={`absolute h-12 m-2 rounded cursor-pointer ${
                    clip.selected ? 'ring-2 ring-blue-400' : ''
                  }`}
                  style={{
                    left: `${clipLeft}px`,
                    width: `${clipWidth}px`,
                    backgroundColor: track.color + '80'
                  }}
                  onClick={() => setSelectedClip(clip.id)}
                >
                  <div className="p-1 text-xs text-white truncate">{clip.name}</div>
                  {/* Waveform would be rendered here */}
                  <canvas
                    ref={waveformCanvasRef}
                    width={clipWidth}
                    height={48}
                    className="absolute inset-0 opacity-60"
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Playhead */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none z-10"
        style={{ left: `${currentTime * zoomLevel * 50}px` }}
      />
    </div>
  );

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Audio Mixer</h2>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onPlayStateChange?.(!isPlaying)}
              className="text-white"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="ghost" className="text-white">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-white">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{formatTime(currentTime)} / {formatTime(duration)}</span>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-700">
              <TabsTrigger value="mixer" className="text-white">Mixer</TabsTrigger>
              <TabsTrigger value="effects" className="text-white">Effects</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Tabs value={activeTab} className="flex-1 flex flex-col">
        {/* Mixer View */}
        <TabsContent value="mixer" className="flex-1 flex">
          <div className="flex-1 flex">
            {/* Track Controls */}
            <div className="w-60 bg-gray-800 border-r border-gray-700 overflow-y-auto">
              {audioTracks.map(track => (
                <div key={track.id} className="border-b border-gray-700">
                  {renderTrackControls(track)}
                </div>
              ))}
            </div>

            {/* Timeline */}
            {renderTimeline()}
          </div>
        </TabsContent>

        {/* Effects View */}
        <TabsContent value="effects" className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Effects Library */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Effects Library</h3>
              
              <Tabs defaultValue="dynamics" className="w-full">
                <TabsList className="grid grid-cols-5 bg-gray-800">
                  <TabsTrigger value="dynamics">Dynamics</TabsTrigger>
                  <TabsTrigger value="eq">EQ</TabsTrigger>
                  <TabsTrigger value="modulation">Mod</TabsTrigger>
                  <TabsTrigger value="time">Time</TabsTrigger>
                  <TabsTrigger value="distortion">Dist</TabsTrigger>
                </TabsList>

                {Object.entries(audioEffects).map(([category, effects]) => (
                  <TabsContent key={category} value={category} className="space-y-2">
                    {effects.map(effect => (
                      <Card key={effect.id} className="bg-gray-800 border-gray-700">
                        <CardHeader className="p-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">{effect.name}</CardTitle>
                            <Button
                              size="sm"
                              onClick={() => selectedTrack && addEffect(selectedTrack, category, effect.id)}
                              disabled={!selectedTrack}
                            >
                              Add
                            </Button>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Selected Track Effects */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Track Effects {selectedTrack && `- ${audioTracks.find(t => t.id === selectedTrack)?.name}`}
              </h3>
              
              {selectedTrack ? (
                <div className="space-y-3">
                  {audioTracks
                    .find(t => t.id === selectedTrack)
                    ?.effects.map(effect => (
                      <Card key={effect.id} className="bg-gray-800 border-gray-700">
                        <CardHeader className="p-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">{effect.name}</CardTitle>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateEffect(selectedTrack, effect.id, { enabled: !effect.enabled })}
                                className={effect.enabled ? 'text-green-400' : 'text-gray-500'}
                              >
                                <Zap className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeEffect(selectedTrack, effect.id)}
                                className="text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          {/* Effect parameters would be rendered here */}
                          <div className="text-xs text-gray-400">
                            Effect parameters panel
                          </div>
                        </CardContent>
                      </Card>
                    )) || <div className="text-gray-400 text-sm">No effects applied</div>}
                </div>
              ) : (
                <div className="text-gray-400 text-sm">
                  Select a track to view and edit its effects
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
