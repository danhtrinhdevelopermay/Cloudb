import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth, addAuthHeader } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { File, Folder } from "@shared/schema";
import { FileGrid } from "@/components/ui/file-grid";
import { FileUpload } from "@/components/ui/file-upload";
import { PetAssistant } from "@/components/ui/pet-assistant";
import { FileViewer } from "@/components/ui/file-viewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Cloud,
  Search,
  Plus,
  Home,
  Share,
  Clock,
  Star,
  Trash2,
  FolderPlus,
  Bell,
  ChevronDown,
  Menu,
  Image,
  FileText,
  Video,
  Music,
  Grid3X3,
  List,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [showUpload, setShowUpload] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch recent files
  const { data: recentFiles = [], isLoading: loadingRecent } = useQuery<File[]>({
    queryKey: ["/api/files/recent"],
    queryFn: async () => {
      const headers = await addAuthHeader();
      const response = await fetch("/api/files/recent", { headers });
      if (!response.ok) throw new Error("Failed to fetch recent files");
      return response.json();
    },
  });

  // Fetch all files
  const { data: allFiles = [], isLoading: loadingFiles } = useQuery<File[]>({
    queryKey: ["/api/files"],
    queryFn: async () => {
      const headers = await addAuthHeader();
      const response = await fetch("/api/files", { headers });
      if (!response.ok) throw new Error("Failed to fetch files");
      return response.json();
    },
  });

  // Upload file mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: globalThis.File) => {
      const headers = await addAuthHeader();
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/files/upload", {
        method: "POST",
        headers,
        body: formData,
      });
      
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/files/recent"] });
      toast({
        title: "Upload successful",
        description: "Your file has been uploaded successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload file.",
      });
    },
  });

  // Create folder mutation
  const createFolderMutation = useMutation({
    mutationFn: async (folderName: string) => {
      const response = await apiRequest("POST", "/api/folders", {
        name: folderName,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/folders"] });
      setShowNewFolder(false);
      setNewFolderName("");
      toast({
        title: "Folder created",
        description: "Your new folder has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to create folder",
        description: error.message || "Could not create folder.",
      });
    },
  });

  // Share file mutation
  const shareMutation = useMutation({
    mutationFn: async (fileId: number) => {
      const headers = await addAuthHeader();
      const response = await fetch(`/api/files/${fileId}/share`, {
        method: "POST",
        headers,
      });
      if (!response.ok) throw new Error("Failed to create share link");
      return response.json();
    },
    onSuccess: (data) => {
      setShareUrl(data.shareUrl);
      toast({
        title: "Share link created",
        description: "Share link has been generated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Share failed",
        description: error.message || "Failed to create share link.",
      });
    },
  });

  // Delete file mutation
  const deleteMutation = useMutation({
    mutationFn: async (fileId: number) => {
      const headers = await addAuthHeader();
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) throw new Error("Failed to delete file");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/files/recent"] });
      toast({
        title: "File deleted",
        description: "File has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message || "Failed to delete file.",
      });
    },
  });

  const handleUpload = async (file: globalThis.File, folderId?: number) => {
    await uploadMutation.mutateAsync(file);
  };

  const handleShare = async (file: File) => {
    setSelectedFile(file);
    setShowShare(true);
    await shareMutation.mutateAsync(file.id);
  };

  const handleDownload = (file: File) => {
    window.open(`/api/files/${file.id}/download`, "_blank");
  };

  const handleDelete = async (file: File) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      await deleteMutation.mutateAsync(file.id);
    }
  };

  const handleView = (file: File) => {
    setSelectedFile(file);
    setShowViewer(true);
  };

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied",
      description: "Share link has been copied to clipboard.",
    });
  };

  const getFileTypeCount = (type: string) => {
    return allFiles.filter(file => {
      switch (type) {
        case "images": return file.mimeType.startsWith("image/");
        case "documents": return file.mimeType.includes("pdf") || file.mimeType.includes("document");
        case "videos": return file.mimeType.startsWith("video/");
        case "music": return file.mimeType.startsWith("audio/");
        default: return false;
      }
    }).length;
  };

  const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);
  const storageUsedGB = totalSize / (1024 * 1024 * 1024);
  const storageUsedPercentage = Math.min((storageUsedGB / 10) * 100, 100);

  const Sidebar = () => (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 flex-1">
        <Button 
          onClick={() => setShowUpload(true)}
          className="w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:from-blue-500 hover:via-purple-600 hover:to-pink-600 text-white py-3 px-4 rounded-lg font-medium mb-6"
        >
          <Plus className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
        
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Storage Used</span>
            <span className="text-sm text-gray-600">{Math.round(storageUsedPercentage)}%</span>
          </div>
          <Progress value={storageUsedPercentage} className="mb-1" />
          <p className="text-xs text-gray-500">
            {storageUsedGB.toFixed(2)} GB of 10 GB used
          </p>
        </div>
        
        <nav className="space-y-2">
          <a href="#" className="flex items-center space-x-3 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg font-medium">
            <Home className="h-5 w-5" />
            <span>My Files</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg">
            <Share className="h-5 w-5" />
            <span>Shared with me</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg">
            <Clock className="h-5 w-5" />
            <span>Recent</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg">
            <Star className="h-5 w-5" />
            <span>Favorites</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg">
            <Trash2 className="h-5 w-5" />
            <span>Trash</span>
          </a>
        </nav>
        
        <div className="mt-8 p-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-sm">🐾</span>
            </div>
            <span className="font-medium text-gray-800">Pet Assistant</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Hi! I'm here to help you manage your files. Ask me anything!
          </p>
          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            Chat with me →
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <Sidebar />
                </SheetContent>
              </Sheet>
              
              <div className="w-10 h-10">
                <img src="/api/assets/gradient-cloud-icon.png" alt="SpacBSA Icon" className="w-10 h-10 rounded-xl" />
              </div>
              <div className="flex items-center gap-2">
                <img src="/api/assets/logo.png" alt="SpacBSA Logo" className="w-8 h-8 rounded object-contain" />
                <h1 className="text-xl font-bold text-gray-900">SpacBSA</h1>
              </div>
            </div>
            
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search files and folders..."
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">{user?.displayName?.[0] || user?.email?.[0]}</span>
                    </div>
                    <span className="hidden sm:block font-medium text-gray-700">
                      {user?.displayName || user?.email}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={logout}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm">
                  <Home className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">My Files</span>
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                  <span className="text-gray-900 font-medium">All Files</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button className="px-3 py-1 text-sm bg-white text-gray-900 rounded shadow-sm">
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowNewFolder(true)}
                  >
                    <FolderPlus className="mr-2 h-4 w-4" />
                    New Folder
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Quick Access */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white hover:shadow-lg transition-shadow cursor-pointer">
                    <Image className="h-8 w-8 mb-2" />
                    <h3 className="font-medium">Photos</h3>
                    <p className="text-sm opacity-75">{getFileTypeCount("images")} files</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl text-white hover:shadow-lg transition-shadow cursor-pointer">
                    <FileText className="h-8 w-8 mb-2" />
                    <h3 className="font-medium">Documents</h3>
                    <p className="text-sm opacity-75">{getFileTypeCount("documents")} files</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl text-white hover:shadow-lg transition-shadow cursor-pointer">
                    <Video className="h-8 w-8 mb-2" />
                    <h3 className="font-medium">Videos</h3>
                    <p className="text-sm opacity-75">{getFileTypeCount("videos")} files</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl text-white hover:shadow-lg transition-shadow cursor-pointer">
                    <Music className="h-8 w-8 mb-2" />
                    <h3 className="font-medium">Music</h3>
                    <p className="text-sm opacity-75">{getFileTypeCount("music")} files</p>
                  </div>
                </div>
              </div>

              {/* Recent Files */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Files</h2>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                    View all
                  </Button>
                </div>
                
                {loadingRecent ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-48" />
                    ))}
                  </div>
                ) : (
                  <FileGrid
                    files={recentFiles.slice(0, 8)}
                    onShare={handleShare}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                )}
              </div>

              {/* All Files */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">All Files</h2>
                
                {loadingFiles ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-48" />
                    ))}
                  </div>
                ) : (
                  <FileGrid
                    files={allFiles}
                    onShare={handleShare}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* File Upload Modal */}
      {showUpload && (
        <FileUpload
          onUpload={handleUpload}
          onClose={() => setShowUpload(false)}
        />
      )}

      {/* Share Modal */}
      <Dialog open={showShare} onOpenChange={setShowShare}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share File</DialogTitle>
            <DialogDescription>
              Share "{selectedFile?.originalName}" with others
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shareable Link
              </label>
              <div className="flex">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1 rounded-r-none bg-gray-50"
                />
                <Button
                  onClick={copyShareUrl}
                  className="rounded-l-none"
                  disabled={!shareUrl}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Folder Dialog */}
      <Dialog open={showNewFolder} onOpenChange={setShowNewFolder}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Choose a name for your new folder
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Folder Name
              </label>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newFolderName.trim()) {
                    createFolderMutation.mutate(newFolderName.trim());
                  }
                }}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowNewFolder(false);
                  setNewFolderName("");
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => createFolderMutation.mutate(newFolderName.trim())}
                disabled={!newFolderName.trim() || createFolderMutation.isPending}
                className="bg-gradient-to-r from-blue-500 to-purple-500"
              >
                {createFolderMutation.isPending ? "Creating..." : "Create Folder"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* File Viewer Modal */}
      {selectedFile && (
        <FileViewer
          file={selectedFile}
          isOpen={showViewer}
          onClose={() => {
            setShowViewer(false);
            setSelectedFile(null);
          }}
        />
      )}

      {/* Pet Assistant */}
      <PetAssistant />
    </div>
  );
}
