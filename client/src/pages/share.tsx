import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Image, Video, Music, File, Cloud, Eye } from "lucide-react";
import { FileViewer } from "@/components/ui/file-viewer";
import { formatDistanceToNow } from "date-fns";
import { File as FileType } from "@shared/schema";

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

export default function SharePage() {
  const [match, params] = useRoute("/share/:token");
  const [file, setFile] = useState<FileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showViewer, setShowViewer] = useState(false);

  useEffect(() => {
    if (!params?.token) return;

    const fetchSharedFile = async () => {
      try {
        const response = await fetch(`/api/share/${params.token}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("This shared file could not be found or has been removed.");
          } else {
            setError("Failed to load shared file.");
          }
          return;
        }
        const fileData = await response.json();
        setFile(fileData);
      } catch (err) {
        setError("Failed to load shared file.");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedFile();
  }, [params?.token]);

  const handleDownload = () => {
    if (file) {
      window.open(`/api/files/${file.id}/download`, "_blank");
    }
  };

  const handleView = () => {
    setShowViewer(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-pulse">
            <Cloud className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-600">Loading shared file...</p>
        </div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <Cloud className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-red-600">File Not Found</CardTitle>
            <CardDescription>
              {error || "The shared file you're looking for doesn't exist or has been removed."}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
            >
              Go to CloudBox
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const IconComponent = getFileIcon(file.mimeType);
  const isImage = file.mimeType.startsWith("image/");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full backdrop-blur-sm bg-white/90 border-white/20 shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <Cloud className="h-8 w-8 text-white" />
          </div>
          <CardTitle>Shared File</CardTitle>
          <CardDescription>
            Someone shared this file with you via CloudBox
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* File Preview */}
          <div className="text-center">
            {isImage ? (
              <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Image className="h-16 w-16 text-blue-600" />
              </div>
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4">
                <IconComponent className="h-16 w-16 text-gray-600" />
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg truncate" title={file.originalName}>
                {file.originalName}
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Size:</span>
                <br />
                {formatFileSize(file.size)}
              </div>
              <div>
                <span className="font-medium">Shared:</span>
                <br />
                {formatDistanceToNow(new Date(file.updatedAt))} ago
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleView}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              size="lg"
            >
              <Eye className="mr-2 h-5 w-5" />
              View File
            </Button>
            
            <Button 
              onClick={handleDownload}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Download File
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t">
            <p>Powered by CloudBox - Your Modern Cloud Storage</p>
          </div>
        </CardContent>
      </Card>

      {/* File Viewer Modal */}
      {file && (
        <FileViewer
          file={file}
          isOpen={showViewer}
          onClose={() => setShowViewer(false)}
        />
      )}
    </div>
  );
}