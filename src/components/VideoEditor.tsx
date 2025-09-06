import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Slider } from '../components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Scissors, 
  Type, 
  Image, 
  Volume2, 
  Play, 
  Pause, 
  Download, 
  Undo, 
  Redo, 
  Save,
  Plus,
  Trash2,
  Move,
  RotateCcw
} from 'lucide-react';

interface VideoEdit {
  id: string;
  type: 'trim' | 'text' | 'overlay' | 'audio' | 'transition' | 'speed';
  timestamp: number;
  duration?: number;
  data: any;
}

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  startTime: number;
  endTime: number;
  fontFamily: string;
  style: string;
}

interface VideoEditorProps {
  videoId: string;
  videoUrl: string;
  duration: number;
  onSave: (edits: VideoEdit[]) => void;
}

export default function VideoEditor({ videoId, videoUrl, duration, onSave }: VideoEditorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [edits, setEdits] = useState<VideoEdit[]>([]);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('trim');
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(duration);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [loading, setLoading] = useState(false);

  // Text overlay state
  const [newText, setNewText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(24);
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const [textDuration, setTextDuration] = useState({ start: 0, end: 5 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    video.addEventListener('timeupdate', updateTime);
    
    return () => video.removeEventListener('timeupdate', updateTime);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current.volume = volume;
    }
  }, [playbackSpeed, volume]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = time;
    setCurrentTime(time);
  };

  const addTextOverlay = () => {
    if (!newText.trim()) return;

    const overlay: TextOverlay = {
      id: `text-${Date.now()}`,
      text: newText,
      x: textPosition.x,
      y: textPosition.y,
      fontSize,
      color: textColor,
      startTime: textDuration.start,
      endTime: textDuration.end,
      fontFamily: 'Arial',
      style: 'normal'
    };

    setTextOverlays(prev => [...prev, overlay]);
    
    const edit: VideoEdit = {
      id: `edit-${Date.now()}`,
      type: 'text',
      timestamp: Date.now(),
      data: overlay
    };
    
    setEdits(prev => [...prev, edit]);
    setNewText('');
  };

  const removeTextOverlay = (id: string) => {
    setTextOverlays(prev => prev.filter(overlay => overlay.id !== id));
    setEdits(prev => prev.filter(edit => edit.data.id !== id));
  };

  const applyTrim = () => {
    const edit: VideoEdit = {
      id: `edit-${Date.now()}`,
      type: 'trim',
      timestamp: Date.now(),
      data: { start: trimStart, end: trimEnd }
    };
    
    setEdits(prev => [...prev, edit]);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(edits);
    } catch (error) {
      console.error('Failed to save edits:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentOverlays = () => {
    return textOverlays.filter(
      overlay => currentTime >= overlay.startTime && currentTime <= overlay.endTime
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Editor</h1>
        <p className="text-gray-600">Add effects, trim, and customize your video</p>
      </div>

      {/* Video Preview Area */}
      <Card>
        <CardContent className="p-6">
          <div className="relative bg-black rounded-lg overflow-hidden mb-4">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-auto"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            
            {/* Text Overlays */}
            <div className="absolute inset-0 pointer-events-none">
              {getCurrentOverlays().map(overlay => (
                <div
                  key={overlay.id}
                  className="absolute"
                  style={{
                    left: `${overlay.x}%`,
                    top: `${overlay.y}%`,
                    color: overlay.color,
                    fontSize: `${overlay.fontSize}px`,
                    fontFamily: overlay.fontFamily,
                    fontWeight: overlay.style === 'bold' ? 'bold' : 'normal',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  {overlay.text}
                </div>
              ))}
            </div>
          </div>

          {/* Video Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button onClick={togglePlayPause} size="sm">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => seekTo(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <span className="text-sm text-gray-600 min-w-[80px]">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm">Speed:</span>
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="0.5">0.5x</option>
                  <option value="0.75">0.75x</option>
                  <option value="1">1x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editing Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tool Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Editing Tools</CardTitle>
            <CardDescription>Select a tool to edit your video</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTool} onValueChange={setSelectedTool}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="trim">
                  <Scissors className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="text">
                  <Type className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="overlay">
                  <Image className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="audio">
                  <Volume2 className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="trim" className="space-y-4">
                <div className="space-y-3">
                  <Label>Trim Video</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="w-16">Start:</Label>
                      <Input
                        type="number"
                        value={trimStart}
                        onChange={(e) => setTrimStart(parseFloat(e.target.value))}
                        min="0"
                        max={duration}
                        step="0.1"
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setTrimStart(currentTime)}
                      >
                        Current
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="w-16">End:</Label>
                      <Input
                        type="number"
                        value={trimEnd}
                        onChange={(e) => setTrimEnd(parseFloat(e.target.value))}
                        min="0"
                        max={duration}
                        step="0.1"
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setTrimEnd(currentTime)}
                      >
                        Current
                      </Button>
                    </div>
                  </div>
                  <Button onClick={applyTrim} className="w-full">
                    <Scissors className="h-4 w-4 mr-2" />
                    Apply Trim
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-4">
                <div className="space-y-3">
                  <Label>Add Text Overlay</Label>
                  <Input
                    placeholder="Enter text..."
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Font Size</Label>
                      <Input
                        type="number"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        min="12"
                        max="72"
                      />
                    </div>
                    <div>
                      <Label>Color</Label>
                      <Input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>X Position (%)</Label>
                      <Input
                        type="number"
                        value={textPosition.x}
                        onChange={(e) => setTextPosition(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <Label>Y Position (%)</Label>
                      <Input
                        type="number"
                        value={textPosition.y}
                        onChange={(e) => setTextPosition(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Start Time (s)</Label>
                      <Input
                        type="number"
                        value={textDuration.start}
                        onChange={(e) => setTextDuration(prev => ({ ...prev, start: parseFloat(e.target.value) }))}
                        min="0"
                        max={duration}
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label>End Time (s)</Label>
                      <Input
                        type="number"
                        value={textDuration.end}
                        onChange={(e) => setTextDuration(prev => ({ ...prev, end: parseFloat(e.target.value) }))}
                        min="0"
                        max={duration}
                        step="0.1"
                      />
                    </div>
                  </div>

                  <Button onClick={addTextOverlay} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Text
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="overlay" className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Image overlay feature coming soon!</p>
                </div>
              </TabsContent>

              <TabsContent value="audio" className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <Volume2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Audio editing feature coming soon!</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Edit History & Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Applied Effects</CardTitle>
            <CardDescription>Manage your edits and overlays</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Text Overlays List */}
            <div className="space-y-2">
              <Label>Text Overlays ({textOverlays.length})</Label>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {textOverlays.map(overlay => (
                  <div key={overlay.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{overlay.text}</div>
                      <div className="text-xs text-gray-500">
                        {formatTime(overlay.startTime)} - {formatTime(overlay.endTime)}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTextOverlay(overlay.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {textOverlays.length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No text overlays added yet
                  </div>
                )}
              </div>
            </div>

            {/* Edit History */}
            <div className="space-y-2">
              <Label>Edit History ({edits.length})</Label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {edits.slice(-5).map(edit => (
                  <div key={edit.id} className="text-sm p-2 bg-gray-50 rounded">
                    <span className="capitalize font-medium">{edit.type}</span>
                    <span className="text-gray-500 ml-2">
                      {new Date(edit.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                {edits.length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No edits applied yet
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button 
                onClick={handleSave} 
                disabled={loading || edits.length === 0}
                className="flex-1"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Edits
              </Button>
              
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
