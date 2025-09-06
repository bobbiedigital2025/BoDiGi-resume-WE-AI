import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Download, 
  Share2, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  ExternalLink,
  Filter,
  Search,
  Grid3X3,
  List,
  Calendar,
  Clock,
  Video,
  Image,
  Star,
  Archive
} from 'lucide-react';

interface Video {
  id: string;
  title: string;
  prompt: string;
  description?: string;
  duration: number;
  style: string;
  resolution: string;
  fps: number;
  aspectRatio: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  filePath: string;
  thumbnailPath?: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  viewCount?: number;
  shareCount?: number;
  isPublic?: boolean;
  isFavorite?: boolean;
}

interface VideoShare {
  id: string;
  videoId: string;
  shareToken: string;
  expiresAt?: string;
  viewCount: number;
  isPublic: boolean;
  allowDownload: boolean;
  createdAt: string;
}

interface VideoManagerProps {
  onEditVideo?: (video: Video) => void;
  onCreateNew?: () => void;
}

export default function VideoManager({ onEditVideo, onCreateNew }: VideoManagerProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'duration' | 'title'>('newest');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  const [shareDialogVideo, setShareDialogVideo] = useState<Video | null>(null);
  const [shareSettings, setShareSettings] = useState({
    isPublic: false,
    allowDownload: true,
    expiresIn: '7d'
  });

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    filterAndSortVideos();
  }, [videos, searchQuery, filterStatus, sortBy]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/videos/list');
      const data = await response.json();
      if (data.videos) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortVideos = () => {
    let filtered = videos;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(video => 
        video.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.style.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(video => video.status === filterStatus);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'duration':
          return b.duration - a.duration;
        case 'title':
          return (a.title || a.prompt).localeCompare(b.title || b.prompt);
        default:
          return 0;
      }
    });

    setFilteredVideos(filtered);
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setVideos(prev => prev.filter(v => v.id !== videoId));
        setSelectedVideos(prev => {
          const newSet = new Set(prev);
          newSet.delete(videoId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Failed to delete video:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedVideos.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedVideos.size} videos?`)) return;

    try {
      await Promise.all(
        Array.from(selectedVideos).map(videoId =>
          fetch(`/api/videos/${videoId}`, { method: 'DELETE' })
        )
      );
      
      setVideos(prev => prev.filter(v => !selectedVideos.has(v.id)));
      setSelectedVideos(new Set());
    } catch (error) {
      console.error('Failed to delete videos:', error);
    }
  };

  const handleDownloadVideo = (video: Video) => {
    const link = document.createElement('a');
    link.href = `/api/videos/stream/${video.id}`;
    link.download = `${video.title || 'video'}-${video.id}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareVideo = async (video: Video) => {
    try {
      const response = await fetch('/api/videos/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: video.id,
          ...shareSettings
        })
      });

      if (response.ok) {
        const shareData = await response.json();
        const shareUrl = `${window.location.origin}/share/${shareData.shareToken}`;
        
        if (navigator.share) {
          await navigator.share({
            title: video.title || 'AI Generated Video',
            text: video.prompt,
            url: shareUrl
          });
        } else {
          await navigator.clipboard.writeText(shareUrl);
          alert('Share link copied to clipboard!');
        }
      }
    } catch (error) {
      console.error('Failed to share video:', error);
    }
    setShareDialogVideo(null);
  };

  const toggleVideoSelection = (videoId: string) => {
    setSelectedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Library</h1>
            <p className="text-gray-600">
              Manage your AI-generated videos ({videos.length} total)
            </p>
          </div>
          <Button onClick={onCreateNew}>
            <Video className="h-4 w-4 mr-2" />
            Create New Video
          </Button>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border rounded-md px-3 py-2 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="duration">By Duration</option>
                  <option value="title">By Title</option>
                </select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedVideos.size > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                <span className="text-sm text-blue-800">
                  {selectedVideos.size} video(s) selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleBulkDelete}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Selected
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSelectedVideos(new Set())}>
                    Clear Selection
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video Grid/List */}
        {filteredVideos.length > 0 ? (
          <div className={viewMode === 'grid' ? 
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : 
            "space-y-4"
          }>
            {filteredVideos.map((video) => (
              <Card 
                key={video.id} 
                className={`overflow-hidden hover:shadow-lg transition-all ${
                  selectedVideos.has(video.id) ? 'ring-2 ring-blue-500' : ''
                } ${viewMode === 'list' ? 'flex' : ''}`}
              >
                {viewMode === 'grid' ? (
                  <>
                    {/* Grid View */}
                    <div className="relative aspect-video bg-gray-200">
                      {video.thumbnailPath ? (
                        <img 
                          src={video.thumbnailPath} 
                          alt={video.title || video.prompt}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Status Overlay */}
                      <div className="absolute top-2 left-2">
                        <Badge className={getStatusColor(video.status)}>
                          {video.status}
                        </Badge>
                      </div>

                      {/* Duration */}
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {formatDuration(video.duration)}
                      </div>

                      {/* Selection Checkbox */}
                      <div className="absolute top-2 right-2">
                        <input
                          type="checkbox"
                          checked={selectedVideos.has(video.id)}
                          onChange={() => toggleVideoSelection(video.id)}
                          className="w-4 h-4"
                        />
                      </div>

                      {/* Quick Action Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                        <Button size="sm" onClick={() => window.open(`/api/videos/stream/${video.id}`, '_blank')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {video.title || video.prompt}
                      </h3>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <span className="capitalize">{video.style}</span>
                        <span>{video.resolution}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{formatFileSize(video.fileSize)}</span>
                        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleDownloadVideo(video)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setShareDialogVideo(video)}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                        {onEditVideo && (
                          <Button size="sm" variant="ghost" onClick={() => onEditVideo(video)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDeleteVideo(video.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <>
                    {/* List View */}
                    <div className="w-32 aspect-video bg-gray-200 flex-shrink-0">
                      {video.thumbnailPath ? (
                        <img 
                          src={video.thumbnailPath} 
                          alt={video.title || video.prompt}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <CardContent className="flex-1 p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="checkbox"
                            checked={selectedVideos.has(video.id)}
                            onChange={() => toggleVideoSelection(video.id)}
                            className="w-4 h-4"
                          />
                          <h3 className="font-semibold">{video.title || video.prompt}</h3>
                          <Badge className={getStatusColor(video.status)}>
                            {video.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{formatDuration(video.duration)}</span>
                          <span className="capitalize">{video.style}</span>
                          <span>{video.resolution}</span>
                          <span>{formatFileSize(video.fileSize)}</span>
                          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => window.open(`/api/videos/stream/${video.id}`, '_blank')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDownloadVideo(video)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setShareDialogVideo(video)}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                        {onEditVideo && (
                          <Button size="sm" variant="ghost" onClick={() => onEditVideo(video)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDeleteVideo(video.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Video className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || filterStatus !== 'all' ? 'No videos found' : 'No videos yet'}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first AI-generated video to get started.'
                }
              </p>
              {(!searchQuery && filterStatus === 'all') && (
                <Button onClick={onCreateNew}>
                  Create Your First Video
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Share Dialog */}
        {shareDialogVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Share Video</CardTitle>
                <CardDescription>
                  Configure sharing settings for "{shareDialogVideo.title || shareDialogVideo.prompt}"
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Public sharing</Label>
                  <input
                    type="checkbox"
                    checked={shareSettings.isPublic}
                    onChange={(e) => setShareSettings(prev => ({ ...prev, isPublic: e.target.checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Allow downloads</Label>
                  <input
                    type="checkbox"
                    checked={shareSettings.allowDownload}
                    onChange={(e) => setShareSettings(prev => ({ ...prev, allowDownload: e.target.checked }))}
                  />
                </div>

                <div>
                  <Label>Link expires in</Label>
                  <select
                    value={shareSettings.expiresIn}
                    onChange={(e) => setShareSettings(prev => ({ ...prev, expiresIn: e.target.value }))}
                    className="w-full mt-1 border rounded-md px-3 py-2"
                  >
                    <option value="1h">1 hour</option>
                    <option value="1d">1 day</option>
                    <option value="7d">7 days</option>
                    <option value="30d">30 days</option>
                    <option value="never">Never</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={() => handleShareVideo(shareDialogVideo)} className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Create Share Link
                  </Button>
                  <Button variant="outline" onClick={() => setShareDialogVideo(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
