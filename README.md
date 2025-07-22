# SpacBSA - File Storage Application

SpacBSA là ứng dụng lưu trữ file đám mây hiện đại được xây dựng với React, TypeScript, Express.js và PostgreSQL. Ứng dụng cung cấp nền tảng bảo mật để upload, tổ chức và chia sẻ file với các tính năng như quản lý thư mục, chia sẻ file và AI assistant.

## ✨ Tính năng chính

- 🔐 **Xác thực Firebase** - Đăng ký/đăng nhập bằng email/password với điều khoản sử dụng
- 📁 **Quản lý file & thư mục** - Tổ chức file theo cây thư mục
- ⬆️ **Upload file** - Hỗ trợ file lên đến 100MB
- 🔗 **Chia sẻ file** - Tạo link public để chia sẻ
- 👀 **Xem file trực tuyến** - Preview hình ảnh, video, audio, text, PDF
- 📱 **Responsive design** - Hoạt động mượt mà trên mobile và desktop
- 🎨 **Giao diện đẹp** - Gradient theme với hiệu ứng glass
- 🔒 **Bảo mật cao** - Mỗi user chỉ truy cập được file của mình

## 🚀 Cài đặt và chạy

### 1. Clone repository
```bash
git clone https://github.com/YOUR_USERNAME/spacbsa-storage.git
cd spacbsa-storage
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình environment variables
Cập nhật file `.env` với thông tin thật:

```env
# Database Configuration
DATABASE_URL=your_postgresql_connection_string

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 4. Thiết lập database
```bash
npm run db:push
```

### 5. Chạy ứng dụng
```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5000`

## 🏗️ Kiến trúc công nghệ

### Frontend
- **React 18** với TypeScript
- **Tailwind CSS** + shadcn/ui components
- **TanStack Query** cho state management
- **Wouter** cho routing
- **Vite** cho development server

### Backend
- **Express.js** với TypeScript
- **Drizzle ORM** cho database operations
- **Multer** cho file upload
- **Firebase Auth** cho authentication

### Database
- **PostgreSQL** với Neon serverless
- **Drizzle migrations** cho schema management

## 📊 Database Schema

- **users** - Lưu thông tin user từ Firebase
- **folders** - Cấu trúc thư mục phân cấp
- **files** - Metadata file và đường dẫn storage
- **shares** - Quyền chia sẻ file với email

## 🔧 Scripts

```bash
npm run dev      # Chạy development server
npm run build    # Build cho production
npm run start    # Chạy production server
npm run check    # Type checking
npm run db:push  # Push database schema
```

## 🚀 Deployment

Ứng dụng có thể deploy trên:
- **Replit** (recommended)
- **Vercel**
- **Railway**
- **Heroku**
- Bất kỳ platform nào hỗ trợ Node.js

### Environment variables cần thiết:
- `DATABASE_URL` - PostgreSQL connection string
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID

## 🔒 Bảo mật

- ✅ File access permissions - User chỉ truy cập được file của mình
- ✅ Firebase authentication validation
- ✅ Share token cho file công khai
- ✅ API rate limiting và validation

## 📝 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🤝 Contributing

Contributions, issues và feature requests đều được welcome!

---

Made with ❤️ by SpacBSA Team