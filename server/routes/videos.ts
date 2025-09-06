import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import ffmpeg from 'ffmpeg-static';
import { spawn } from 'child_process';
import sharp from 'sharp';
import { Jimp } from 'jimp';

const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'videos');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

// Video generation configuration
interface VideoConfig {
  duration: 30 | 60 | 180; // 30s, 1min, 3min
  style: 'cinematic' | 'animation' | 'documentary' | 'social' | 'promotional';
  resolution: '720p' | '1080p' | '4k';
  fps: 24 | 30 | 60;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3';
}

// Scene generation for different video durations
const generateScenes = (prompt: string, config: VideoConfig) => {
  const baseScenes = [
    { type: 'intro', duration: 3, description: `Opening scene: ${prompt}` },
    { type: 'main', duration: config.duration - 6, description: `Main content: ${prompt}` },
    { type: 'outro', duration: 3, description: `Closing scene: ${prompt}` }
  ];

  if (config.duration === 60) {
    return [
      { type: 'intro', duration: 5, description: `Captivating opening: ${prompt}` },
      { type: 'development', duration: 20, description: `Story development: ${prompt}` },
      { type: 'climax', duration: 25, description: `Main focus: ${prompt}` },
      { type: 'outro', duration: 10, description: `Strong conclusion: ${prompt}` }
    ];
  }

  if (config.duration === 180) {
    return [
      { type: 'intro', duration: 15, description: `Extended introduction: ${prompt}` },
      { type: 'setup', duration: 30, description: `Context and setup: ${prompt}` },
      { type: 'development', duration: 45, description: `Main development: ${prompt}` },
      { type: 'climax', duration: 60, description: `Core content: ${prompt}` },
      { type: 'resolution', duration: 20, description: `Resolution: ${prompt}` },
      { type: 'outro', duration: 10, description: `Final thoughts: ${prompt}` }
    ];
  }

  return baseScenes;
};

// Generate image frames using AI (mock implementation - replace with real AI service)
const generateImageFrame = async (description: string, style: string): Promise<Buffer> => {
  // This is a mock implementation. In production, you would integrate with:
  // - DALL-E 3, Midjourney, Stable Diffusion, or similar AI image generation
  // - For now, we'll create colored frames with text
  
  const width = 1920;
  const height = 1080;
  
  // Create a base image with Jimp
  const image = new Jimp({ width, height, color: getStyleColor(style) });
  
  // For now, skip text overlay due to API complexity in new Jimp version
  // TODO: Implement proper text rendering with newer Jimp API or use alternative like Canvas
  
  return await image.getBuffer('image/png');
};

const getStyleColor = (style: string): number => {
  const colors: { [key: string]: number } = {
    'cinematic': 0x1a1a2e,
    'animation': 0x7209b7,
    'documentary': 0x2c3e50,
    'social': 0xff6b6b,
    'promotional': 0x4ecdc4
  };
  return colors[style] || 0x333333;
};

// Create video from frames using FFmpeg
const createVideoFromFrames = (framePaths: string[], outputPath: string, config: VideoConfig): Promise<void> => {
  return new Promise((resolve, reject) => {
    const args = [
      '-y', // Overwrite output file
      '-r', config.fps.toString(), // Frame rate
      '-i', 'frame_%03d.png', // Input pattern
      '-c:v', 'libx264', // Video codec
      '-pix_fmt', 'yuv420p', // Pixel format for compatibility
      '-t', config.duration.toString(), // Duration
      outputPath
    ];

    const ffmpegProcess = spawn(ffmpeg!, args, {
      cwd: path.dirname(framePaths[0])
    });

    ffmpegProcess.stderr.on('data', (data) => {
      console.log(`FFmpeg: ${data}`);
    });

    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });
  });
};

// Generate video endpoint
router.post('/generate', async (req, res) => {
  try {
    const { prompt, config }: { prompt: string; config: VideoConfig } = req.body;
    
    if (!prompt || !config) {
      return res.status(400).json({ error: 'Prompt and config are required' });
    }

    const videoId = uuidv4();
    const outputDir = path.join(process.cwd(), 'uploads', 'videos', videoId);
    await fs.mkdir(outputDir, { recursive: true });
    
    // Generate scenes based on duration and prompt
    const scenes = generateScenes(prompt, config);
    const framePaths: string[] = [];
    
    // Generate frames for each scene
    let frameIndex = 0;
    for (const scene of scenes) {
      const framesPerSecond = config.fps;
      const totalFrames = scene.duration * framesPerSecond;
      
      for (let i = 0; i < totalFrames; i++) {
        const frameBuffer = await generateImageFrame(scene.description, config.style);
        const framePath = path.join(outputDir, `frame_${frameIndex.toString().padStart(3, '0')}.png`);
        await fs.writeFile(framePath, frameBuffer);
        framePaths.push(framePath);
        frameIndex++;
      }
    }
    
    // Create video from frames
    const videoPath = path.join(outputDir, `${videoId}.mp4`);
    await createVideoFromFrames(framePaths, videoPath, config);
    
    // Clean up frame files
    for (const framePath of framePaths) {
      await fs.unlink(framePath).catch(() => {});
    }
    
    // Store video metadata (would typically save to database)
    const videoMetadata = {
      id: videoId,
      prompt,
      config,
      scenes,
      path: videoPath,
      url: `/api/videos/stream/${videoId}`,
      createdAt: new Date().toISOString(),
      duration: config.duration,
      size: await fs.stat(videoPath).then(stats => stats.size)
    };
    
    // Save metadata to file (in production, save to database)
    await fs.writeFile(
      path.join(outputDir, 'metadata.json'), 
      JSON.stringify(videoMetadata, null, 2)
    );
    
    res.json({
      success: true,
      video: videoMetadata
    });
    
  } catch (error) {
    console.error('Video generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate video',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Stream video endpoint
router.get('/stream/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const videoPath = path.join(process.cwd(), 'uploads', 'videos', videoId, `${videoId}.mp4`);
    
    // Check if file exists
    try {
      await fs.access(videoPath);
    } catch {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    const stat = await fs.stat(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;
    
    if (range) {
      // Handle range requests for video streaming
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      
      res.status(206);
      res.set({
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      });
      
      const stream = require('fs').createReadStream(videoPath, { start, end });
      stream.pipe(res);
    } else {
      // Send entire file
      res.set({
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      });
      
      const stream = require('fs').createReadStream(videoPath);
      stream.pipe(res);
    }
    
  } catch (error) {
    console.error('Video streaming error:', error);
    res.status(500).json({ error: 'Failed to stream video' });
  }
});

// Get video metadata
router.get('/metadata/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const metadataPath = path.join(process.cwd(), 'uploads', 'videos', videoId, 'metadata.json');
    
    const metadata = await fs.readFile(metadataPath, 'utf-8');
    res.json(JSON.parse(metadata));
    
  } catch (error) {
    res.status(404).json({ error: 'Video metadata not found' });
  }
});

// List user's videos
router.get('/list', async (req, res) => {
  try {
    const videosDir = path.join(process.cwd(), 'uploads', 'videos');
    const videoFolders = await fs.readdir(videosDir);
    
    const videos = [];
    for (const folder of videoFolders) {
      try {
        const metadataPath = path.join(videosDir, folder, 'metadata.json');
        const metadata = await fs.readFile(metadataPath, 'utf-8');
        videos.push(JSON.parse(metadata));
      } catch {
        // Skip folders without metadata
      }
    }
    
    // Sort by creation date (newest first)
    videos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    res.json({ videos });
    
  } catch (error) {
    console.error('List videos error:', error);
    res.status(500).json({ error: 'Failed to list videos' });
  }
});

// Delete video
router.delete('/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const videoDir = path.join(process.cwd(), 'uploads', 'videos', videoId);
    
    // Remove entire video directory
    await fs.rm(videoDir, { recursive: true, force: true });
    
    res.json({ success: true, message: 'Video deleted successfully' });
    
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

// Video editing endpoints
router.post('/edit/:videoId', upload.single('overlay'), async (req, res) => {
  try {
    const { videoId } = req.params;
    const { operation, params } = req.body;
    
    const videoPath = path.join(process.cwd(), 'uploads', 'videos', videoId, `${videoId}.mp4`);
    const outputPath = path.join(process.cwd(), 'uploads', 'videos', videoId, `${videoId}_edited.mp4`);
    
    let ffmpegArgs: string[] = [];
    
    switch (operation) {
      case 'trim':
        const { start, end } = JSON.parse(params);
        ffmpegArgs = [
          '-i', videoPath,
          '-ss', start.toString(),
          '-t', (end - start).toString(),
          '-c', 'copy',
          outputPath
        ];
        break;
        
      case 'add_text':
        const { text, position, duration } = JSON.parse(params);
        ffmpegArgs = [
          '-i', videoPath,
          '-vf', `drawtext=text='${text}':fontcolor=white:fontsize=24:x=${position.x}:y=${position.y}:enable='between(t,0,${duration})'`,
          '-c:a', 'copy',
          outputPath
        ];
        break;
        
      case 'add_overlay':
        if (!req.file) {
          return res.status(400).json({ error: 'Overlay file required' });
        }
        ffmpegArgs = [
          '-i', videoPath,
          '-i', req.file.path,
          '-filter_complex', '[0:v][1:v] overlay=10:10',
          '-c:a', 'copy',
          outputPath
        ];
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid operation' });
    }
    
    // Execute FFmpeg command
    await new Promise<void>((resolve, reject) => {
      const ffmpegProcess = spawn(ffmpeg!, ffmpegArgs);
      
      ffmpegProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`FFmpeg process exited with code ${code}`));
        }
      });
    });
    
    // Update metadata
    const metadataPath = path.join(process.cwd(), 'uploads', 'videos', videoId, 'metadata.json');
    const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));
    metadata.editedAt = new Date().toISOString();
    metadata.operations = metadata.operations || [];
    metadata.operations.push({ operation, params, timestamp: new Date().toISOString() });
    
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    
    res.json({
      success: true,
      message: 'Video edited successfully',
      editedVideoUrl: `/api/videos/stream/${videoId}_edited`
    });
    
  } catch (error) {
    console.error('Video editing error:', error);
    res.status(500).json({ error: 'Failed to edit video' });
  }
});

export default router;
