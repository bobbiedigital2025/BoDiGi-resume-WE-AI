import React, { useState } from 'react';

export default function VideoCreator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleCreateVideo = async () => {
    setLoading(true);
    setError('');
    setVideoUrl(null);
    // Mock MCP endpoint call
    try {
      // Simulate AI video generation delay
      await new Promise(res => setTimeout(res, 3000));
      // Simulate a generated video URL (replace with real MCP endpoint later)
      setVideoUrl('https://www.w3schools.com/html/mov_bbb.mp4');
    } catch (e) {
      setError('Failed to generate video.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-100 py-12 px-4 font-sans">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">AI Video Creator</h1>
        <p className="mb-6 text-gray-600">Enter a prompt and let AI generate a video for you using MCP & A2AQ.</p>
        <input
          type="text"
          className="w-full border border-blue-200 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Describe your video..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          onClick={handleCreateVideo}
          disabled={loading || !prompt.trim()}
        >
          {loading ? 'Creating Video...' : 'Create Video'}
        </button>
        {error && <div className="mt-4 text-red-500">{error}</div>}
        {videoUrl && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">Your Generated Video</h2>
            <video controls className="w-full rounded-lg shadow-md">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
}
