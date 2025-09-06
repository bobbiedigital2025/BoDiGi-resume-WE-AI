import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Slider } from '../components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Download,
  Upload,
  Cloud,
  HardDrive,
  Settings,
  Play,
  Monitor,
  Smartphone,
  Tablet,
  Tv,
  Globe,
  Share2,
  Clock,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  FileVideo,
  Film,
  Camera,
  Music,
  Image,
  File,
  Folder,
  Archive,
  Server,
  Cpu,
  MemoryStick,
  Eye,
  BarChart3,
  TrendingUp,
  Activity,
  Gauge
} from 'lucide-react';

interface ExportProfile {
  id: string;
  name: string;
  description: string;
  platform: 'youtube' | 'instagram' | 'tiktok' | 'twitter' | 'facebook' | 'linkedin' | 'custom';
  format: 'mp4' | 'mov' | 'avi' | 'webm' | 'gif' | 'mp3' | 'wav';
  resolution: { width: number; height: number };
  fps: number;
  bitrate: number;
  quality: 'low' | 'medium' | 'high' | 'ultra' | 'custom';
  codec: 'h264' | 'h265' | 'vp9' | 'av1' | 'prores';
  audioCodec: 'aac' | 'mp3' | 'flac' | 'opus';
  audioBitrate: number;
  audioSampleRate: 44100 | 48000 | 96000;
  colorSpace: 'rec709' | 'rec2020' | 'p3';
  hdr: boolean;
  interlaced: boolean;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3' | '21:9' | 'custom';
  maxFileSize?: number; // MB
  duration?: { start: number; end: number };
  watermark?: {
    enabled: boolean;
    type: 'text' | 'image';
    content: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity: number;
    size: number;
  };
}

interface RenderJob {
  id: string;
  name: string;
  profile: ExportProfile;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  startTime?: Date;
  endTime?: Date;
  estimatedTime?: number;
  outputPath?: string;
  outputUrl?: string;
  fileSize?: number;
  error?: string;
  renderStats?: {
    framesProcessed: number;
    totalFrames: number;
    averageFps: number;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
  };
}

interface CloudProvider {
  id: string;
  name: string;
  description: string;
  pricing: {
    cpu: number; // per hour
    gpu: number; // per hour
    storage: number; // per GB
    bandwidth: number; // per GB
  };
  capabilities: {
    maxResolution: { width: number; height: number };
    maxFps: number;
    supportedCodecs: string[];
    hdrSupport: boolean;
    gpuAcceleration: boolean;
    parallelJobs: number;
  };
  regions: string[];
  status: 'available' | 'limited' | 'maintenance';
}

interface ExportSystemProps {
  projectId?: string;
  duration?: number;
  onExportComplete?: (job: RenderJob) => void;
  onExportProgress?: (job: RenderJob) => void;
}

export default function ExportSystem({ 
  projectId, 
  duration = 300,
  onExportComplete,
  onExportProgress 
}: ExportSystemProps) {
  const [activeTab, setActiveTab] = useState('profiles');
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [customProfile, setCustomProfile] = useState<Partial<ExportProfile>>({});
  const [renderJobs, setRenderJobs] = useState<RenderJob[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('local');
  const [batchExport, setBatchExport] = useState(false);
  const [previewEnabled, setPreviewEnabled] = useState(true);

  // Predefined export profiles
  const exportProfiles: ExportProfile[] = [
    // YouTube
    {
      id: 'youtube-1080p',
      name: 'YouTube 1080p',
      description: 'Optimized for YouTube HD uploads',
      platform: 'youtube',
      format: 'mp4',
      resolution: { width: 1920, height: 1080 },
      fps: 30,
      bitrate: 8000,
      quality: 'high',
      codec: 'h264',
      audioCodec: 'aac',
      audioBitrate: 128,
      audioSampleRate: 48000,
      colorSpace: 'rec709',
      hdr: false,
      interlaced: false,
      aspectRatio: '16:9'
    },
    {
      id: 'youtube-4k',
      name: 'YouTube 4K',
      description: 'Ultra HD for YouTube premium content',
      platform: 'youtube',
      format: 'mp4',
      resolution: { width: 3840, height: 2160 },
      fps: 60,
      bitrate: 45000,
      quality: 'ultra',
      codec: 'h265',
      audioCodec: 'aac',
      audioBitrate: 192,
      audioSampleRate: 48000,
      colorSpace: 'rec2020',
      hdr: true,
      interlaced: false,
      aspectRatio: '16:9'
    },
    // Instagram
    {
      id: 'instagram-story',
      name: 'Instagram Story',
      description: 'Vertical format for Instagram Stories',
      platform: 'instagram',
      format: 'mp4',
      resolution: { width: 1080, height: 1920 },
      fps: 30,
      bitrate: 3500,
      quality: 'high',
      codec: 'h264',
      audioCodec: 'aac',
      audioBitrate: 128,
      audioSampleRate: 44100,
      colorSpace: 'rec709',
      hdr: false,
      interlaced: false,
      aspectRatio: '9:16',
      maxFileSize: 100
    },
    {
      id: 'instagram-post',
      name: 'Instagram Post',
      description: 'Square format for Instagram feed',
      platform: 'instagram',
      format: 'mp4',
      resolution: { width: 1080, height: 1080 },
      fps: 30,
      bitrate: 3500,
      quality: 'high',
      codec: 'h264',
      audioCodec: 'aac',
      audioBitrate: 128,
      audioSampleRate: 44100,
      colorSpace: 'rec709',
      hdr: false,
      interlaced: false,
      aspectRatio: '1:1',
      maxFileSize: 100
    },
    // TikTok
    {
      id: 'tiktok',
      name: 'TikTok',
      description: 'Optimized for TikTok uploads',
      platform: 'tiktok',
      format: 'mp4',
      resolution: { width: 1080, height: 1920 },
      fps: 30,
      bitrate: 2500,
      quality: 'medium',
      codec: 'h264',
      audioCodec: 'aac',
      audioBitrate: 128,
      audioSampleRate: 44100,
      colorSpace: 'rec709',
      hdr: false,
      interlaced: false,
      aspectRatio: '9:16',
      maxFileSize: 287
    },
    // Professional
    {
      id: 'prores-4k',
      name: 'ProRes 4K',
      description: 'Professional editing format',
      platform: 'custom',
      format: 'mov',
      resolution: { width: 3840, height: 2160 },
      fps: 24,
      bitrate: 500000,
      quality: 'ultra',
      codec: 'prores',
      audioCodec: 'flac',
      audioBitrate: 1411,
      audioSampleRate: 48000,
      colorSpace: 'rec2020',
      hdr: true,
      interlaced: false,
      aspectRatio: '16:9'
    }
  ];

  // Cloud rendering providers
  const cloudProviders: CloudProvider[] = [
    {
      id: 'local',
      name: 'Local Rendering',
      description: 'Render on your local machine',
      pricing: { cpu: 0, gpu: 0, storage: 0, bandwidth: 0 },
      capabilities: {
        maxResolution: { width: 7680, height: 4320 },
        maxFps: 120,
        supportedCodecs: ['h264', 'h265', 'vp9'],
        hdrSupport: true,
        gpuAcceleration: true,
        parallelJobs: 4
      },
      regions: ['local'],
      status: 'available'
    },
    {
      id: 'aws-ec2',
      name: 'AWS EC2',
      description: 'High-performance cloud rendering with GPU acceleration',
      pricing: { cpu: 0.50, gpu: 2.50, storage: 0.10, bandwidth: 0.09 },
      capabilities: {
        maxResolution: { width: 7680, height: 4320 },
        maxFps: 120,
        supportedCodecs: ['h264', 'h265', 'vp9', 'av1'],
        hdrSupport: true,
        gpuAcceleration: true,
        parallelJobs: 16
      },
      regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'],
      status: 'available'
    },
    {
      id: 'google-cloud',
      name: 'Google Cloud',
      description: 'Scalable rendering with worldwide availability',
      pricing: { cpu: 0.45, gpu: 2.20, storage: 0.08, bandwidth: 0.12 },
      capabilities: {
        maxResolution: { width: 7680, height: 4320 },
        maxFps: 120,
        supportedCodecs: ['h264', 'h265', 'vp9', 'av1'],
        hdrSupport: true,
        gpuAcceleration: true,
        parallelJobs: 12
      },
      regions: ['us-central1', 'europe-west1', 'asia-east1'],
      status: 'available'
    },
    {
      id: 'azure',
      name: 'Microsoft Azure',
      description: 'Enterprise-grade rendering with AI acceleration',
      pricing: { cpu: 0.48, gpu: 2.30, storage: 0.09, bandwidth: 0.08 },
      capabilities: {
        maxResolution: { width: 7680, height: 4320 },
        maxFps: 120,
        supportedCodecs: ['h264', 'h265', 'vp9', 'av1'],
        hdrSupport: true,
        gpuAcceleration: true,
        parallelJobs: 10
      },
      regions: ['eastus', 'westeurope', 'southeastasia'],
      status: 'available'
    }
  ];

  const startRender = async (profile: ExportProfile) => {
    const newJob: RenderJob = {
      id: `job-${Date.now()}`,
      name: `${profile.name} - ${new Date().toLocaleString()}`,
      profile,
      status: 'queued',
      progress: 0,
      startTime: new Date()
    };

    setRenderJobs(prev => [...prev, newJob]);

    // Simulate render process
    simulateRender(newJob);
  };

  const simulateRender = async (job: RenderJob) => {
    const updateJob = (updates: Partial<RenderJob>) => {
      setRenderJobs(prev => prev.map(j => 
        j.id === job.id ? { ...j, ...updates } : j
      ));
    };

    // Start processing
    updateJob({ status: 'processing', progress: 0 });

    const totalFrames = Math.ceil(duration * job.profile.fps);
    let processedFrames = 0;

    const interval = setInterval(() => {
      processedFrames += Math.random() * 10;
      const progress = Math.min((processedFrames / totalFrames) * 100, 100);
      
      const renderStats = {
        framesProcessed: Math.floor(processedFrames),
        totalFrames,
        averageFps: 15 + Math.random() * 10,
        cpuUsage: 70 + Math.random() * 20,
        memoryUsage: 60 + Math.random() * 30,
        diskUsage: 50 + Math.random() * 20
      };

      updateJob({ progress, renderStats });
      onExportProgress?.({ ...job, progress, renderStats });

      if (progress >= 100) {
        clearInterval(interval);
        
        const completedJob = {
          ...job,
          status: 'completed' as const,
          progress: 100,
          endTime: new Date(),
          outputPath: `/exports/${job.id}.${job.profile.format}`,
          outputUrl: `https://example.com/exports/${job.id}.${job.profile.format}`,
          fileSize: Math.random() * 1000 + 100 // MB
        };

        updateJob(completedJob);
        onExportComplete?.(completedJob);
      }
    }, 500);
  };

  const cancelRender = (jobId: string) => {
    setRenderJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: 'cancelled' as const } : job
    ));
  };

  const deleteJob = (jobId: string) => {
    setRenderJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const getStatusIcon = (status: RenderJob['status']) => {
    switch (status) {
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <FileVideo className="h-4 w-4 text-red-500" />;
      case 'instagram':
        return <Camera className="h-4 w-4 text-pink-500" />;
      case 'tiktok':
        return <Music className="h-4 w-4 text-black" />;
      case 'twitter':
        return <Globe className="h-4 w-4 text-blue-400" />;
      default:
        return <Monitor className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Export System</h2>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={batchExport ? "default" : "ghost"}
              onClick={() => setBatchExport(!batchExport)}
              className="text-white"
            >
              <Archive className="h-4 w-4 mr-1" />
              Batch Export
            </Button>
            <Button
              size="sm"
              variant={previewEnabled ? "default" : "ghost"}
              onClick={() => setPreviewEnabled(!previewEnabled)}
              className="text-white"
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-4 bg-gray-800 mx-4 mt-2">
          <TabsTrigger value="profiles" className="text-white">Profiles</TabsTrigger>
          <TabsTrigger value="cloud" className="text-white">Cloud</TabsTrigger>
          <TabsTrigger value="queue" className="text-white">Queue</TabsTrigger>
          <TabsTrigger value="settings" className="text-white">Settings</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          {/* Export Profiles */}
          <TabsContent value="profiles" className="h-full overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exportProfiles.map(profile => (
                <Card
                  key={profile.id}
                  className={`bg-gray-800 border-gray-700 cursor-pointer transition-all ${
                    selectedProfile === profile.id ? 'ring-2 ring-blue-400' : ''
                  }`}
                  onClick={() => setSelectedProfile(profile.id)}
                >
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(profile.platform)}
                        <CardTitle className="text-sm">{profile.name}</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {profile.format.toUpperCase()}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {profile.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <div>Resolution: {profile.resolution.width}×{profile.resolution.height}</div>
                      <div>FPS: {profile.fps}</div>
                      <div>Bitrate: {profile.bitrate} kbps</div>
                      <div>Codec: {profile.codec.toUpperCase()}</div>
                      <div>Quality: {profile.quality}</div>
                      <div>Audio: {profile.audioCodec.toUpperCase()}</div>
                    </div>
                    
                    {profile.maxFileSize && (
                      <div className="mt-2 text-xs text-yellow-400">
                        Max file size: {profile.maxFileSize} MB
                      </div>
                    )}

                    <div className="mt-3 flex justify-between">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-white border-gray-600"
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => startRender(profile)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Cloud Providers */}
          <TabsContent value="cloud" className="h-full overflow-y-auto p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Cloud Rendering</h3>
                <div className="text-sm text-gray-400">
                  Estimate: $0.50/minute • High quality rendering
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {cloudProviders.map(provider => (
                  <Card
                    key={provider.id}
                    className={`bg-gray-800 border-gray-700 cursor-pointer transition-all ${
                      selectedProvider === provider.id ? 'ring-2 ring-blue-400' : ''
                    }`}
                    onClick={() => setSelectedProvider(provider.id)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {provider.id === 'local' ? (
                            <HardDrive className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Cloud className="h-5 w-5 text-blue-400" />
                          )}
                          <CardTitle className="text-sm">{provider.name}</CardTitle>
                        </div>
                        <Badge 
                          variant={provider.status === 'available' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {provider.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {provider.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-gray-400">Max Resolution:</div>
                          <div>{provider.capabilities.maxResolution.width}×{provider.capabilities.maxResolution.height}</div>
                          <div className="text-gray-400">Max FPS:</div>
                          <div>{provider.capabilities.maxFps}</div>
                          <div className="text-gray-400">GPU Acceleration:</div>
                          <div>{provider.capabilities.gpuAcceleration ? 'Yes' : 'No'}</div>
                          <div className="text-gray-400">Parallel Jobs:</div>
                          <div>{provider.capabilities.parallelJobs}</div>
                        </div>

                        {provider.id !== 'local' && (
                          <div className="border-t border-gray-700 pt-3">
                            <div className="text-xs font-medium mb-2">Pricing (per hour)</div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                              <div>CPU: ${provider.pricing.cpu}</div>
                              <div>GPU: ${provider.pricing.gpu}</div>
                              <div>Storage: ${provider.pricing.storage}/GB</div>
                              <div>Bandwidth: ${provider.pricing.bandwidth}/GB</div>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {provider.capabilities.supportedCodecs.map(codec => (
                            <Badge key={codec} variant="outline" className="text-xs">
                              {codec.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Render Queue */}
          <TabsContent value="queue" className="h-full overflow-y-auto p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Render Queue</h3>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="text-white border-gray-600">
                    <Folder className="h-4 w-4 mr-1" />
                    Open Folder
                  </Button>
                  <Button size="sm" variant="outline" className="text-white border-gray-600">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share All
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {renderJobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <FileVideo className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No render jobs yet</p>
                    <p className="text-sm">Export a video to see jobs here</p>
                  </div>
                ) : (
                  renderJobs.map(job => (
                    <Card key={job.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(job.status)}
                              <h4 className="font-medium text-sm">{job.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {job.profile.name}
                              </Badge>
                            </div>
                            
                            {job.status === 'processing' && (
                              <div className="space-y-2 mb-3">
                                <div className="flex justify-between text-xs text-gray-400">
                                  <span>Progress</span>
                                  <span>{job.progress.toFixed(1)}%</span>
                                </div>
                                <Progress value={job.progress} className="h-2" />
                                
                                {job.renderStats && (
                                  <div className="grid grid-cols-3 gap-4 text-xs text-gray-400">
                                    <div className="flex items-center gap-1">
                                      <Activity className="h-3 w-3" />
                                      <span>{job.renderStats.averageFps.toFixed(1)} FPS</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Cpu className="h-3 w-3" />
                                      <span>{job.renderStats.cpuUsage.toFixed(0)}%</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MemoryStick className="h-3 w-3" />
                                      <span>{job.renderStats.memoryUsage.toFixed(0)}%</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-400">
                              <div>Resolution: {job.profile.resolution.width}×{job.profile.resolution.height}</div>
                              <div>Format: {job.profile.format.toUpperCase()}</div>
                              <div>Codec: {job.profile.codec.toUpperCase()}</div>
                              {job.fileSize && (
                                <div>Size: {formatFileSize(job.fileSize * 1024 * 1024)}</div>
                              )}
                            </div>

                            {job.startTime && (
                              <div className="text-xs text-gray-400 mt-2">
                                Started: {job.startTime.toLocaleString()}
                                {job.endTime && (
                                  <span className="ml-2">
                                    Duration: {formatDuration((job.endTime.getTime() - job.startTime.getTime()) / 1000)}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-1 ml-4">
                            {job.status === 'processing' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => cancelRender(job.id)}
                                className="text-red-400"
                              >
                                Cancel
                              </Button>
                            )}
                            
                            {job.status === 'completed' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-white"
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-white"
                                >
                                  <Share2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteJob(job.id)}
                              className="text-red-400"
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="h-full overflow-y-auto p-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Export Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Default Export Location</Label>
                    <div className="flex gap-2 mt-1">
                      <Input 
                        placeholder="/path/to/exports" 
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                      <Button size="sm" variant="outline" className="text-white border-gray-600">
                        Browse
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm">Concurrent Renders</Label>
                    <Slider
                      defaultValue={[2]}
                      min={1}
                      max={8}
                      step={1}
                      className="mt-2"
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      Number of simultaneous render jobs (affects system performance)
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Auto-upload to cloud</Label>
                      <input type="checkbox" className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Delete source after export</Label>
                      <input type="checkbox" className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Generate thumbnails</Label>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Email notifications</Label>
                      <input type="checkbox" className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Performance</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Hardware Acceleration</Label>
                    <select className="w-full mt-1 p-2 bg-gray-800 border border-gray-600 rounded text-white">
                      <option>Auto (Recommended)</option>
                      <option>NVIDIA NVENC</option>
                      <option>Intel Quick Sync</option>
                      <option>AMD VCE</option>
                      <option>Software Only</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-sm">Memory Usage Limit</Label>
                    <Slider
                      defaultValue={[70]}
                      min={50}
                      max={95}
                      step={5}
                      className="mt-2"
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      Maximum RAM usage percentage during rendering
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm">Temp Directory</Label>
                    <div className="flex gap-2 mt-1">
                      <Input 
                        placeholder="/tmp/video-exports" 
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                      <Button size="sm" variant="outline" className="text-white border-gray-600">
                        Browse
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Cloud Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Default Region</Label>
                    <select className="w-full mt-1 p-2 bg-gray-800 border border-gray-600 rounded text-white">
                      <option>Auto (Closest)</option>
                      <option>US East (N. Virginia)</option>
                      <option>US West (Oregon)</option>
                      <option>Europe (Ireland)</option>
                      <option>Asia Pacific (Singapore)</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-sm">Budget Limit (Monthly)</Label>
                    <div className="flex gap-2 mt-1">
                      <Input 
                        type="number" 
                        placeholder="100"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                      <span className="text-gray-400 self-center">USD</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Auto-scale instances</Label>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Use spot instances</Label>
                      <input type="checkbox" className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
