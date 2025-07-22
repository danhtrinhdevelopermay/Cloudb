import { useState, useEffect, useRef } from "react";
import { File as FileType } from "@shared/schema";
import { Button } from "./button";
import { X, Download, Share, ZoomIn, ZoomOut, RotateCw, Play, Pause, Volume2 } from "lucide-react";
import { addAuthHeader } from "@/contexts/AuthContext";

interface FileViewerProps {
  file: FileType;
  isOpen: boolean;
  onClose: () => void;
}

export function FileViewer({ file, isOpen, onClose }: FileViewerProps) {
  const [fileContent, setFileContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  const isImage = file.mimeType.startsWith("image/");
  const isText = file.mimeType.startsWith("text/") || 
                 file.mimeType.includes("javascript") || 
                 file.mimeType.includes("json") ||
                 file.originalName.endsWith(".md") ||
                 file.originalName.endsWith(".txt");
  const isPDF = file.mimeType.includes("pdf");
  const isVideo = file.mimeType.startsWith("video/");
  const isAudio = file.mimeType.startsWith("audio/");

  useEffect(() => {
    if (!isOpen) return;

    const loadFileContent = async () => {
      setLoading(true);
      setError("");
      setMediaUrl(null);
      
      try {
        const headers = await addAuthHeader();
        
        if (isText) {
          const response = await fetch(`/api/files/${file.id}/download`, {
            headers
          });
          if (response.ok) {
            const text = await response.text();
            setFileContent(text);
          } else {
            setError("Failed to load file content");
          }
        } else if (isImage || isVideo || isAudio || isPDF) {
          // For media files, create blob URL with authentication
          const response = await fetch(`/api/files/${file.id}/download`, {
            headers
          });
          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setMediaUrl(url);
          } else {
            setError("Failed to load file");
          }
        }
      } catch (err) {
        setError("Failed to load file");
      } finally {
        setLoading(false);
      }
    };

    loadFileContent();
    
    // Cleanup URL when component unmounts or file changes
    return () => {
      if (mediaUrl) {
        URL.revokeObjectURL(mediaUrl);
      }
    };
  }, [isOpen, file.id, isText, isImage, isVideo, isAudio, isPDF]);

  const handleDownload = async () => {
    try {
      const headers = await addAuthHeader();
      const response = await fetch(`/api/files/${file.id}/download`, {
        headers
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.originalName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        console.error('Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate" title={file.originalName}>
              {file.originalName}
            </h3>
            <p className="text-sm text-gray-600">
              {formatFileSize(file.size)} • {file.mimeType}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            {isImage && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(25, zoom - 25))}
                  disabled={zoom <= 25}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600 min-w-12 text-center">{zoom}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation((rotation + 90) % 360)}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </>
            )}
            
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-600">Loading file content...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-red-600">
                <p className="font-medium">Error loading file</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : isImage ? (
            <div className="flex items-center justify-center h-full p-4">
              {mediaUrl ? (
                <img
                  src={mediaUrl}
                  alt={file.originalName}
                  className="max-w-full max-h-full object-contain shadow-lg rounded-lg"
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    transition: "transform 0.3s ease"
                  }}
                />
              ) : (
                <div className="text-center text-gray-500">
                  <p>Loading image...</p>
                </div>
              )}
            </div>
          ) : isText ? (
            <div className="h-full">
              <pre className="h-full overflow-auto p-6 text-sm font-mono bg-white border-0 whitespace-pre-wrap">
                {fileContent}
              </pre>
            </div>
          ) : isPDF ? (
            <div className="h-full">
              {mediaUrl ? (
                <iframe
                  src={mediaUrl}
                  className="w-full h-full border-0"
                  title={file.originalName}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Loading PDF...</p>
                </div>
              )}
            </div>
          ) : isVideo ? (
            <div className="flex items-center justify-center h-full p-4">
              {mediaUrl ? (
                <video
                  controls
                  className="max-w-full max-h-full rounded-lg shadow-lg"
                  src={mediaUrl}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="text-center text-gray-500">
                  <p>Loading video...</p>
                </div>
              )}
            </div>
          ) : isAudio ? (
            <AudioPlayer file={file} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-600">
                <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">📄</span>
                </div>
                <p className="font-medium">Preview not available</p>
                <p className="text-sm mb-4">This file type cannot be previewed in the browser</p>
                <Button onClick={handleDownload} className="bg-gradient-to-r from-blue-500 to-purple-500">
                  <Download className="h-4 w-4 mr-2" />
                  Download to View
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Audio Player Component with beautiful interface
interface AudioPlayerProps {
  file: FileType;
}

function AudioPlayer({ file }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const songName = file.originalName.replace(/\.[^/.]+$/, "");

  // Load authenticated audio URL
  useEffect(() => {
    const loadAudio = async () => {
      try {
        const headers = await addAuthHeader();
        const response = await fetch(`/api/files/${file.id}/download`, {
          headers
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
        }
      } catch (error) {
        console.error('Failed to load audio:', error);
      }
    };

    loadAudio();

    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [file.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative h-full overflow-hidden">
      {/* Background with blur effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          filter: 'blur(20px)',
          transform: 'scale(1.1)'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-8">
        {/* Album Art */}
        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-8 shadow-2xl">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
            <Volume2 className="h-16 w-16 text-white" />
          </div>
        </div>

        {/* Song Info */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2 text-white drop-shadow-lg">
            {songName}
          </h2>
          <p className="text-white/80 text-sm">
            CloudBox Audio Player
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mb-8">
          <div 
            className="w-full h-2 bg-white/20 rounded-full cursor-pointer backdrop-blur-sm"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-white rounded-full transition-all duration-300 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 w-4 h-4 bg-white rounded-full transform -translate-y-1/2 translate-x-2 shadow-lg" />
            </div>
          </div>
          <div className="flex justify-between text-sm text-white/80 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Play Button */}
        <button
          onClick={togglePlay}
          className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-200 mb-6"
        >
          {isPlaying ? (
            <Pause className="h-8 w-8 text-white ml-0" />
          ) : (
            <Play className="h-8 w-8 text-white ml-1" />
          )}
        </button>

        {/* Volume Control */}
        <div className="flex items-center space-x-3 text-white/80">
          <Volume2 className="h-5 w-5" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Hidden Audio Element */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="metadata"
          />
        )}
      </div>

      {/* Custom slider styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}