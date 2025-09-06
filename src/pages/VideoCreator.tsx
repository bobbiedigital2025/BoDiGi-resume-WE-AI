import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PlayCircle, Download, Share2, Edit, Trash2, Clock, Video, Image, Wand2 } from 'lucide-react';

interface VideoConfig {
  duration: 30 | 60 | 180;
  style: 'cinematic' | 'animation' | 'documentary' | 'social' | 'promotional';
  resolution: '720p' | '1080p' | '4k';
  fps: 24 | 30 | 60;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3';
}

interface GeneratedVideo {
  id: string;
  prompt: string;
  config: VideoConfig;
  scenes: any[];
  url: string;
  duration: number;
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
}

const defaultConfig: VideoConfig = {
  duration: 30,
  style: 'cinematic',
  resolution: '1080p',
  fps: 30,
  aspectRatio: '16:9'
};

const styleDescriptions = {
  cinematic: 'Professional, movie-like quality with dramatic lighting and smooth transitions',
  animation: 'Vibrant, cartoon-style with dynamic movement and colorful visuals',
  documentary: 'Natural, realistic style perfect for educational or informational content',
  social: 'Modern, trendy style optimized for social media platforms',
  promotional: 'High-energy, commercial style designed to showcase products or services'
};

const durationLabels = {
  30: '30 seconds - Perfect for social media clips',
  60: '1 minute - Ideal for presentations and demos',
  180: '3 minutes - Great for detailed storytelling'
};

export default function VideoCreator() {
  const [prompt, setPrompt] = useState('');
  const [config, setConfig] = useState<VideoConfig>(defaultConfig);
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<GeneratedVideo | null>(null);
  const [activeTab, setActiveTab] = useState('create');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load user's videos on component mount
  useEffect(() => {
    loadUserVideos();
  }, []);

  const loadUserVideos = async () => {
    try {
      const response = await fetch('/api/videos/list');
      const data = await response.json();
      if (data.videos) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error('Failed to load videos:', error);
    }
  };

  const handleCreateVideo = async () => {
    if (!prompt.trim()) {
      setError('Please enter a video prompt');
      return;
    }

    setLoading(true);
    setError('');
    setProgress(0);

    try {
      // Create progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 1000);

      const response = await fetch('/api/videos/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, config }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error('Failed to generate video');
      }

      const data = await response.json();
      
      if (data.success) {
        setSelectedVideo(data.video);
        setActiveTab('preview');
        loadUserVideos(); // Refresh video list
        setPrompt(''); // Clear the prompt
      } else {
        throw new Error(data.error || 'Video generation failed');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleConfigChange = (key: keyof VideoConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setVideos(prev => prev.filter(v => v.id !== videoId));
        if (selectedVideo?.id === videoId) {
          setSelectedVideo(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete video:', error);
    }
  };

  const handleDownloadVideo = (video: GeneratedVideo) => {
    const link = document.createElement('a');
    link.href = video.url;
    link.download = `video-${video.id}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  const getEstimatedTime = (duration: number) => {
    const baseTime = duration * 2; // 2 seconds processing per video second
    return `~${Math.ceil(baseTime / 60)} minutes`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Video className="h-10 w-10 text-purple-600" />
            AI Video Creator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your ideas into stunning videos with AI. Choose from multiple durations and styles.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Create Video
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              My Videos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Video Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Video Settings</CardTitle>
                  <CardDescription>
                    Configure your video properties and style
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Prompt Input */}
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Video Prompt</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Describe your video... (e.g., 'A peaceful sunrise over mountains with soft piano music')"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  {/* Duration Selection */}
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {[30, 60, 180].map((duration) => (
                        <Button
                          key={duration}
                          variant={config.duration === duration ? "default" : "outline"}
                          onClick={() => handleConfigChange('duration', duration)}
                          className="justify-start text-left h-auto p-4"
                        >
                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {formatDuration(duration)}
                            </div>
                            <div className="text-sm opacity-80">
                              {durationLabels[duration]} • Est. {getEstimatedTime(duration)}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Style Selection */}
                  <div className="space-y-2">
                    <Label>Video Style</Label>
                    <Select value={config.style} onValueChange={(value) => handleConfigChange('style', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(styleDescriptions).map(([key, description]) => (
                          <SelectItem key={key} value={key}>
                            <div>
                              <div className="font-medium capitalize">{key}</div>
                              <div className="text-sm text-gray-500">{description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Advanced Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Resolution</Label>
                      <Select value={config.resolution} onValueChange={(value) => handleConfigChange('resolution', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="720p">720p HD</SelectItem>
                          <SelectItem value="1080p">1080p Full HD</SelectItem>
                          <SelectItem value="4k">4K Ultra HD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Frame Rate</Label>
                      <Select value={config.fps.toString()} onValueChange={(value) => handleConfigChange('fps', parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24">24 FPS (Cinematic)</SelectItem>
                          <SelectItem value="30">30 FPS (Standard)</SelectItem>
                          <SelectItem value="60">60 FPS (Smooth)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Aspect Ratio</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: '16:9', label: '16:9 (Landscape)' },
                        { value: '9:16', label: '9:16 (Portrait)' },
                        { value: '1:1', label: '1:1 (Square)' },
                        { value: '4:3', label: '4:3 (Classic)' }
                      ].map(({ value, label }) => (
                        <Button
                          key={value}
                          variant={config.aspectRatio === value ? "default" : "outline"}
                          onClick={() => handleConfigChange('aspectRatio', value)}
                          size="sm"
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generation Area */}
              <Card>
                <CardHeader>
                  <CardTitle>Generate Your Video</CardTitle>
                  <CardDescription>
                    Preview your settings and start video generation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Settings Preview */}
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <h4 className="font-semibold text-gray-900">Video Summary</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <Badge variant="secondary">{formatDuration(config.duration)}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Style:</span>
                        <Badge variant="secondary" className="capitalize">{config.style}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Resolution:</span>
                        <Badge variant="secondary">{config.resolution}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frame Rate:</span>
                        <Badge variant="secondary">{config.fps} FPS</Badge>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Estimated Time:</span>
                        <span className="font-medium">{getEstimatedTime(config.duration)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Generation Progress */}
                  {loading && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Generating video...</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="text-xs text-gray-500 text-center">
                        {progress < 30 && "Analyzing prompt and generating scenes..."}
                        {progress >= 30 && progress < 60 && "Creating visual elements..."}
                        {progress >= 60 && progress < 90 && "Rendering video frames..."}
                        {progress >= 90 && "Finalizing video..."}
                      </div>
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Generate Button */}
                  <Button
                    onClick={handleCreateVideo}
                    disabled={loading || !prompt.trim()}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Generating Video...
                      </>
                    ) : (
                      <>
                        <Video className="h-5 w-5 mr-2" />
                        Generate Video
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            {selectedVideo ? (
              <Card>
                <CardHeader>
                  <CardTitle>Video Preview</CardTitle>
                  <CardDescription>
                    Generated on {new Date(selectedVideo.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      controls
                      className="w-full h-full"
                      src={selectedVideo.url}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">"{selectedVideo.prompt}"</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{formatDuration(selectedVideo.duration)}</span>
                        <span className="capitalize">{selectedVideo.config.style}</span>
                        <span>{selectedVideo.config.resolution}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadVideo(selectedVideo)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Video className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Video Selected</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Generate a new video or select one from your library to preview it here.
                  </p>
                  <Button onClick={() => setActiveTab('create')}>
                    Create New Video
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Videos</h2>
              <Button onClick={loadUserVideos} variant="outline" size="sm">
                Refresh
              </Button>
            </div>

            {videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => (
                  <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-200 relative">
                      <video
                        className="w-full h-full object-cover"
                        src={video.url}
                        onClick={() => setSelectedVideo(video)}
                      />
                      <Button
                        size="sm"
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                        onClick={() => {
                          setSelectedVideo(video);
                          setActiveTab('preview');
                        }}
                      >
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {video.prompt}
                      </h3>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <span>{formatDuration(video.duration)}</span>
                        <Badge variant="secondary" className="capitalize">
                          {video.config.style}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(video.createdAt).toLocaleDateString()}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadVideo(video)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteVideo(video.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Image className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Videos Yet</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Create your first AI-generated video to get started.
                  </p>
                  <Button onClick={() => setActiveTab('create')}>
                    Create Your First Video
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
