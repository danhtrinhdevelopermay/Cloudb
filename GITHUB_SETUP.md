# Hướng dẫn Push SpacBSA lên GitHub

## Bước 1: Chuẩn bị Repository

1. Đi tới https://github.com và tạo repository mới
2. Đặt tên repository (ví dụ: "spacbsa-storage")
3. Chọn **Public** hoặc **Private** tùy ý
4. **KHÔNG** chọn "Add a README file" hoặc ".gitignore" 

## Bước 2: Chuẩn bị file .env

Trước khi push, bạn cần cập nhật file `.env` với thông tin thật:

```env
# Database Configuration
DATABASE_URL=your_actual_postgresql_url_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_actual_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_actual_firebase_project_id
VITE_FIREBASE_APP_ID=your_actual_firebase_app_id

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Bước 3: Push lên GitHub

Mở Terminal trong Replit và chạy các lệnh sau:

```bash
# Thêm tất cả file (bao gồm file ẩn)
git add -A

# Commit với message
git commit -m "Initial SpacBSA project setup with complete migration"

# Thêm remote repository (thay YOUR_USERNAME và YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push lên GitHub
git push -u origin main
```

## Bước 4: Nếu gặp lỗi authentication

Nếu GitHub yêu cầu authentication:

1. Tạo Personal Access Token:
   - Đi tới GitHub → Settings → Developer settings → Personal access tokens
   - Tạo token mới với quyền "repo"
   - Copy token

2. Sử dụng token khi push:
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Lưu ý quan trọng

- ✅ File `.env` sẽ được push lên GitHub (như bạn yêu cầu)
- ⚠️ Đảm bảo thông tin trong `.env` không quá nhạy cảm
- ✅ Tất cả file ẩn (bắt đầu bằng dấu chấm) sẽ được include
- ✅ Project đã sẵn sàng deploy trên bất kỳ platform nào

## File được bao gồm

- ✅ `.env` - Environment variables
- ✅ `.env.example` - Template file
- ✅ `.gitignore` - Git ignore rules (đã cập nhật)
- ✅ Tất cả source code
- ✅ Database migrations và schema
- ✅ Firebase configuration
- ✅ Dependencies và package files

Project SpacBSA của bạn sẽ hoàn toàn có thể clone và chạy trên máy khác!