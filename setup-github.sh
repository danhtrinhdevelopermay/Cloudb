#!/bin/bash

echo "🚀 CloudBox GitHub Setup Script"
echo "================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
fi

echo ""
echo "📝 Current git status:"
git status

echo ""
echo "➕ Adding all files (including hidden files)..."
git add -A

echo ""
echo "📝 Files to be committed:"
git status

echo ""
echo "💬 Committing files..."
git commit -m "Initial CloudBox project setup with complete migration and security fixes

- Full-stack file storage application with React + Express
- Firebase authentication integration
- PostgreSQL database with Drizzle ORM
- File upload, download, and sharing functionality
- Security fixes for file access permissions
- Environment configuration with .env files
- Beautiful responsive UI with gradient theme
- AI assistant and file viewer features"

echo ""
echo "🔗 To push to GitHub, run these commands:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
echo "   git push -u origin main"
echo ""
echo "📖 For detailed instructions, see GITHUB_SETUP.md"
echo "✅ Setup complete!"