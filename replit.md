# SpacBSA - File Storage Application

## Overview

SpacBSA is a modern cloud storage application built with React, TypeScript, Express.js, and PostgreSQL. It provides users with a secure platform to upload, organize, and share files with features like folder management, file sharing, and an AI-powered pet assistant. The application features a beautiful gradient-themed responsive interface optimized for both mobile and desktop devices.

## User Preferences

Preferred communication style: Simple, everyday language.
Environment configuration: Use .env files instead of Replit Secrets.
Security: Fixed critical file access permissions - users can only access their own files unless shared via token.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite with hot module replacement
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **File Upload**: Multer for handling multipart/form-data
- **Session Management**: Express sessions with PostgreSQL store

### Authentication Strategy
- **Provider**: Firebase Authentication for user management
- **Flow**: Firebase handles authentication, custom backend validates Firebase ID tokens
- **Session**: Firebase UID is passed via headers to authorize API requests

## Key Components

### Database Schema
- **Users**: Stores Firebase UID, email, display name, and profile information
- **Folders**: Hierarchical folder structure with parent-child relationships
- **Files**: File metadata including name, size, MIME type, and storage path
- **Shares**: File sharing permissions with email-based access control

### API Structure
- **Authentication Middleware**: Validates Firebase UID from request headers
- **User Management**: CRUD operations for user profiles
- **File Operations**: Upload, download, delete with folder organization
- **Sharing System**: Create and manage file sharing links

### File Storage
- **Local Storage**: Files stored in `/uploads` directory with unique naming
- **File Naming**: Timestamp + nanoid + original filename for uniqueness
- **Size Limits**: 100MB maximum file size per upload

## Data Flow

1. **Authentication**: Users authenticate through Firebase, tokens validated on backend
2. **File Upload**: Frontend uploads files via multipart form, backend stores in filesystem
3. **Database Operations**: Drizzle ORM handles all database interactions with type safety
4. **File Access**: Files served through Express static middleware with permission checks
5. **Sharing**: Share tokens generated for public file access without authentication

## External Dependencies

### Core Technologies
- **Database**: PostgreSQL with Neon serverless connection
- **Authentication**: Firebase Auth for user management
- **File Handling**: Multer for upload processing
- **UI Framework**: Radix UI + Tailwind for component system

### Development Tools
- **Database Migrations**: Drizzle Kit for schema management
- **Type Safety**: TypeScript with strict configuration
- **Code Quality**: ESBuild for production bundling
- **Development**: Vite dev server with HMR

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle pushes schema changes to PostgreSQL

### Environment Requirements
- **DATABASE_URL**: PostgreSQL connection string (required)
- **Firebase Config**: API keys and project configuration for authentication
- **File System**: Writable `/uploads` directory for file storage

### Production Setup
- **Static Files**: Express serves built frontend from `dist/public`
- **API Routes**: Express handles `/api/*` endpoints
- **Database**: Connection pooling with Neon serverless PostgreSQL
- **File Storage**: Local filesystem storage (consider cloud storage for scaling)

### Development Mode
- **Frontend**: Vite dev server with proxy to backend API
- **Backend**: TSX for TypeScript execution with auto-restart
- **Database**: Local or cloud PostgreSQL with Drizzle migrations

## Recent Changes (Latest)

### July 22, 2025
✓ Successfully migrated from Replit Agent to Replit environment
✓ Configured .env file for environment variables instead of Replit Secrets
✓ Fixed Firebase source map build issues
✓ PostgreSQL database connection established
✓ All dependencies properly installed
✓ **CRITICAL SECURITY FIX**: Fixed file access permissions - users can now only access their own files
✓ Added proper authentication checks for file download and view endpoints
✓ Enhanced file sharing security with proper token validation
✓ Configured Git for GitHub deployment with all files included (including .env)
✓ Created comprehensive documentation and setup scripts
✓ Rebranded application to SpacBSA with new logo integration
✓ Added comprehensive Terms of Service page in Vietnamese
✓ Updated all UI components with new branding

### July 21, 2025
✓ Complete CloudBox application setup with Firebase authentication
✓ PostgreSQL database schema deployed with users, folders, files, and shares tables
✓ Beautiful gradient-themed UI implementation (light blue → dark blue → orange → pink)
✓ File upload, download, and sharing functionality implemented
✓ AI-powered pet assistant component with cute animations
✓ Responsive design for mobile and desktop
✓ Enhanced visual effects with hover animations and glass effects
✓ Type-safe API integration with React Query for state management
✓ Real-time file management with progress indicators
✓ Fixed shared file links with dedicated share page
✓ Added comprehensive file viewer with support for images, videos, audio, text, and PDFs
✓ File viewer includes zoom, rotation controls for images
✓ Click-to-view functionality on file cards
✓ Enhanced shared file pages with view functionality
✓ Rich file previews in grid cards with thumbnails and type-specific displays
✓ Video files show blurred preview with play icon overlay
✓ Audio files display song name on gradient background
✓ Document types show color-coded icons

## Current Status
The application is fully functional with:
- Email/password authentication via Firebase
- File upload with 100MB size limit
- File organization with folder support
- File sharing with public URLs
- Beautiful responsive interface
- Pet assistant for user guidance
- Real-time file operations