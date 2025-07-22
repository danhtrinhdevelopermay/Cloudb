import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Progress } from "./progress";
import { Button } from "./button";
import { X, Upload, File } from "lucide-react";

interface FileUploadProps {
  onUpload: (file: globalThis.File, folderId?: number) => Promise<void>;
  folderId?: number;
  onClose: () => void;
}

export function FileUpload({ onUpload, folderId, onClose }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadingFile, setUploadingFile] = useState<string>("");

  const onDrop = useCallback(async (acceptedFiles: globalThis.File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setUploadingFile(file.name);
    setProgress(0);

    try {
      // Simulate progress for demo (in real implementation, track actual upload progress)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onUpload(file, folderId);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Close modal after successful upload
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  }, [onUpload, folderId, onClose]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: uploading,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 transform transition-all">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upload Files</h3>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={uploading}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {!uploading ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragActive 
                ? "border-blue-400 bg-blue-50" 
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              {isDragActive
                ? "Drop the files here..."
                : "Drag and drop files here, or"}
            </p>
            <Button variant="outline" className="text-blue-600 hover:text-blue-800">
              Browse Files
            </Button>
            <p className="text-sm text-gray-400 mt-2">Maximum file size: 100MB</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <File className="h-8 w-8 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 truncate">{uploadingFile}</p>
                <p className="text-sm text-gray-500">Uploading... {progress}%</p>
              </div>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
