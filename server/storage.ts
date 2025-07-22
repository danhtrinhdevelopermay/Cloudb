import { users, folders, files, shares, type User, type InsertUser, type Folder, type InsertFolder, type File, type InsertFile, type Share, type InsertShare } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUid(uid: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;

  // Folders
  getFolder(id: number): Promise<Folder | undefined>;
  getFoldersByUser(userId: number, parentId?: number): Promise<Folder[]>;
  createFolder(folder: InsertFolder): Promise<Folder>;
  updateFolder(id: number, updates: Partial<Folder>): Promise<Folder>;
  deleteFolder(id: number): Promise<void>;

  // Files
  getFile(id: number): Promise<File | undefined>;
  getFilesByUser(userId: number, folderId?: number): Promise<File[]>;
  getRecentFiles(userId: number, limit?: number): Promise<File[]>;
  createFile(file: InsertFile): Promise<File>;
  updateFile(id: number, updates: Partial<File>): Promise<File>;
  deleteFile(id: number): Promise<void>;
  getFileByShareToken(token: string): Promise<File | undefined>;

  // Shares
  getShare(id: number): Promise<Share | undefined>;
  getSharesByFile(fileId: number): Promise<Share[]>;
  getSharesByUser(userId: number): Promise<Share[]>;
  createShare(share: InsertShare): Promise<Share>;
  updateShare(id: number, updates: Partial<Share>): Promise<Share>;
  deleteShare(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.uid, uid));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() } as any)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Folders
  async getFolder(id: number): Promise<Folder | undefined> {
    const [folder] = await db.select().from(folders).where(eq(folders.id, id));
    return folder || undefined;
  }

  async getFoldersByUser(userId: number, parentId?: number): Promise<Folder[]> {
    return await db
      .select()
      .from(folders)
      .where(
        parentId 
          ? and(eq(folders.userId, userId), eq(folders.parentId, parentId))
          : and(eq(folders.userId, userId), eq(folders.parentId, null as any))
      )
      .orderBy(asc(folders.name));
  }

  async createFolder(insertFolder: InsertFolder): Promise<Folder> {
    const [folder] = await db
      .insert(folders)
      .values(insertFolder)
      .returning();
    return folder;
  }

  async updateFolder(id: number, updates: Partial<Folder>): Promise<Folder> {
    const [folder] = await db
      .update(folders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(folders.id, id))
      .returning();
    return folder;
  }

  async deleteFolder(id: number): Promise<void> {
    await db.delete(folders).where(eq(folders.id, id));
  }

  // Files
  async getFile(id: number): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file || undefined;
  }

  async getFilesByUser(userId: number, folderId?: number): Promise<File[]> {
    return await db
      .select()
      .from(files)
      .where(
        folderId 
          ? and(eq(files.userId, userId), eq(files.folderId, folderId))
          : and(eq(files.userId, userId), eq(files.folderId, null as any))
      )
      .orderBy(desc(files.updatedAt));
  }

  async getRecentFiles(userId: number, limit: number = 10): Promise<File[]> {
    return await db
      .select()
      .from(files)
      .where(eq(files.userId, userId))
      .orderBy(desc(files.updatedAt))
      .limit(limit);
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const [file] = await db
      .insert(files)
      .values(insertFile)
      .returning();
    return file;
  }

  async updateFile(id: number, updates: Partial<File>): Promise<File> {
    const [file] = await db
      .update(files)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(files.id, id))
      .returning();
    return file;
  }

  async deleteFile(id: number): Promise<void> {
    await db.delete(files).where(eq(files.id, id));
  }

  async getFileByShareToken(token: string): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.shareToken, token));
    return file || undefined;
  }

  // Shares
  async getShare(id: number): Promise<Share | undefined> {
    const [share] = await db.select().from(shares).where(eq(shares.id, id));
    return share || undefined;
  }

  async getSharesByFile(fileId: number): Promise<Share[]> {
    return await db
      .select()
      .from(shares)
      .where(eq(shares.fileId, fileId))
      .orderBy(desc(shares.createdAt));
  }

  async getSharesByUser(userId: number): Promise<Share[]> {
    return await db
      .select()
      .from(shares)
      .where(eq(shares.sharedByUserId, userId))
      .orderBy(desc(shares.createdAt));
  }

  async createShare(insertShare: InsertShare): Promise<Share> {
    const [share] = await db
      .insert(shares)
      .values(insertShare)
      .returning();
    return share;
  }

  async updateShare(id: number, updates: Partial<Share>): Promise<Share> {
    const [share] = await db
      .update(shares)
      .set(updates)
      .where(eq(shares.id, id))
      .returning();
    return share;
  }

  async deleteShare(id: number): Promise<void> {
    await db.delete(shares).where(eq(shares.id, id));
  }
}

export const storage = new DatabaseStorage();
