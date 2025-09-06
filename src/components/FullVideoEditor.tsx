import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Slider } from '../components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import AdvancedEffects from './AdvancedEffects';
import AudioMixer from './AudioMixer';
import MotionGraphics from './MotionGraphics';
import ExportSystem from './ExportSystem';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Scissors, 
  Copy, 
  Layers, 
  Wand2, 
  Palette, 
  Music, 
  Type, 
  Image, 
  Video, 
  Download, 
  Upload, 
  Save, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut,
  Move,
  RotateCcw,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Settings,
  Plus,
  Minus,
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  Zap,
  Sparkles,
  Droplets,
  Flame,
  Sun,
  Moon,
  CloudRain,
  Wind
} from 'lucide-react';

interface TimelineTrack {
  id: string;
  type: 'video' | 'audio' | 'text' | 'effects';
  name: string;
  clips: TimelineClip[];
  isVisible: boolean;
  isLocked: boolean;
  volume?: number;
  muted?: boolean;
}

interface TimelineClip {
  id: string;
  type: 'video' | 'audio' | 'text' | 'image' | 'effect';
  name: string;
  startTime: number;
  duration: number;
  trimIn: number;
  trimOut: number;
  volume?: number;
  speed?: number;
  effects: Effect[];
  properties: any;
}

interface Effect {
  id: string;
  type: string;
  name: string;
  parameters: { [key: string]: any };
  enabled: boolean;
  startTime?: number;
  endTime?: number;
}

interface Keyframe {
  time: number;
  value: any;
  interpolation: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bezier';
}

interface Property {
  name: string;
  value: any;
  keyframes: Keyframe[];
  animated: boolean;
}

interface VideoEditorProps {
  videoId?: string;
  projectData?: any;
  onSave?: (projectData: any) => void;
  onExport?: (exportSettings: any) => void;
}

const ZOOM_LEVELS = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8];
const SNAP_INTERVALS = [1, 5, 10, 30]; // seconds

export default function FullVideoEditor({ videoId, projectData, onSave, onExport }: VideoEditorProps) {
  // Core state
  const [tracks, setTracks] = useState<TimelineTrack[]>([
    {
      id: 'video-1',
      type: 'video',
      name: 'Video Track 1',
      clips: [],
      isVisible: true,
      isLocked: false
    },
    {
      id: 'audio-1', 
      type: 'audio',
      name: 'Audio Track 1',
      clips: [],
      isVisible: true,
      isLocked: false,
      volume: 1,
      muted: false
    }
  ]);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300); // 5 minutes default
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [snapInterval, setSnapInterval] = useState(1);
  
  // Selection and editing
  const [selectedClips, setSelectedClips] = useState<Set<string>>(new Set());
  const [selectedTrack, setSelectedTrack] = useState<string>('video-1');
  const [clipboardClips, setClipboardClips] = useState<TimelineClip[]>([]);
  const [dragData, setDragData] = useState<any>(null);
  
  // UI state
  const [activePanel, setActivePanel] = useState<string>('properties');
  const [showEffectLibrary, setShowEffectLibrary] = useState(false);
  const [previewQuality, setPreviewQuality] = useState<'low' | 'medium' | 'high'>('medium');
  
  // History for undo/redo
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Refs
  const timelineRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Effect presets
  const videoEffects = [
    { id: 'blur', name: 'Blur', icon: Droplets, category: 'filter' },
    { id: 'brightness', name: 'Brightness', icon: Sun, category: 'color' },
    { id: 'contrast', name: 'Contrast', icon: Moon, category: 'color' },
    { id: 'saturation', name: 'Saturation', icon: Palette, category: 'color' },
    { id: 'fade-in', name: 'Fade In', icon: Zap, category: 'transition' },
    { id: 'fade-out', name: 'Fade Out', icon: Zap, category: 'transition' },
    { id: 'cross-fade', name: 'Cross Fade', icon: Sparkles, category: 'transition' },
    { id: 'zoom-in', name: 'Zoom In', icon: ZoomIn, category: 'motion' },
    { id: 'zoom-out', name: 'Zoom Out', icon: ZoomOut, category: 'motion' },
    { id: 'pan-left', name: 'Pan Left', icon: Move, category: 'motion' },
    { id: 'pan-right', name: 'Pan Right', icon: Move, category: 'motion' },
    { id: 'rotate', name: 'Rotate', icon: RotateCcw, category: 'motion' },
    { id: 'noise', name: 'Film Grain', icon: Wind, category: 'stylize' },
    { id: 'vintage', name: 'Vintage', icon: Star, category: 'stylize' },
    { id: 'glow', name: 'Glow', icon: Sparkles, category: 'stylize' }
  ];

  const audioEffects = [
    { id: 'volume', name: 'Volume', icon: Volume2, category: 'basic' },
    { id: 'fade-in-audio', name: 'Audio Fade In', icon: Zap, category: 'transition' },
    { id: 'fade-out-audio', name: 'Audio Fade Out', icon: Zap, category: 'transition' },
    { id: 'eq', name: 'Equalizer', icon: Settings, category: 'enhancement' },
    { id: 'reverb', name: 'Reverb', icon: CloudRain, category: 'enhancement' },
    { id: 'echo', name: 'Echo', icon: Wind, category: 'enhancement' },
    { id: 'noise-reduction', name: 'Noise Reduction', icon: Droplets, category: 'cleanup' }
  ];

  // Timeline utilities
  const timeToPixels = useCallback((time: number) => {
    return time * zoom * 100; // 100px per second at 1x zoom
  }, [zoom]);

  const pixelsToTime = useCallback((pixels: number) => {
    return pixels / (zoom * 100);
  }, [zoom]);

  const snapTime = useCallback((time: number) => {
    if (!snapToGrid) return time;
    return Math.round(time / snapInterval) * snapInterval;
  }, [snapToGrid, snapInterval]);

  // Playback controls
  const togglePlayback = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const seekTo = useCallback((time: number) => {
    setCurrentTime(Math.max(0, Math.min(duration, time)));
  }, [duration]);

  const skipBackward = useCallback(() => {
    seekTo(currentTime - 10);
  }, [currentTime, seekTo]);

  const skipForward = useCallback(() => {
    seekTo(currentTime + 10);
  }, [currentTime, seekTo]);

  // Track management
  const addTrack = useCallback((type: 'video' | 'audio' | 'text' | 'effects') => {
    const newTrack: TimelineTrack = {
      id: `${type}-${Date.now()}`,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Track ${tracks.filter(t => t.type === type).length + 1}`,
      clips: [],
      isVisible: true,
      isLocked: false,
      ...(type === 'audio' && { volume: 1, muted: false })
    };
    
    setTracks(prev => [...prev, newTrack]);
  }, [tracks]);

  const deleteTrack = useCallback((trackId: string) => {
    setTracks(prev => prev.filter(t => t.id !== trackId));
  }, []);

  const toggleTrackVisibility = useCallback((trackId: string) => {
    setTracks(prev => prev.map(track => 
      track.id === trackId 
        ? { ...track, isVisible: !track.isVisible }
        : track
    ));
  }, []);

  const toggleTrackLock = useCallback((trackId: string) => {
    setTracks(prev => prev.map(track => 
      track.id === trackId 
        ? { ...track, isLocked: !track.isLocked }
        : track
    ));
  }, []);

  // Clip management
  const addClip = useCallback((trackId: string, clipData: Partial<TimelineClip>) => {
    const newClip: TimelineClip = {
      id: `clip-${Date.now()}`,
      type: 'video',
      name: 'New Clip',
      startTime: currentTime,
      duration: 10,
      trimIn: 0,
      trimOut: 10,
      effects: [],
      properties: {},
      ...clipData
    };

    setTracks(prev => prev.map(track => 
      track.id === trackId 
        ? { ...track, clips: [...track.clips, newClip] }
        : track
    ));
  }, [currentTime]);

  const deleteClip = useCallback((clipId: string) => {
    setTracks(prev => prev.map(track => ({
      ...track,
      clips: track.clips.filter(clip => clip.id !== clipId)
    })));
    setSelectedClips(prev => {
      const newSet = new Set(prev);
      newSet.delete(clipId);
      return newSet;
    });
  }, []);

  const splitClip = useCallback((clipId: string, splitTime: number) => {
    setTracks(prev => prev.map(track => ({
      ...track,
      clips: track.clips.flatMap(clip => {
        if (clip.id !== clipId) return clip;
        
        const relativeTime = splitTime - clip.startTime;
        if (relativeTime <= 0 || relativeTime >= clip.duration) return clip;
        
        const firstClip: TimelineClip = {
          ...clip,
          id: `${clip.id}-1`,
          duration: relativeTime,
          trimOut: clip.trimIn + relativeTime
        };
        
        const secondClip: TimelineClip = {
          ...clip,
          id: `${clip.id}-2`,
          startTime: splitTime,
          duration: clip.duration - relativeTime,
          trimIn: clip.trimIn + relativeTime
        };
        
        return [firstClip, secondClip];
      })
    })));
  }, []);

  // Effect management
  const addEffect = useCallback((clipId: string, effectType: string) => {
    const effect: Effect = {
      id: `effect-${Date.now()}`,
      type: effectType,
      name: videoEffects.find(e => e.id === effectType)?.name || effectType,
      parameters: getDefaultEffectParameters(effectType),
      enabled: true
    };

    setTracks(prev => prev.map(track => ({
      ...track,
      clips: track.clips.map(clip => 
        clip.id === clipId 
          ? { ...clip, effects: [...clip.effects, effect] }
          : clip
      )
    })));
  }, []);

  const removeEffect = useCallback((clipId: string, effectId: string) => {
    setTracks(prev => prev.map(track => ({
      ...track,
      clips: track.clips.map(clip => 
        clip.id === clipId 
          ? { ...clip, effects: clip.effects.filter(e => e.id !== effectId) }
          : clip
      )
    })));
  }, []);

  const updateEffectParameter = useCallback((clipId: string, effectId: string, parameter: string, value: any) => {
    setTracks(prev => prev.map(track => ({
      ...track,
      clips: track.clips.map(clip => 
        clip.id === clipId 
          ? {
              ...clip,
              effects: clip.effects.map(effect =>
                effect.id === effectId
                  ? { ...effect, parameters: { ...effect.parameters, [parameter]: value } }
                  : effect
              )
            }
          : clip
      )
    })));
  }, []);

  // Utility functions
  function getDefaultEffectParameters(effectType: string): any {
    switch (effectType) {
      case 'blur':
        return { amount: 5, type: 'gaussian' };
      case 'brightness':
        return { level: 0 }; // -100 to 100
      case 'contrast':
        return { level: 0 }; // -100 to 100
      case 'saturation':
        return { level: 0 }; // -100 to 100
      case 'fade-in':
        return { duration: 1 };
      case 'fade-out':
        return { duration: 1 };
      case 'zoom-in':
        return { scale: 1.2, duration: 2 };
      case 'zoom-out':
        return { scale: 0.8, duration: 2 };
      case 'rotate':
        return { angle: 0, speed: 1 };
      case 'volume':
        return { level: 100 }; // 0 to 200
      default:
        return {};
    }
  }

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 30); // Assuming 30fps
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${frames.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}.${frames.toString().padStart(2, '0')}`;
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              // Redo
            } else {
              // Undo
            }
            break;
          case 'c':
            e.preventDefault();
            // Copy selected clips
            break;
          case 'v':
            e.preventDefault();
            // Paste clips
            break;
          case 's':
            e.preventDefault();
            onSave?.(tracks);
            break;
        }
      } else {
        switch (e.key) {
          case ' ':
            e.preventDefault();
            togglePlayback();
            break;
          case 'Delete':
            selectedClips.forEach(clipId => deleteClip(clipId));
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedClips, deleteClip, togglePlayback, onSave, tracks]);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Top Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="text-white hover:bg-gray-700">
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-gray-700">
            <Upload className="h-4 w-4 mr-1" />
            Import
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-gray-700">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          
          <div className="h-6 w-px bg-gray-600 mx-2" />
          
          <Button size="sm" variant="ghost" className="text-white hover:bg-gray-700">
            <Undo className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-gray-700">
            <Redo className="h-4 w-4" />
          </Button>
          
          <div className="h-6 w-px bg-gray-600 mx-2" />
          
          <Button size="sm" variant="ghost" className="text-white hover:bg-gray-700">
            <Scissors className="h-4 w-4 mr-1" />
            Cut
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-gray-700">
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm">
            Quality: 
            <select 
              value={previewQuality} 
              onChange={(e) => setPreviewQuality(e.target.value as any)}
              className="ml-2 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">Snap:</span>
            <input
              type="checkbox"
              checked={snapToGrid}
              onChange={(e) => setSnapToGrid(e.target.checked)}
              className="w-4 h-4"
            />
            <select
              value={snapInterval}
              onChange={(e) => setSnapInterval(parseFloat(e.target.value))}
              className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
              disabled={!snapToGrid}
            >
              {SNAP_INTERVALS.map(interval => (
                <option key={interval} value={interval}>{interval}s</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Asset Library */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          <Tabs value={activePanel} onValueChange={setActivePanel} className="flex-1">
            <TabsList className="grid grid-cols-6 w-full bg-gray-700">
              <TabsTrigger value="assets" className="text-white">
                <Image className="h-4 w-4 mr-1" />
                Assets
              </TabsTrigger>
              <TabsTrigger value="effects" className="text-white">
                <Wand2 className="h-4 w-4 mr-1" />
                Effects
              </TabsTrigger>
              <TabsTrigger value="motion" className="text-white">
                <Type className="h-4 w-4 mr-1" />
                Motion
              </TabsTrigger>
              <TabsTrigger value="audio" className="text-white">
                <Music className="h-4 w-4 mr-1" />
                Audio
              </TabsTrigger>
              <TabsTrigger value="export" className="text-white">
                <Download className="h-4 w-4 mr-1" />
                Export
              </TabsTrigger>
              <TabsTrigger value="properties" className="text-white">
                <Settings className="h-4 w-4 mr-1" />
                Properties
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assets" className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <Button className="w-full" onClick={() => {}}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Media
                </Button>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Recent Files</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Asset thumbnails would go here */}
                    <div className="aspect-video bg-gray-700 rounded flex items-center justify-center">
                      <Video className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="aspect-video bg-gray-700 rounded flex items-center justify-center">
                      <Image className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="effects" className="flex-1 p-0">
              <AdvancedEffects
                clipId={selectedClips.size === 1 ? Array.from(selectedClips)[0] : undefined}
                onEffectChange={(effects) => {
                  console.log('Effects changed:', effects);
                }}
                onPreviewFrame={(frameData) => {
                  console.log('Preview frame:', frameData);
                }}
              />
            </TabsContent>

            <TabsContent value="properties" className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {selectedClips.size > 0 ? (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">
                      Selected Clips ({selectedClips.size})
                    </h3>
                    
                    {/* Properties for selected clips */}
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Position</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="X" className="bg-gray-700 border-gray-600 text-white" />
                          <Input placeholder="Y" className="bg-gray-700 border-gray-600 text-white" />
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs">Scale</Label>
                        <Slider
                          value={[100]}
                          min={10}
                          max={500}
                          step={1}
                          className="my-2"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs">Rotation</Label>
                        <Slider
                          value={[0]}
                          min={-180}
                          max={180}
                          step={1}
                          className="my-2"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs">Opacity</Label>
                        <Slider
                          value={[100]}
                          min={0}
                          max={100}
                          step={1}
                          className="my-2"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Select clips to edit properties</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="motion" className="flex-1 p-0">
              <MotionGraphics
                currentTime={currentTime}
                duration={duration}
                fps={30}
                resolution={{ width: 1920, height: 1080 }}
                onTimeChange={setCurrentTime}
              />
            </TabsContent>

            <TabsContent value="audio" className="flex-1 p-0">
              <AudioMixer
                currentTime={currentTime}
                duration={duration}
                isPlaying={isPlaying}
                onTimeChange={setCurrentTime}
                onPlayStateChange={setIsPlaying}
              />
            </TabsContent>

            <TabsContent value="export" className="flex-1 p-0">
              <ExportSystem
                duration={duration}
                onExportComplete={(job) => {
                  console.log('Export completed:', job);
                }}
                onExportProgress={(job) => {
                  console.log('Export progress:', job.progress);
                }}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Center Panel - Preview and Timeline */}
        <div className="flex-1 flex flex-col">
          {/* Preview Area */}
          <div className="flex-1 bg-black flex items-center justify-center relative">
            <div className="relative max-w-full max-h-full">
              <video
                ref={previewRef}
                className="max-w-full max-h-full"
                controls={false}
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
              />
            </div>
            
            {/* Preview Overlay Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="sm" variant="ghost" className="bg-black bg-opacity-50 text-white">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="bg-black bg-opacity-50 text-white">
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Transport Controls */}
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="flex items-center justify-center gap-4">
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-gray-700"
                onClick={skipBackward}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button 
                size="lg" 
                variant="ghost" 
                className="text-white hover:bg-gray-700"
                onClick={togglePlayback}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-gray-700"
                onClick={skipForward}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-2 ml-8">
                <Volume2 className="h-4 w-4" />
                <Slider
                  value={[100]}
                  min={0}
                  max={100}
                  step={1}
                  className="w-20"
                />
              </div>
              
              <div className="ml-8 text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="h-80 bg-gray-900 border-t border-gray-700 flex flex-col">
            {/* Timeline Header */}
            <div className="bg-gray-800 p-2 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="text-white" onClick={() => addTrack('video')}>
                  <Plus className="h-4 w-4 mr-1" />
                  Video
                </Button>
                <Button size="sm" variant="ghost" className="text-white" onClick={() => addTrack('audio')}>
                  <Plus className="h-4 w-4 mr-1" />
                  Audio
                </Button>
                <Button size="sm" variant="ghost" className="text-white" onClick={() => addTrack('text')}>
                  <Plus className="h-4 w-4 mr-1" />
                  Text
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="text-white" onClick={() => setZoom(Math.max(0.1, zoom / 1.5))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm">{Math.round(zoom * 100)}%</span>
                <Button size="sm" variant="ghost" className="text-white" onClick={() => setZoom(Math.min(8, zoom * 1.5))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Timeline Ruler */}
            <div className="h-8 bg-gray-800 border-b border-gray-700 relative overflow-hidden">
              <div className="absolute inset-0 flex">
                {Array.from({ length: Math.ceil(duration / 10) }, (_, i) => (
                  <div key={i} className="flex-shrink-0 border-r border-gray-600" style={{ width: timeToPixels(10) }}>
                    <div className="text-xs text-gray-400 px-1">{formatTime(i * 10)}</div>
                  </div>
                ))}
              </div>
              
              {/* Playhead */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                style={{ left: timeToPixels(currentTime) }}
              />
            </div>

            {/* Timeline Tracks */}
            <div className="flex-1 overflow-y-auto">
              {tracks.map(track => (
                <div key={track.id} className="h-16 border-b border-gray-700 flex">
                  {/* Track Header */}
                  <div className="w-48 bg-gray-800 border-r border-gray-700 p-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white p-1"
                        onClick={() => toggleTrackVisibility(track.id)}
                      >
                        {track.isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white p-1"
                        onClick={() => toggleTrackLock(track.id)}
                      >
                        {track.isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                      </Button>
                      <span className="text-xs truncate">{track.name}</span>
                    </div>
                    
                    {track.type === 'audio' && (
                      <div className="flex items-center gap-1">
                        <Volume2 className="h-3 w-3" />
                        <div className="w-8 h-1 bg-gray-600 rounded">
                          <div 
                            className="h-full bg-blue-500 rounded" 
                            style={{ width: `${(track.volume || 1) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Track Content */}
                  <div className="flex-1 relative bg-gray-900">
                    {track.clips.map(clip => (
                      <div
                        key={clip.id}
                        className={`absolute top-1 bottom-1 rounded border-2 cursor-pointer ${
                          selectedClips.has(clip.id) 
                            ? 'border-blue-500 bg-blue-600 bg-opacity-20' 
                            : 'border-gray-600 bg-gray-700'
                        }`}
                        style={{
                          left: timeToPixels(clip.startTime),
                          width: timeToPixels(clip.duration)
                        }}
                        onClick={() => {
                          setSelectedClips(new Set([clip.id]));
                        }}
                      >
                        <div className="p-1 truncate text-xs">
                          {clip.name}
                        </div>
                        
                        {/* Clip Effects Indicators */}
                        {clip.effects.length > 0 && (
                          <div className="absolute top-0 right-0 bg-purple-600 text-xs px-1 rounded-bl">
                            {clip.effects.length}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
