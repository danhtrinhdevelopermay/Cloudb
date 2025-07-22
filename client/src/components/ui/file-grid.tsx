import { formatDistanceToNow } from "date-fns";
import { File as FileType } from "@shared/schema";
import { Button } from "./button";
import { MoreHorizontal, Share, Download, Trash2, FileText, Image, Video, Music, File, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useState, useEffect } from "react";
import { addAuthHeader } from "@/contexts/AuthContext";

interface FileGridProps {
  files: FileType[];
  onShare: (file: FileType) => void;
  onDownload: (file: FileType) => void;
  onDelete: (file: FileType) => void;
  onView?: (file: FileType) => void;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.startsWith("video/")) return Video;
  if (mimeType.startsWith("audio/")) return Music;
  if (mimeType.includes("pdf") || mimeType.includes("document")) return FileText;
  return File;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function VideoThumbnail({ file }: { file: FileType }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        // Get Firebase auth headers
        const authHeaders = await addAuthHeader();
        const headers = {
          'Accept': file.mimeType,
          ...authHeaders
        };

        const response = await fetch(`/api/files/${file.id}/download`, {
          credentials: 'include',
          headers
        });
        
        if (response.ok) {
          const blob = await response.blob();
          if (blob.size > 0) {
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
          }
        } else if (response.status === 404) {
          console.log('Video file not found on disk');
        } else if (response.status === 403) {
          console.log('Access denied for video');
        } else {
          console.log('Failed to load video, status:', response.status);
        }
      } catch (error) {
        console.error('Failed to load video:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVideo();

    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [file.id, file.mimeType]);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-300 to-gray-400">
      {videoUrl && !loading ? (
        <video
          src={videoUrl}
          className="w-full h-full object-cover filter blur-[3px] opacity-70"
          muted
          preload="metadata"
          onLoadedData={(e) => {
            // Seek to 1 second to get a better thumbnail
            const video = e.target as HTMLVideoElement;
            if (video.duration > 1) {
              video.currentTime = 1;
            }
          }}
          onError={(e) => {
            console.log('Video load error:', e);
            setLoading(false);
          }}
        />
      ) : loading ? (
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-purple-200 to-purple-300" />
      )}
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
        <div className="bg-white/90 rounded-full p-3 shadow-lg">
          <Video className="h-8 w-8 text-purple-600" />
        </div>
      </div>
    </div>
  );
}

export function FileGrid({ files, onShare, onDownload, onDelete, onView }: FileGridProps) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <File className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">No files found</p>
        <p className="text-sm">Upload some files to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {files.map((file) => {
        const IconComponent = getFileIcon(file.mimeType);
        const isImage = file.mimeType.startsWith("image/");
        
        return (
          <div
            key={file.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer file-hover cute-shadow"
            onClick={() => onView?.(file)}
          >
            {/* File Preview Area */}
            <div className="w-full h-32 rounded-t-lg overflow-hidden relative">
              {isImage ? (
                <img
                  src={`/api/files/${file.id}/download`}
                  alt={file.originalName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : file.mimeType.startsWith("video/") ? (
                <VideoThumbnail file={file} />
              
              ) : file.mimeType.startsWith("audio/") ? (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex flex-col items-center justify-center text-white p-2">
                  <Music className="h-8 w-8 mb-2" />
                  <div className="text-xs text-center font-medium leading-tight">
                    {file.originalName.replace(/\.[^/.]+$/, "").length > 24 
                      ? file.originalName.replace(/\.[^/.]+$/, "").substring(0, 24) + "..."
                      : file.originalName.replace(/\.[^/.]+$/, "")
                    }
                  </div>
                </div>
              ) : file.mimeType.includes("pdf") ? (
                <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-red-600" />
                </div>
              ) : file.mimeType.startsWith("text/") || 
                   file.mimeType.includes("javascript") || 
                   file.mimeType.includes("json") ||
                   file.originalName.endsWith(".md") ||
                   file.originalName.endsWith(".txt") ? (
                <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-green-600" />
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <IconComponent className="h-12 w-12 text-gray-600" />
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-gray-900 truncate mb-2" title={file.originalName}>
                {file.originalName}
              </h3>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>{formatFileSize(file.size)}</span>
                <span>{formatDistanceToNow(new Date(file.updatedAt))} ago</span>
              </div>
              
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(file);
                  }}
                  className="text-xs"
                >
                  <Share className="h-3 w-3 mr-1" />
                  Share
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onView && (
                      <DropdownMenuItem onClick={() => onView(file)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onDownload(file)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onShare(file)}>
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(file)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
