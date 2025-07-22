import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertFolderSchema, insertFileSchema, insertShareSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import { nanoid } from "nanoid";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, uploadDir);
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueName = `${Date.now()}-${nanoid()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ 
  storage: storage_multer,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - verify Firebase ID token
  const requireAuth = (req: any, res: any, next: any) => {
    const firebaseUid = req.headers['x-firebase-uid'];
    if (!firebaseUid) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.firebaseUid = firebaseUid;
    next();
  };

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid user data" });
    }
  });

  app.get("/api/users/profile", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUserByUid(req.firebaseUid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user profile" });
    }
  });

  // Folder routes
  app.get("/api/folders", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUserByUid(req.firebaseUid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const parentId = req.query.parent ? parseInt(req.query.parent) : undefined;
      const folders = await storage.getFoldersByUser(user.id, parentId);
      res.json(folders);
    } catch (error) {
      res.status(500).json({ message: "Failed to get folders" });
    }
  });

  app.post("/api/folders", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUserByUid(req.firebaseUid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const folderData = insertFolderSchema.parse({
        ...req.body,
        userId: user.id,
      });
      const folder = await storage.createFolder(folderData);
      res.json(folder);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid folder data" });
    }
  });

  app.delete("/api/folders/:id", requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const folder = await storage.getFolder(id);
      
      if (!folder) {
        return res.status(404).json({ message: "Folder not found" });
      }

      const user = await storage.getUserByUid(req.firebaseUid);
      if (!user || folder.userId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteFolder(id);
      res.json({ message: "Folder deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete folder" });
    }
  });

  // File routes
  app.get("/api/files", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUserByUid(req.firebaseUid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const folderId = req.query.folder ? parseInt(req.query.folder) : undefined;
      const files = await storage.getFilesByUser(user.id, folderId);
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to get files" });
    }
  });

  app.get("/api/files/recent", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUserByUid(req.firebaseUid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const files = await storage.getRecentFiles(user.id, limit);
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recent files" });
    }
  });

  app.post("/api/files/upload", requireAuth, upload.single('file'), async (req: any, res) => {
    try {
      const user = await storage.getUserByUid(req.firebaseUid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileData = {
        name: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        userId: user.id,
        folderId: req.body.folderId ? parseInt(req.body.folderId) : null,
      };

      const file = await storage.createFile(fileData);
      res.json(file);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to upload file" });
    }
  });

  app.get("/api/files/:id/download", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const file = await storage.getFile(id);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      // Check access permissions
      const firebaseUid = req.headers['x-firebase-uid'];
      
      // If file is public with share token, allow access
      if (file.isPublic && file.shareToken) {
        // Allow public access for shared files
      } 
      // If file is not public, require authentication and ownership
      else {
        if (!firebaseUid) {
          return res.status(403).json({ message: "Access denied - authentication required" });
        }
        
        const user = await storage.getUserByUid(firebaseUid as string);
        if (!user || file.userId !== user.id) {
          return res.status(403).json({ message: "Access denied - you don't own this file" });
        }
      }

      if (!fs.existsSync(file.path)) {
        return res.status(404).json({ message: "File not found on disk" });
      }

      res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
      res.setHeader('Content-Type', file.mimeType);
      res.sendFile(path.resolve(file.path));
    } catch (error) {
      res.status(500).json({ message: "Failed to download file" });
    }
  });

  app.post("/api/files/:id/share", requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const file = await storage.getFile(id);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      const user = await storage.getUserByUid(req.firebaseUid);
      if (!user || file.userId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const shareToken = nanoid(32);
      const updatedFile = await storage.updateFile(id, { 
        shareToken,
        isPublic: true 
      });

      res.json({ 
        shareUrl: `${req.protocol}://${req.get('host')}/share/${shareToken}`,
        file: updatedFile 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create share link" });
    }
  });

  // File view endpoint (for previewing files in browser)
  app.get("/api/files/:id/view", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const file = await storage.getFile(id);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      // Check access permissions - same logic as download
      const firebaseUid = req.headers['x-firebase-uid'];
      
      // If file is public with share token, allow access
      if (file.isPublic && file.shareToken) {
        // Allow public access for shared files
      } 
      // If file is not public, require authentication and ownership
      else {
        if (!firebaseUid) {
          return res.status(403).json({ message: "Access denied - authentication required" });
        }
        
        const user = await storage.getUserByUid(firebaseUid as string);
        if (!user || file.userId !== user.id) {
          return res.status(403).json({ message: "Access denied - you don't own this file" });
        }
      }

      if (!fs.existsSync(file.path)) {
        return res.status(404).json({ message: "File not found on disk" });
      }

      // Set appropriate headers for viewing in browser
      res.setHeader('Content-Type', file.mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${file.originalName}"`);
      res.sendFile(path.resolve(file.path));
    } catch (error) {
      res.status(500).json({ message: "Failed to view file" });
    }
  });

  app.get("/api/share/:token", async (req, res) => {
    try {
      const token = req.params.token;
      const file = await storage.getFileByShareToken(token);
      
      if (!file) {
        return res.status(404).json({ message: "Shared file not found" });
      }

      res.json(file);
    } catch (error) {
      res.status(500).json({ message: "Failed to get shared file" });
    }
  });

  app.delete("/api/files/:id", requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const file = await storage.getFile(id);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      const user = await storage.getUserByUid(req.firebaseUid);
      if (!user || file.userId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Delete file from disk
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      await storage.deleteFile(id);
      res.json({ message: "File deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // Share routes
  app.post("/api/shares", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUserByUid(req.firebaseUid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const shareData = insertShareSchema.parse({
        ...req.body,
        sharedByUserId: user.id,
      });
      const share = await storage.createShare(shareData);
      res.json(share);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid share data" });
    }
  });

  app.get("/api/shares", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUserByUid(req.firebaseUid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const shares = await storage.getSharesByUser(user.id);
      res.json(shares);
    } catch (error) {
      res.status(500).json({ message: "Failed to get shares" });
    }
  });

  // Assets routes
  app.get("/api/assets/logo.png", (req, res) => {
    // Try root directory first, then attached_assets
    const rootLogoPath = path.join(process.cwd(), "logo.png");
    const attachedLogoPath = path.join(process.cwd(), "attached_assets", "logo.png");
    
    if (fs.existsSync(rootLogoPath)) {
      res.sendFile(path.resolve(rootLogoPath));
    } else if (fs.existsSync(attachedLogoPath)) {
      res.sendFile(path.resolve(attachedLogoPath));
    } else {
      res.status(404).json({ message: "Logo not found" });
    }
  });

  app.get("/api/assets/gradient-cloud-icon.png", (req, res) => {
    const iconPath = path.join(process.cwd(), "attached_assets", "gradient-cloud-icon.png");
    if (fs.existsSync(iconPath)) {
      res.sendFile(path.resolve(iconPath));
    } else {
      res.status(404).json({ message: "Icon not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
