import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Shield, UserCheck, AlertCircle, Scale, Globe } from "lucide-react";
import { Link } from "wouter";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 hover:bg-white/50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img src="/api/assets/logo.png" alt="SpacBSA Logo" className="w-16 h-16 rounded-2xl object-contain" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                SpacBSA
              </h1>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Điều Khoản Sử Dụng</h2>
            <p className="text-gray-600">Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>
          </div>
        </div>

        {/* Terms Content */}
        <div className="space-y-6">
          
          {/* Introduction */}
          <Card className="backdrop-blur-sm bg-white/80 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                1. Giới Thiệu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Chào mừng bạn đến với <strong>SpacBSA</strong> - nền tảng lưu trữ đám mây hiện đại và bảo mật. 
                Bằng việc truy cập và sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây.
              </p>
              <p>
                SpacBSA cung cấp dịch vụ lưu trữ, quản lý và chia sẻ file trực tuyến với công nghệ tiên tiến, 
                đảm bảo tính bảo mật và riêng tư cao nhất cho dữ liệu của bạn.
              </p>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card className="backdrop-blur-sm bg-white/80 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                2. Tài Khoản Người Dùng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">2.1 Đăng Ký Tài Khoản</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Bạn phải cung cấp thông tin chính xác và đầy đủ khi đăng ký</li>
                  <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình</li>
                  <li>Một người chỉ được tạo một tài khoản duy nhất</li>
                  <li>Bạn phải từ 18 tuổi trở lên để sử dụng dịch vụ</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">2.2 Bảo Mật Tài Khoản</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Không chia sẻ thông tin đăng nhập với người khác</li>
                  <li>Thông báo ngay cho chúng tôi nếu phát hiện truy cập trái phép</li>
                  <li>Sử dụng mật khẩu mạnh và thay đổi định kỳ</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* File Storage & Usage */}
          <Card className="backdrop-blur-sm bg-white/80 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                3. Sử Dụng Dịch Vụ Lưu Trữ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">3.1 Quyền Lưu Trữ</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Mỗi file được giới hạn tối đa 100MB</li>
                  <li>Bạn có quyền upload, download, chia sẻ và xóa file của mình</li>
                  <li>Tất cả file được mã hóa và bảo mật theo chuẩn quốc tế</li>
                  <li>Chỉ bạn mới có quyền truy cập file riêng tư của mình</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">3.2 Nội Dung Bị Cấm</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Nội dung vi phạm pháp luật Việt Nam và quốc tế</li>
                  <li>Malware, virus hoặc phần mềm độc hại</li>
                  <li>Nội dung xâm phạm bản quyền</li>
                  <li>Nội dung khiêu dâm, bạo lực hoặc phân biệt chủng tộc</li>
                  <li>Spam hoặc nội dung quảng cáo trái phép</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="backdrop-blur-sm bg-white/80 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                4. Quyền Riêng Tư & Bảo Mật
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">4.1 Bảo Vệ Dữ Liệu</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Chúng tôi sử dụng mã hóa end-to-end để bảo vệ dữ liệu</li>
                  <li>Dữ liệu được sao lưu định kỳ tại nhiều trung tâm dữ liệu</li>
                  <li>Chúng tôi không truy cập nội dung file của bạn</li>
                  <li>Thông tin cá nhân được bảo vệ theo luật pháp Việt Nam</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">4.2 Chia Sẻ File</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>File chia sẻ công khai có thể được truy cập bởi người có link</li>
                  <li>Bạn có thể thu hồi quyền chia sẻ bất cứ lúc nào</li>
                  <li>Chịu trách nhiệm về nội dung file được chia sẻ</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Terms of Service */}
          <Card className="backdrop-blur-sm bg-white/80 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                5. Điều Khoản Pháp Lý
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">5.1 Trách Nhiệm</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>SpacBSA không chịu trách nhiệm về mất mát dữ liệu do lỗi người dùng</li>
                  <li>Người dùng chịu trách nhiệm về nội dung file được upload</li>
                  <li>Chúng tôi có quyền xóa nội dung vi phạm mà không cần thông báo</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">5.2 Chấm Dứt Dịch Vụ</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Bạn có thể xóa tài khoản bất cứ lúc nào</li>
                  <li>Chúng tôi có quyền đình chỉ tài khoản vi phạm điều khoản</li>
                  <li>Dữ liệu sẽ được xóa hoàn toàn sau 30 ngày kể từ khi chấm dứt</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Updates */}
          <Card className="backdrop-blur-sm bg-white/80 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                6. Liên Hệ & Cập Nhật
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">6.1 Thay Đổi Điều Khoản</h4>
                <p className="text-gray-700">
                  Chúng tôi có quyền cập nhật điều khoản sử dụng. Những thay đổi quan trọng sẽ được thông báo 
                  qua email hoặc thông báo trong ứng dụng ít nhất 30 ngày trước khi có hiệu lực.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">6.2 Hỗ Trợ Khách Hàng</h4>
                <p className="text-gray-700">
                  Nếu bạn có bất kỳ câu hỏi nào về điều khoản sử dụng hoặc cần hỗ trợ, 
                  vui lòng liên hệ với chúng tôi qua:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 mt-2">
                  <li>Email: support@spacbsa.com</li>
                  <li>Hotline: 1900-xxx-xxx</li>
                  <li>Website: www.spacbsa.com</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Acceptance */}
          <Card className="backdrop-blur-sm bg-white/80 border-white/20 border-2 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  Bằng việc sử dụng SpacBSA, bạn xác nhận đã đọc, hiểu và đồng ý với tất cả các điều khoản trên.
                </p>
                <p className="text-gray-600">
                  Điều khoản này có hiệu lực kể từ ngày {new Date().toLocaleDateString('vi-VN')}
                </p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700">
              Trở về trang chính
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}